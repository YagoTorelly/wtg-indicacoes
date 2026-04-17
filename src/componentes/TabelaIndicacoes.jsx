import BadgeStatus from './BadgeStatus'
import { formatarDataBrasilia } from '../utils/dataHora'

const estilos = {
  wrapper: {
    background: 'var(--branco)',
    border: 'var(--borda)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    boxShadow: 'var(--sombra)',
  },
  tabela: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '11px 16px',
    textAlign: 'left',
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--cinza-500)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    background: 'var(--cinza-100)',
    borderBottom: 'var(--borda)',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '13px 16px',
    fontSize: '13px',
    color: 'var(--cinza-900)',
    borderBottom: '1px solid var(--cinza-200)',
    verticalAlign: 'middle',
  },
  acoes: {
    display: 'flex',
    gap: '8px',
  },
  btnAcao: {
    padding: '5px 12px',
    borderRadius: '6px',
    border: 'var(--borda)',
    background: 'var(--branco)',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all var(--transicao)',
  },
}

function formatarValor(valor) {
  if (valor == null) return '—'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor)
}

function formatarData(data) {
  if (!data) return '—'
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(data))
}

export default function TabelaIndicacoes({
  indicacoes,
  carregando,
  mostrarColunaCriador = false,
  onEditar,
  onDeletar,
  onAlterarStatus,
}) {
  if (carregando) {
    return (
      <div style={{ ...estilos.wrapper, padding: '40px', textAlign: 'center', color: 'var(--cinza-500)' }}>
        Carregando indicações...
      </div>
    )
  }

  if (!indicacoes || indicacoes.length === 0) {
    return (
      <div style={{ ...estilos.wrapper, padding: '60px', textAlign: 'center', color: 'var(--cinza-500)' }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>◎</div>
        <div style={{ fontWeight: '500' }}>Nenhuma indicação encontrada</div>
      </div>
    )
  }

  return (
    <div style={estilos.wrapper}>
      <div style={{ overflowX: 'auto' }}>
        <table style={estilos.tabela}>
          <thead>
            <tr>
              <th style={estilos.th}>Cliente</th>
              <th style={estilos.th}>Telefone</th>
              <th style={estilos.th}>Produto</th>
              <th style={estilos.th}>Direcionado para</th>
              {mostrarColunaCriador && <th style={estilos.th}>Indicado por</th>}
              <th style={estilos.th}>Status</th>
              <th style={estilos.th}>Valor</th>
              <th style={estilos.th}>Data</th>
              <th style={estilos.th}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {indicacoes.map((item, idx) => (
              <tr
                key={item.id}
                style={{
                  background: idx % 2 === 0 ? 'var(--branco)' : 'var(--cinza-100)',
                  transition: 'background var(--transicao)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--azul-claro)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = idx % 2 === 0 ? 'var(--branco)' : 'var(--cinza-100)' }}
              >
                <td style={estilos.td}>
                  <div style={{ fontWeight: '500' }}>{item.cliente}</div>
                  {item.email && (
                    <div style={{ fontSize: '11px', color: 'var(--cinza-500)', marginTop: '2px' }}>
                      {item.email}
                    </div>
                  )}
                </td>
                <td style={{ ...estilos.td, fontFamily: "'DM Mono', monospace", fontSize: '12px' }}>
                  {item.telefone}
                </td>
                <td style={estilos.td}>{item.produto_interesse}</td>
                <td style={estilos.td}>{item.direcionado_para}</td>
                {mostrarColunaCriador && (
                  <td style={estilos.td}>
                    {item.profiles?.full_name || item.profiles?.email || '—'}
                  </td>
                )}
                <td style={estilos.td}>
                  <BadgeStatus status={item.status} />
                </td>
                <td style={{ ...estilos.td, fontFamily: "'DM Mono', monospace", fontSize: '12px' }}>
                  {formatarValor(item.valor)}
                </td>
                <td style={{ ...estilos.td, fontSize: '12px', color: 'var(--cinza-500)' }}>
                  {formatarDataBrasilia(item.data_indicacao)}
                </td>
                <td style={estilos.td}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={estilos.acoes}>
                      <button
                        style={{ ...estilos.btnAcao, color: 'var(--azul)' }}
                        onClick={() => onEditar(item)}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--azul-claro)'; e.currentTarget.style.borderColor = 'var(--azul)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--branco)'; e.currentTarget.style.borderColor = 'var(--cinza-300)' }}
                      >
                        Editar
                      </button>
                      <button
                        style={{ ...estilos.btnAcao, color: 'var(--vermelho)' }}
                        onClick={() => onDeletar(item)}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--vermelho-bg)'; e.currentTarget.style.borderColor = 'var(--vermelho)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--branco)'; e.currentTarget.style.borderColor = 'var(--cinza-300)' }}
                      >
                        Excluir
                      </button>
                    </div>
                    {onAlterarStatus && (
                      <div style={estilos.acoes}>
                        <button
                          style={{
                            ...estilos.btnAcao,
                            color: item.status === 'realizado' ? 'var(--branco)' : 'var(--verde)',
                            background: item.status === 'realizado' ? 'var(--verde)' : 'var(--branco)',
                            borderColor: 'var(--verde)',
                            fontSize: '11px',
                          }}
                          onClick={() => onAlterarStatus(item, 'realizado')}
                          disabled={item.status === 'realizado'}
                          onMouseEnter={(e) => { if (item.status !== 'realizado') { e.currentTarget.style.background = 'var(--verde-bg)' } }}
                          onMouseLeave={(e) => { if (item.status !== 'realizado') { e.currentTarget.style.background = 'var(--branco)' } }}
                        >
                          ✓ Realizado
                        </button>
                        <button
                          style={{
                            ...estilos.btnAcao,
                            color: item.status === 'nao_realizado' ? 'var(--branco)' : 'var(--vermelho)',
                            background: item.status === 'nao_realizado' ? 'var(--vermelho)' : 'var(--branco)',
                            borderColor: 'var(--vermelho)',
                            fontSize: '11px',
                          }}
                          onClick={() => onAlterarStatus(item, 'nao_realizado')}
                          disabled={item.status === 'nao_realizado'}
                          onMouseEnter={(e) => { if (item.status !== 'nao_realizado') { e.currentTarget.style.background = 'var(--vermelho-bg)' } }}
                          onMouseLeave={(e) => { if (item.status !== 'nao_realizado') { e.currentTarget.style.background = 'var(--branco)' } }}
                        >
                          ✕ Não realizado
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
