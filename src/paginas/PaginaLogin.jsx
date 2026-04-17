import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { entrar } from '../servicos/autenticacao'
import { ROTAS } from '../constantes'

export default function PaginaLogin() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setErro(null)
    setCarregando(true)

    try {
      await entrar({ email, senha })
      navigate(ROTAS.DASHBOARD)
    } catch (err) {
      setErro('E-mail ou senha incorretos.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--cinza-100)',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          animation: 'fadeIn 0.3s ease',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              height: '56px',
              background: 'var(--azul)',
              borderRadius: '16px',
              marginBottom: '16px',
              boxShadow: '0 8px 24px rgba(29,78,216,0.3)',
            }}
          >
            <span style={{ color: 'white', fontSize: '24px', fontWeight: '700' }}>W</span>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--cinza-900)', letterSpacing: '-0.5px' }}>
            WTG Indicações
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--cinza-500)', marginTop: '6px' }}>
            Sistema de gerenciamento de indicações
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: 'var(--branco)',
            border: 'var(--borda)',
            borderRadius: 'var(--radius-lg)',
            padding: '32px',
            boxShadow: 'var(--sombra-md)',
          }}
        >
          {erro && (
            <div
              style={{
                padding: '12px 16px',
                background: 'var(--vermelho-bg)',
                border: '1px solid var(--vermelho)',
                borderRadius: 'var(--radius)',
                color: 'var(--vermelho)',
                fontSize: '13px',
                marginBottom: '20px',
              }}
            >
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label
                htmlFor="email"
                style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: 'var(--cinza-700)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
                style={{
                  padding: '11px 14px',
                  border: 'var(--borda)',
                  borderRadius: 'var(--radius)',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.15s',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--azul)' }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--cinza-300)' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label
                htmlFor="senha"
                style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: 'var(--cinza-700)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Senha
              </label>
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  padding: '11px 14px',
                  border: 'var(--borda)',
                  borderRadius: 'var(--radius)',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.15s',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--azul)' }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--cinza-300)' }}
              />
            </div>

            <button
              type="submit"
              disabled={carregando}
              style={{
                padding: '12px',
                background: carregando ? 'var(--cinza-400)' : 'var(--azul)',
                color: 'var(--branco)',
                border: 'none',
                borderRadius: 'var(--radius)',
                fontSize: '14px',
                fontWeight: '600',
                marginTop: '8px',
                transition: 'background 0.15s',
                boxShadow: carregando ? 'none' : '0 4px 12px rgba(29,78,216,0.25)',
              }}
              onMouseEnter={(e) => { if (!carregando) e.currentTarget.style.background = 'var(--azul-hover)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = carregando ? 'var(--cinza-400)' : 'var(--azul)' }}
            >
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--cinza-500)', marginTop: '24px' }}>
          WTG Corretora de Seguros © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
