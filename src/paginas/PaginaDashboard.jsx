import { useEffect, useState } from 'react'
import Layout from '../componentes/Layout'
import { useAuth } from '../contextos/ContextoAuth'
import { obterResumo, obterResumoUsuario, obterResumoPorUsuario } from '../servicos/indicacoes'
import { obterHoraAtualBrasilia } from '../utils/dataHora'

function CartaoMetrica({ titulo, valor, cor = 'var(--azul)', icone, rodape }) {
  return (
    <div
      style={{
        background: 'var(--branco)',
        border: 'var(--borda)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        boxShadow: 'var(--sombra)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--cinza-500)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {titulo}
        </span>
        <span
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: cor + '18',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
          }}
        >
          {icone}
        </span>
      </div>
      <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--cinza-900)', letterSpacing: '-1px' }}>
        {valor}
      </div>
      {rodape && (
        <div style={{ fontSize: '12px', color: 'var(--cinza-500)' }}>{rodape}</div>
      )}
    </div>
  )
}

function formatarMoeda(valor) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

function LinhaUsuario({ usuario }) {
  const pctRealizado = usuario.total > 0 ? Math.round((usuario.realizadas / usuario.total) * 100) : 0
  return (
    <tr>
      <td style={tdEstilo}>
        <div style={{ fontWeight: '500', color: 'var(--cinza-900)' }}>{usuario.nome}</div>
        {usuario.email && (
          <div style={{ fontSize: '11px', color: 'var(--cinza-500)', marginTop: '2px' }}>{usuario.email}</div>
        )}
      </td>
      <td style={{ ...tdEstilo, textAlign: 'center', fontWeight: '600' }}>{usuario.total}</td>
      <td style={{ ...tdEstilo, textAlign: 'center' }}>
        <span style={{ fontWeight: '600', color: 'var(--amarelo)' }}>{usuario.emAndamento}</span>
      </td>
      <td style={{ ...tdEstilo, textAlign: 'center' }}>
        <span style={{ fontWeight: '600', color: 'var(--verde)' }}>{usuario.realizadas}</span>
      </td>
      <td style={{ ...tdEstilo, textAlign: 'center' }}>
        <span style={{ fontWeight: '600', color: 'var(--vermelho)' }}>{usuario.naoRealizadas}</span>
      </td>
      <td style={{ ...tdEstilo, textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ flex: 1, height: '6px', background: 'var(--cinza-200)', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{ width: `${pctRealizado}%`, height: '100%', background: 'var(--verde)', borderRadius: '99px', transition: 'width 0.6s ease' }} />
          </div>
          <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--cinza-700)', width: '36px', textAlign: 'right' }}>{pctRealizado}%</span>
        </div>
      </td>
      <td style={{ ...tdEstilo, textAlign: 'right', fontFamily: "'DM Mono', monospace", fontSize: '12px', color: 'var(--verde)' }}>
        {usuario.valorTotal > 0 ? formatarMoeda(usuario.valorTotal) : '—'}
      </td>
    </tr>
  )
}

const tdEstilo = {
  padding: '13px 16px',
  fontSize: '13px',
  borderBottom: '1px solid var(--cinza-200)',
  verticalAlign: 'middle',
}

