import { Navigate } from 'react-router-dom'
import { useAuth } from '../contextos/ContextoAuth'
import { ROTAS } from '../constantes'

/**
 * Protege rotas que exigem autenticação.
 * Se requireAdmin = true, só admin passa.
 */
export default function RotaProtegida({ children, apenasAdmin = false }) {
  const { usuario, perfil, carregando } = useAuth()

  if (carregando) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--cinza-500)',
          fontSize: '14px',
          gap: '12px',
        }}
      >
        <span style={{ fontSize: '20px' }}>◌</span>
        Carregando...
      </div>
    )
  }

  if (!usuario) {
    return <Navigate to={ROTAS.LOGIN} replace />
  }

  if (apenasAdmin && !perfil?.isAdmin) {
    return <Navigate to={ROTAS.DASHBOARD} replace />
  }

  return children
}
