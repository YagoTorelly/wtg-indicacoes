import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { ehAdmin, obterPerfil } from '../servicos/autenticacao'

const ContextoAuth = createContext(null)

export function ProvedorAuth({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [perfil, setPerfil] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      _processarSessao(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      _processarSessao(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function _processarSessao(session) {
    if (!session?.user) {
      setUsuario(null)
      setPerfil(null)
      setCarregando(false)
      return
    }

    setUsuario(session.user)

    try {
      const dadosPerfil = await obterPerfil(session.user.id)
      setPerfil({
        ...dadosPerfil,
        isAdmin: ehAdmin(session.user.email),
      })
    } catch {
      setPerfil({ isAdmin: ehAdmin(session.user.email) })
    }

    setCarregando(false)
  }

  return (
    <ContextoAuth.Provider value={{ usuario, perfil, carregando }}>
      {children}
    </ContextoAuth.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(ContextoAuth)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de ProvedorAuth')
  return ctx
}
