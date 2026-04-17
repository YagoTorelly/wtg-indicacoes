import { useState, useCallback } from 'react'
import {
  listarIndicacoes,
  criarIndicacao,
  atualizarIndicacao,
  deletarIndicacao,
} from '../servicos/indicacoes'

export function useIndicacoes() {
  const [indicacoes, setIndicacoes] = useState([])
  const [total, setTotal] = useState(0)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)
  const [pagina, setPagina] = useState(1)
  const [filtros, setFiltros] = useState({})

  const POR_PAGINA = 20

  const carregar = useCallback(
    async (novaPagina = pagina, novosFiltros = filtros) => {
      setCarregando(true)
      setErro(null)
      try {
        const resultado = await listarIndicacoes({
          pagina: novaPagina,
          porPagina: POR_PAGINA,
          filtros: novosFiltros,
        })
        setIndicacoes(resultado.indicacoes)
        setTotal(resultado.total)
        setPagina(novaPagina)
        setFiltros(novosFiltros)
      } catch (e) {
        setErro(e.message)
      } finally {
        setCarregando(false)
      }
    },
    [pagina, filtros]
  )

  async function criar(dados) {
    const nova = await criarIndicacao(dados)
    await carregar(1, filtros)
    return nova
  }

  async function atualizar(id, dados) {
    const atualizada = await atualizarIndicacao(id, dados)
    setIndicacoes((prev) => prev.map((i) => (i.id === id ? atualizada : i)))
    return atualizada
  }

  function atualizarLocal(id, parcial) {
    setIndicacoes((prev) => prev.map((i) => (i.id === id ? { ...i, ...parcial } : i)))
  }

  async function deletar(id) {
    await deletarIndicacao(id)
    setIndicacoes((prev) => prev.filter((i) => i.id !== id))
    setTotal((prev) => prev - 1)
  }

  const totalPaginas = Math.ceil(total / POR_PAGINA)

  return {
    indicacoes,
    total,
    carregando,
    erro,
    pagina,
    totalPaginas,
    filtros,
    carregar,
    criar,
    atualizar,
    atualizarLocal,
    deletar,
    mudarPagina: (p) => carregar(p, filtros),
    mudarFiltros: (f) => carregar(1, f),
  }
}
