import { useEffect, useState } from 'react'
import Layout from '../componentes/Layout'
import TabelaIndicacoes from '../componentes/TabelaIndicacoes'
import FiltrosIndicacoes from '../componentes/FiltrosIndicacoes'
import Paginacao from '../componentes/Paginacao'
import Modal from '../componentes/Modal'
import FormularioIndicacao from '../componentes/FormularioIndicacao'
import { useIndicacoes } from '../hooks/useIndicacoes'
import { atualizarStatus } from '../servicos/indicacoes'

export default function PaginaMinhasIndicacoes() {
  const {
    indicacoes,
    total,
    carregando,
    erro,
    pagina,
    totalPaginas,
    carregar,
    criar,
    atualizar,
    atualizarLocal,
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

  function abrirCriar() {
    setIndicacaoEditando(null)
    setModalAberto(true)
  }

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
      if (indicacaoEditando) {
        await atualizar(indicacaoEditando.id, dados)
        exibirMensagem('Indicação atualizada com sucesso!', 'sucesso')
      } else {
        await criar(dados)
        exibirMensagem('Indicação criada com sucesso!', 'sucesso')
      }
      fecharModal()
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

  async function handleAlterarStatus(indicacao, novoStatus) {
    try {
      await atualizarStatus(indicacao.id, novoStatus)
      atualizarLocal(indicacao.id, { status: novoStatus })
      exibirMensagem(`Status atualizado para "${novoStatus === 'realizado' ? 'Realizado' : 'Não realizado'}"`, 'sucesso')
    } catch (e) {
      exibirMensagem(e.message, 'erro')
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
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--cinza-900)', letterSpacing: '-0.5px' }}>
              Minhas Indicações
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--cinza-500)', marginTop: '4px' }}>
              {total > 0 ? `${total} indicação${total !== 1 ? 's' : ''} registrada${total !== 1 ? 's' : ''}` : 'Nenhuma indicação ainda'}
            </p>
          </div>
          <button
            onClick={abrirCriar}
            style={{
              padding: '10px 20px',
              background: 'var(--azul)',
              color: 'var(--branco)',
              border: 'none',
              borderRadius: 'var(--radius)',
              fontSize: '13px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(29,78,216,0.25)',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--azul-hover)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--azul)' }}
          >
            <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span>
            Nova Indicação
          </button>
        </div>

        {/* Toast de feedback */}
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

        {/* Erro de carregamento */}
        {erro && (
          <div style={{ padding: '12px 16px', background: 'var(--vermelho-bg)', borderRadius: 'var(--radius)', color: 'var(--vermelho)', fontSize: '13px' }}>
            Erro: {erro}
          </div>
        )}

        {/* Filtros */}
        <FiltrosIndicacoes onChange={mudarFiltros} />

        {/* Tabela */}
        <TabelaIndicacoes
          indicacoes={indicacoes}
          carregando={carregando}
          mostrarColunaCriador={false}
          onEditar={abrirEditar}
          onDeletar={setModalConfirmarDelete}
          onAlterarStatus={handleAlterarStatus}
        />

        {/* Paginação */}
        <Paginacao pagina={pagina} totalPaginas={totalPaginas} onMudar={mudarPagina} />
      </div>

      {/* Modal Formulário */}
      <Modal
        aberto={modalAberto}
        onFechar={fecharModal}
        titulo={indicacaoEditando ? 'Editar Indicação' : 'Nova Indicação'}
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
            <strong>{modalConfirmarDelete?.cliente}</strong>? Esta ação não pode ser desfeita.
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
