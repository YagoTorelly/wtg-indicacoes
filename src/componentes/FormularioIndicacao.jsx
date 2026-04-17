import { useState } from 'react'
import { PRODUTOS, STATUS } from '../constantes'
import { formatarDataHoraBrasilia, obterDataValida } from '../utils/dataHora'
import { converterMoedaBrasilParaNumero, formatarValorParaEntrada, normalizarEntradaMoedaBrasil } from '../utils/valor'

const estiloGrupo = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
}

const estiloLabel = {
  fontSize: '12px',
  fontWeight: '600',
  color: 'var(--cinza-700)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}

const estiloInput = {
  padding: '9px 12px',
  border: 'var(--borda)',
  borderRadius: 'var(--radius)',
  fontSize: '14px',
  color: 'var(--cinza-900)',
  background: 'var(--branco)',
  outline: 'none',
  transition: 'border-color var(--transicao)',
  width: '100%',
}

const estiloGrade = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px',
}

function normalizarObservacoes(observacoes) {
  if (!Array.isArray(observacoes)) return []

  return observacoes
    .map((observacao) => {
      if (typeof observacao === 'string') {
        return { texto: observacao, data: null }
      }

      if (!observacao || typeof observacao !== 'object') {
        return null
      }

      return {
        texto: typeof observacao.texto === 'string' ? observacao.texto : '',
        data: observacao.data ?? null,
      }
    })
    .filter((observacao) => observacao && observacao.texto.trim())
}