export default function PaginaDashboard() {
  const { perfil } = useAuth()
  const [resumo, setResumo] = useState(null)
  const [resumoPorUsuario, setResumoPorUsuario] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    async function carregar() {
      try {
        const dados = perfil?.isAdmin
          ? await obterResumo()
          : await obterResumoUsuario()
        setResumo(dados)

        if (perfil?.isAdmin) {
          const porUsuario = await obterResumoPorUsuario()
          setResumoPorUsuario(porUsuario)
        }
      } catch (e) {
        setErro(e.message)
      } finally {
        setCarregando(false)
      }
    }
    if (perfil !== null) carregar()
  }, [perfil])

  const saudacao = () => {
    const hora = obterHoraAtualBrasilia()
    if (hora < 12) return 'Bom dia'
    if (hora < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Cabeçalho */}
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--cinza-900)', letterSpacing: '-0.5px' }}>
            {saudacao()}, {perfil?.full_name?.split(' ')[0] || 'bem-vindo'} 👋
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--cinza-500)', marginTop: '4px' }}>
            {perfil?.isAdmin ? 'Visão consolidada de todas as indicações' : 'Resumo das suas indicações'}
          </p>
        </div>

        {/* Métricas */}
        {carregando ? (
          <div style={{ color: 'var(--cinza-500)' }}>Carregando métricas...</div>
        ) : erro ? (
          <div style={{ color: 'var(--vermelho)' }}>Erro ao carregar: {erro}</div>
        ) : resumo && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            <CartaoMetrica
              titulo="Total de Indicações"
              valor={resumo.total}
              icone="◈"
              cor="var(--azul)"
              rodape="todas as indicações registradas"
            />
            <CartaoMetrica
              titulo="Em Andamento"
              valor={resumo.emAndamento}
              icone="⟳"
              cor="var(--amarelo)"
              rodape="aguardando retorno"
            />
            <CartaoMetrica
              titulo="Realizadas"
              valor={resumo.realizadas}
              icone="✓"
              cor="var(--verde)"
              rodape="negócios fechados"
            />
            <CartaoMetrica
              titulo="Não Realizadas"
              valor={resumo.naoRealizadas}
              icone="✕"
              cor="var(--vermelho)"
              rodape="oportunidades perdidas"
            />
            {perfil?.isAdmin && resumo.valorTotal != null && (
              <CartaoMetrica
                titulo="Volume Realizado"
                valor={formatarMoeda(resumo.valorTotal)}
                icone="R$"
                cor="var(--verde)"
                rodape="soma das indicações realizadas"
              />
            )}
          </div>
        )}

        {/* Taxa de conversão */}
        {resumo && resumo.total > 0 && (
          <div
            style={{
              background: 'var(--branco)',
              border: 'var(--borda)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              boxShadow: 'var(--sombra)',
            }}
          >
            <h2 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--cinza-700)', marginBottom: '20px' }}>
              Taxa de conversão
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <BarraProgresso label="Realizadas" valor={resumo.realizadas} total={resumo.total} cor="var(--verde)" />
              <BarraProgresso label="Em andamento" valor={resumo.emAndamento} total={resumo.total} cor="var(--amarelo)" />
              <BarraProgresso label="Não realizadas" valor={resumo.naoRealizadas} total={resumo.total} cor="var(--vermelho)" />
            </div>
          </div>
        )}

        {/* Indicações por usuário — apenas admin */}
        {perfil?.isAdmin && resumoPorUsuario.length > 0 && (
          <div
            style={{
              background: 'var(--branco)',
              border: 'var(--borda)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--sombra)',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '20px 24px', borderBottom: 'var(--borda)' }}>
              <h2 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--cinza-700)' }}>
                Indicações por colaborador
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--cinza-500)', marginTop: '4px' }}>
                {resumoPorUsuario.length} colaborador{resumoPorUsuario.length !== 1 ? 'es' : ''} com indicações
              </p>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--cinza-100)' }}>
                    {['Colaborador', 'Total', 'Em Andamento', 'Realizadas', 'Não Realizadas', 'Conversão', 'Volume'].map((col) => (
                      <th
                        key={col}
                        style={{
                          padding: '11px 16px',
                          textAlign: col === 'Colaborador' ? 'left' : 'center',
                          fontSize: '11px',
                          fontWeight: '600',
                          color: 'var(--cinza-500)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          borderBottom: 'var(--borda)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {resumoPorUsuario.map((u, idx) => (
                    <LinhaUsuario key={u.email || u.nome} usuario={u} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

function BarraProgresso({ label, valor, total, cor }) {
  const pct = total > 0 ? Math.round((valor / total) * 100) : 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <span style={{ fontSize: '12px', color: 'var(--cinza-700)', width: '110px', flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: '8px', background: 'var(--cinza-200)', borderRadius: '99px', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: cor, borderRadius: '99px', transition: 'width 0.6s ease' }} />
      </div>
      <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--cinza-700)', width: '44px', textAlign: 'right' }}>{pct}%</span>
      <span style={{ fontSize: '12px', color: 'var(--cinza-500)', width: '28px', textAlign: 'right' }}>{valor}</span>
    </div>
  )
}
