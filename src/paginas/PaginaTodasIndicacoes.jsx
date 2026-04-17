import { useEffect, useState } from 'react'
import Layout from '../componentes/Layout'
import TabelaIndicacoes from '../componentes/TabelaIndicacoes'
import FiltrosIndicacoes from '../componentes/FiltrosIndicacoes'
import Paginacao from '../componentes/Paginacao'
import Modal from '../componentes/Modal'
import FormularioIndicacao from '../componentes/FormularioIndicacao'
import { useIndicacoes } from '../hooks/useIndicacoes'

export default function PaginaTodasIndicacoes() {
  const {
    indicacoes,
    total,
    carregando,
    erro,
    pagina,
    totalPaginas,
    carregar,
    atualizar,
    deletar,
    mudarPagina,
    mudarFiltros,
  } = useIndicacoes()

  const [modalAberto, setModalAberto] = useState(false)
  const [indicacaoEditando, setIndicacaoEditando] = useState(null)
  const [modalConfirmarDelete, setModalConfirmarDelete] = useState(null)
  const [salvando, setSalvando] = useState(false)
  const [mensagem, setMensagem] = useState(null)

  useEffect(() => {
    carregar()
  }, [])

  function abrirEditar(indicacao) {
    setIndicacaoEditando(indicacao)
    setModalAberto(true)
  }

  function fecharModal() {
    setModalAberto(false)
    setIndicacaoEditando(null)
  }

  async function handleSalvar(dados) {
    setSalvando(true)
    try {
      await atualizar(indicacaoEditando.id, dados)
      exibirMensagem('Indicação atualizada com sucesso!', 'sucesso')
      fecharModal()
    } catch (e) {
      exibirMensagem(e.message, 'erro')
    } finally {
      setSalvando(false)
    }
  }

  async function handleConfirmarDelete() {
    if (!modalConfirmarDelete) return
    try {
      await deletar(modalConfirmarDelete.id)
      exibirMensagem('Indicação excluída.', 'sucesso')
    } catch (e) {
      exibirMensagem(e.message, 'erro')
    } finally {
      setModalConfirmarDelete(null)
    }
  }

  function exibirMensagem(texto, tipo) {
    setMensagem({ texto, tipo })
    setTimeout(() => setMensagem(null), 3500)
  }

  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Cabeçalho */}
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--cinza-900)', letterSpacing: '-0.5px' }}>
            Todas as Indicações
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--cinza-500)', marginTop: '4px' }}>
            {total > 0
              ? `${total} indicação${total !== 1 ? 's' : ''} no total`
              : 'Nenhuma indicação registrada'}
          </p>
        </div>

        {/* Toast */}
        {mensagem && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius)',
              background: mensagem.tipo === 'sucesso' ? 'var(--verde-bg)' : 'var(--vermelho-bg)',
              border: `1px solid ${mensagem.tipo === 'sucesso' ? 'var(--verde)' : 'var(--vermelho)'}`,
              color: mensagem.tipo === 'sucesso' ? 'var(--verde)' : 'var(--vermelho)',
              fontSize: '13px',
              fontWeight: '500',
              animation: 'fadeIn 0.2s ease',
            }}
          >
            {mensagem.texto}
          </div>
        )}

        {/* Erro */}
        {erro && (
          <div style={{ padding: '12px 16px', background: 'var(--vermelho-bg)', borderRadius: 'var(--radius)', color: 'var(--vermelho)', fontSize: '13px' }}>
            Erro: {erro}
          </div>
        )}

        {/* Filtros */}
        <FiltrosIndicacoes onChange={mudarFiltros} />

        {/* Tabela — admin vê coluna de criador */}
        <TabelaIndicacoes
          indicacoes={indicacoes}
          carregando={carregando}
          mostrarColunaCriador={true}
          onEditar={abrirEditar}
          onDeletar={setModalConfirmarDelete}
        />

        {/* Paginação */}
        <Paginacao pagina={pagina} totalPaginas={totalPaginas} onMudar={mudarPagina} />
      </div>

      {/* Modal Editar */}
      <Modal
        aberto={modalAberto}
        onFechar={fecharModal}
        titulo="Editar Indicação"
        largura="640px"
      >
        <FormularioIndicacao
          dados={indicacaoEditando || {}}
          onSubmit={handleSalvar}
          carregando={salvando}
        />
      </Modal>

      {/* Modal Confirmar Exclusão */}
      <Modal
        aberto={!!modalConfirmarDelete}
        onFechar={() => setModalConfirmarDelete(null)}
        titulo="Confirmar exclusão"
        largura="400px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <p style={{ fontSize: '14px', color: 'var(--cinza-700)', lineHeight: '1.6' }}>
            Tem certeza que deseja excluir a indicação de{' '}
            <strong>{modalConfirmarDelete?.cliente}</strong>?
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setModalConfirmarDelete(null)}
              style={{
                padding: '9px 18px',
                border: 'var(--borda)',
                borderRadius: 'var(--radius)',
                background: 'var(--branco)',
                color: 'var(--cinza-700)',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmarDelete}
              style={{
                padding: '9px 18px',
                border: 'none',
                borderRadius: 'var(--radius)',
                background: 'var(--vermelho)',
                color: 'var(--branco)',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Excluir
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  )
}