export default function FormularioIndicacao({ dados: dadosIniciais = {}, onSubmit, carregando }) {
  const [dados, setDados] = useState({
    cliente: dadosIniciais.cliente || '',
    telefone: dadosIniciais.telefone || '',
    email: dadosIniciais.email || '',
    cliente_wtg: dadosIniciais.cliente_wtg ?? false,
    tem_consultor: dadosIniciais.tem_consultor ?? false,
    nome_consultor: dadosIniciais.nome_consultor || '',
    produto_interesse: dadosIniciais.produto_interesse || '',
    direcionado_para: dadosIniciais.direcionado_para || '',
    status: dadosIniciais.status || 'em_andamento',
    valor: formatarValorParaEntrada(dadosIniciais.valor),
    observacoes: normalizarObservacoes(dadosIniciais.observacoes),
  })
  const [novaObservacao, setNovaObservacao] = useState('')
  const [erro, setErro] = useState(null)

  function adicionarObservacao() {
    const texto = novaObservacao.trim()
    if (!texto) return
    const entrada = { texto, data: new Date().toISOString() }
    setDados((prev) => ({ ...prev, observacoes: [...prev.observacoes, entrada] }))
    setNovaObservacao('')
  }

  function atualizar(campo, valor) {
    setDados((prev) => {
      const novo = { ...prev, [campo]: valor }
      if (campo === 'tem_consultor' && !valor) {
        novo.nome_consultor = ''
      }
      return novo
    })
  }

  function handleBlurValor(e) {
    e.target.style.borderColor = 'var(--cinza-300)'

    const valorNumerico = converterMoedaBrasilParaNumero(dados.valor)
    if (valorNumerico === null) return

    atualizar('valor', formatarValorParaEntrada(valorNumerico))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro(null)
    try {
      const valorNumerico = converterMoedaBrasilParaNumero(dados.valor)

      await onSubmit({
        ...dados,
        valor: valorNumerico,
      })
    } catch (err) {
      setErro(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {erro && (
        <div
          style={{
            padding: '12px 16px',
            background: 'var(--vermelho-bg)',
            border: '1px solid var(--vermelho)',
            borderRadius: 'var(--radius)',
            color: 'var(--vermelho)',
            fontSize: '13px',
          }}
        >
          {erro}
        </div>
      )}

      <div style={estiloGrade}>
        <Campo label="Cliente *" htmlFor="cliente">
          <input
            id="cliente"
            style={estiloInput}
            value={dados.cliente}
            onChange={(e) => atualizar('cliente', e.target.value)}
            required
            placeholder="Nome completo"
            onFocus={(e) => { e.target.style.borderColor = 'var(--azul)' }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--cinza-300)' }}
          />
        </Campo>

        <Campo label="Telefone *" htmlFor="telefone">
          <input
            id="telefone"
            style={estiloInput}
            value={dados.telefone}
            onChange={(e) => atualizar('telefone', e.target.value)}
            required
            placeholder="(00) 00000-0000"
            onFocus={(e) => { e.target.style.borderColor = 'var(--azul)' }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--cinza-300)' }}
          />
        </Campo>
      </div>

      <Campo label="E-mail" htmlFor="email">
        <input
          id="email"
          type="email"
          style={estiloInput}
          value={dados.email}
          onChange={(e) => atualizar('email', e.target.value)}
          placeholder="email@exemplo.com"
          onFocus={(e) => { e.target.style.borderColor = 'var(--azul)' }}
          onBlur={(e) => { e.target.style.borderColor = 'var(--cinza-300)' }}
        />
      </Campo>

      <div style={estiloGrade}>
        <Campo label="Cliente WTG?">
          <SeletorBooleano
            valor={dados.cliente_wtg}
            onChange={(v) => atualizar('cliente_wtg', v)}
          />
        </Campo>

        <Campo label="Tem consultor?">
          <SeletorBooleano
            valor={dados.tem_consultor}
            onChange={(v) => atualizar('tem_consultor', v)}
          />
        </Campo>
      </div>

      {dados.tem_consultor && (
        <Campo label="Nome do consultor *" htmlFor="nome_consultor">
          <input
            id="nome_consultor"
            style={estiloInput}
            value={dados.nome_consultor}
            onChange={(e) => atualizar('nome_consultor', e.target.value)}
            required={dados.tem_consultor}
            placeholder="Nome do consultor"
            onFocus={(e) => { e.target.style.borderColor = 'var(--azul)' }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--cinza-300)' }}
          />
        </Campo>
      )}

      <div style={estiloGrade}>
        <Campo label="Produto de interesse *" htmlFor="produto">
          <select
            id="produto"
            style={estiloInput}
            value={dados.produto_interesse}
            onChange={(e) => atualizar('produto_interesse', e.target.value)}
            required
            onFocus={(e) => { e.target.style.borderColor = 'var(--azul)' }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--cinza-300)' }}
          >
            <option value="">Selecione...</option>
            {PRODUTOS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </Campo>

        <Campo label="Status" htmlFor="status">
          <select
            id="status"
            style={estiloInput}
            value={dados.status}
            onChange={(e) => atualizar('status', e.target.value)}
            onFocus={(e) => { e.target.style.borderColor = 'var(--azul)' }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--cinza-300)' }}
          >
            {Object.entries(STATUS).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </Campo>
      </div>

      <Campo label="Direcionado para *" htmlFor="direcionado_para">
        <input
          id="direcionado_para"
          style={estiloInput}
          value={dados.direcionado_para}
          onChange={(e) => atualizar('direcionado_para', e.target.value)}
          required
          placeholder="Nome do responsável"
          onFocus={(e) => { e.target.style.borderColor = 'var(--azul)' }}
          onBlur={(e) => { e.target.style.borderColor = 'var(--cinza-300)' }}
        />
      </Campo>

      <Campo label="Valor (R$)" htmlFor="valor">
        <input
          id="valor"
          type="text"
          inputMode="decimal"
          style={estiloInput}
          value={dados.valor}
          onChange={(e) => atualizar('valor', normalizarEntradaMoedaBrasil(e.target.value))}
          placeholder="1.234,56"
          onFocus={(e) => { e.target.style.borderColor = 'var(--azul)' }}
          onBlur={handleBlurValor}
        />
      </Campo>

      {/* Observações */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label style={estiloLabel}>Observações</label>
          {dados.observacoes.length > 0 && (
            <span style={{ fontSize: '11px', color: 'var(--cinza-500)' }}>
              {dados.observacoes.length} registro{dados.observacoes.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {dados.observacoes.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto', paddingRight: '4px' }}>
            {[...dados.observacoes].reverse().map((obs, idx) => (
              (() => {
                const dataObservacao = obterDataValida(obs.data)

                return (
                  <div
                    key={idx}
                    style={{
                      padding: '10px 12px',
                      background: 'var(--cinza-100)',
                      borderRadius: 'var(--radius)',
                      borderLeft: '3px solid var(--azul)',
                    }}
                  >
                    {dataObservacao && (
                      <div style={{ fontSize: '11px', color: 'var(--cinza-500)', marginBottom: '4px' }}>
                        {formatarDataHoraBrasilia(dataObservacao)}
                      </div>
                    )}
                    <div style={{ fontSize: '13px', color: 'var(--cinza-900)', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                      {obs.texto}
                    </div>
                  </div>
                )
              })()
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px' }}>
          <textarea
            style={{
              ...estiloInput,
              resize: 'vertical',
              minHeight: '72px',
              lineHeight: '1.5',
            }}
            placeholder="Adicionar nova observação..."
            value={novaObservacao}
            onChange={(e) => setNovaObservacao(e.target.value)}
            onFocus={(e) => { e.target.style.borderColor = 'var(--azul)' }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--cinza-300)' }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) adicionarObservacao()
            }}
          />
          <button
            type="button"
            onClick={adicionarObservacao}
            disabled={!novaObservacao.trim()}
            style={{
              alignSelf: 'flex-end',
              padding: '9px 14px',
              border: 'var(--borda)',
              borderRadius: 'var(--radius)',
              background: novaObservacao.trim() ? 'var(--azul-claro)' : 'var(--cinza-200)',
              color: novaObservacao.trim() ? 'var(--azul)' : 'var(--cinza-500)',
              fontSize: '13px',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              transition: 'all var(--transicao)',
            }}
          >
            + Adicionar
          </button>
        </div>
        <div style={{ fontSize: '11px', color: 'var(--cinza-500)' }}>Ctrl+Enter para adicionar rapidamente</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '8px' }}>
        <button
          type="submit"
          disabled={carregando}
          style={{
            padding: '10px 24px',
            background: carregando ? 'var(--cinza-400)' : 'var(--azul)',
            color: 'var(--branco)',
            border: 'none',
            borderRadius: 'var(--radius)',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'background var(--transicao)',
            minWidth: '120px',
          }}
          onMouseEnter={(e) => { if (!carregando) e.currentTarget.style.background = 'var(--azul-hover)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = carregando ? 'var(--cinza-400)' : 'var(--azul)' }}
        >
          {carregando ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  )
}

function Campo({ label, htmlFor, children }) {
  return (
    <div style={estiloGrupo}>
      <label htmlFor={htmlFor} style={estiloLabel}>{label}</label>
      {children}
    </div>
  )
}

function SeletorBooleano({ valor, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      {[
        { v: true, label: 'Sim' },
        { v: false, label: 'Não' },
      ].map(({ v, label }) => (
        <button
          key={label}
          type="button"
          onClick={() => onChange(v)}
          style={{
            flex: 1,
            padding: '9px',
            border: valor === v ? '2px solid var(--azul)' : 'var(--borda)',
            borderRadius: 'var(--radius)',
            background: valor === v ? 'var(--azul-claro)' : 'var(--branco)',
            color: valor === v ? 'var(--azul)' : 'var(--cinza-700)',
            fontWeight: valor === v ? '600' : '400',
            fontSize: '13px',
            transition: 'all var(--transicao)',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
