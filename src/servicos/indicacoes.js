import { supabase } from '../supabase'

/**
 * Lista indicações do usuário logado (RLS garante o escopo).
 * Admin vê todas, user vê apenas as suas.
 */
export async function listarIndicacoes({ pagina = 1, porPagina = 20, filtros = {} } = {}) {
  let query = supabase
    .from('indications')
    .select(
      `
      id,
      cliente,
      telefone,
      email,
      cliente_wtg,
      tem_consultor,
      nome_consultor,
      produto_interesse,
      direcionado_para,
      status,
      valor,
      data_indicacao,
      ultima_atualizacao,
      created_by,
      profiles:created_by (full_name, email)
    `,
      { count: 'exact' }
    )
    .order('data_indicacao', { ascending: false })
    .range((pagina - 1) * porPagina, pagina * porPagina - 1)

  if (filtros.status) query = query.eq('status', filtros.status)
  if (filtros.produto) query = query.eq('produto_interesse', filtros.produto)
  if (filtros.busca) {
    query = query.or(
      `cliente.ilike.%${filtros.busca}%,email.ilike.%${filtros.busca}%,telefone.ilike.%${filtros.busca}%`
    )
  }

  const { data, error, count } = await query

  if (error) throw new Error(error.message)
  return { indicacoes: data, total: count }
}

export async function obterIndicacao(id) {
  const { data, error } = await supabase
    .from('indications')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function criarIndicacao(dados) {
  _validarDados(dados)

  const payload = {
    cliente: dados.cliente,
    telefone: dados.telefone,
    email: dados.email || null,
    cliente_wtg: dados.cliente_wtg ?? false,
    tem_consultor: dados.tem_consultor ?? false,
    nome_consultor: dados.tem_consultor ? dados.nome_consultor : null,
    produto_interesse: dados.produto_interesse,
    direcionado_para: dados.direcionado_para,
    status: dados.status || 'em_andamento',
    valor: dados.valor != null ? Number(dados.valor) : null,
  }

  const { data, error } = await supabase
    .from('indications')
    .insert(payload)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function atualizarIndicacao(id, dados) {
  _validarDados(dados)

  const payload = {
    cliente: dados.cliente,
    telefone: dados.telefone,
    email: dados.email || null,
    cliente_wtg: dados.cliente_wtg ?? false,
    tem_consultor: dados.tem_consultor ?? false,
    nome_consultor: dados.tem_consultor ? dados.nome_consultor : null,
    produto_interesse: dados.produto_interesse,
    direcionado_para: dados.direcionado_para,
    status: dados.status,
    valor: dados.valor != null ? Number(dados.valor) : null,
  }

  const { data, error } = await supabase
    .from('indications')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function deletarIndicacao(id) {
  const { error } = await supabase.from('indications').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function obterResumo() {
  const { data, error } = await supabase.from('indications').select('status, valor')

  if (error) throw new Error(error.message)

  const total = data.length
  const realizadas = data.filter((i) => i.status === 'realizado').length
  const emAndamento = data.filter((i) => i.status === 'em_andamento').length
  const naoRealizadas = data.filter((i) => i.status === 'nao_realizado').length
  const valorTotal = data
    .filter((i) => i.status === 'realizado' && i.valor)
    .reduce((acc, i) => acc + Number(i.valor), 0)

  return { total, realizadas, emAndamento, naoRealizadas, valorTotal }
}

export async function obterResumoUsuario() {
  const { data, error } = await supabase.from('indications').select('status')

  if (error) throw new Error(error.message)

  const total = data.length
  const realizadas = data.filter((i) => i.status === 'realizado').length
  const emAndamento = data.filter((i) => i.status === 'em_andamento').length
  const naoRealizadas = data.filter((i) => i.status === 'nao_realizado').length

  return { total, realizadas, emAndamento, naoRealizadas }
}

export async function obterResumoPorUsuario() {
  const { data, error } = await supabase
    .from('indications')
    .select('status, valor, profiles:created_by (full_name, email)')

  if (error) throw new Error(error.message)

  const mapa = {}
  data.forEach((item) => {
    const nome = item.profiles?.full_name || item.profiles?.email || 'Desconhecido'
    const email = item.profiles?.email || ''
    const chave = email || nome
    if (!mapa[chave]) {
      mapa[chave] = { nome, email, total: 0, realizadas: 0, emAndamento: 0, naoRealizadas: 0, valorTotal: 0 }
    }
    mapa[chave].total++
    if (item.status === 'realizado') {
      mapa[chave].realizadas++
      if (item.valor) mapa[chave].valorTotal += Number(item.valor)
    }
    if (item.status === 'em_andamento') mapa[chave].emAndamento++
    if (item.status === 'nao_realizado') mapa[chave].naoRealizadas++
  })

  return Object.values(mapa).sort((a, b) => b.total - a.total)
}

function _validarDados(dados) {
  if (!dados.cliente?.trim()) throw new Error('Cliente é obrigatório.')
  if (!dados.telefone?.trim()) throw new Error('Telefone é obrigatório.')
  if (!dados.produto_interesse) throw new Error('Produto de interesse é obrigatório.')
  if (!dados.direcionado_para?.trim()) throw new Error('Direcionado para é obrigatório.')
  if (dados.tem_consultor && !dados.nome_consultor?.trim()) {
    throw new Error('Nome do consultor é obrigatório quando "Tem consultor" está marcado.')
  }
  if (dados.valor !== null && dados.valor !== undefined && dados.valor !== '') {
    if (Number(dados.valor) < 0) throw new Error('Valor não pode ser negativo.')
  }
}
