const FUSO_BRASILIA = 'America/Sao_Paulo'

export function obterDataValida(valor) {
  if (!valor) return null

  const data = new Date(valor)
  return Number.isNaN(data.getTime()) ? null : data
}

export function formatarDataBrasilia(valor) {
  const data = obterDataValida(valor)
  if (!data) return '—'

  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: FUSO_BRASILIA,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(data)
}

export function formatarDataHoraBrasilia(valor) {
  const data = obterDataValida(valor)
  if (!data) return null

  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: FUSO_BRASILIA,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(data)
}

export function obterHoraAtualBrasilia() {
  const partes = new Intl.DateTimeFormat('pt-BR', {
    timeZone: FUSO_BRASILIA,
    hour: '2-digit',
    hour12: false,
  }).formatToParts(new Date())

  const hora = partes.find((parte) => parte.type === 'hour')?.value
  return Number(hora)
}

export { FUSO_BRASILIA }
