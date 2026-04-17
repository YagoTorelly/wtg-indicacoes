import { supabase } from '../supabase'
import { EMAIL_ADMIN } from '../constantes'

export async function entrar({ email, senha }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  })

  if (error) throw new Error(error.message)
  return data
}

export async function sair() {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(error.message)
}

export async function obterSessaoAtual() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw new Error(error.message)
  return data.session
}

export function ehAdmin(email) {
  return email === EMAIL_ADMIN
}

export async function obterPerfil(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw new Error(error.message)
  return data
}
