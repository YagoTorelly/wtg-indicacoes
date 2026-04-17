import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contextos/ContextoAuth'
import { sair } from '../servicos/autenticacao'
import { ROTAS } from '../constantes'

export default function Layout({ children }) {
  const { usuario, perfil } = useAuth()
  const navigate = useNavigate()

  async function handleSair() {
    await sair()
    navigate(ROTAS.LOGIN)
  }

  const itensNav = perfil?.isAdmin
    ? [
        { para: ROTAS.DASHBOARD, label: 'Dashboard', icone: '◈' },
        { para: ROTAS.TODAS_INDICACOES, label: 'Todas as Indicações', icone: '≡' },
      ]
    : [
        { para: ROTAS.DASHBOARD, label: 'Dashboard', icone: '◈' },
        { para: ROTAS.MINHAS_INDICACOES, label: 'Minhas Indicações', icone: '≡' },
      ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--cinza-100)' }}>
      <aside className="layout-sidebar">
        <div style={{ padding: '24px 20px', borderBottom: 'var(--borda)', overflow: 'hidden' }}>
          <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--azul)', letterSpacing: '-0.5px', whiteSpace: 'nowrap' }}>
            WTG
          </div>
          <div className="sidebar-sub" style={{ whiteSpace: 'nowrap' }}>
            Sistema de Indicações
          </div>
        </div>

        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {itensNav.map((item) => (
            <NavLink
              key={item.para}
              to={item.para}
              className="sidebar-nav-link"
              style={({ isActive }) => ({
                color: isActive ? 'var(--azul)' : 'var(--cinza-700)',
                background: isActive ? 'var(--azul-claro)' : 'transparent',
                fontWeight: isActive ? '600' : '400',
              })}
            >
              <span style={{ fontSize: '16px', opacity: 0.8, flexShrink: 0 }}>{item.icone}</span>
              <span className="sidebar-label" style={{ whiteSpace: 'nowrap' }}>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '16px 12px', borderTop: 'var(--borda)' }}>
          <div className="sidebar-usuario-info" style={{ padding: '10px 12px', borderRadius: 'var(--radius)', marginBottom: '8px' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--cinza-900)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {perfil?.full_name || 'Usuário'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--cinza-500)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {usuario?.email}
            </div>
          </div>
          <button
            style={{
              width: '100%',
              padding: '9px 12px',
              borderRadius: 'var(--radius)',
              border: 'var(--borda)',
              background: 'var(--branco)',
              color: 'var(--cinza-700)',
              fontSize: '13px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all var(--transicao)',
              cursor: 'pointer',
            }}
            onClick={handleSair}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--cinza-100)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--branco)' }}
          >
            <span>↩</span>
            <span className="sidebar-btn-texto">Sair</span>
          </button>
        </div>
      </aside>

      <main className="layout-conteudo">
        <div className="animar-entrada">{children}</div>
      </main>
    </div>
  )
}
