export function normalizarEntradaMoedaBrasil(valor) {
  if (valor == null) return ''

  return String(valor).replace(/[^\d.,]/g, '')
}

export function formatarValorParaEntrada(valor) {
  if (valor === null || valor === undefined || valor === '') return ''
  if (typeof valor === 'string') return normalizarEntradaMoedaBrasil(valor)
  if (!Number.isFinite(Number(valor))) return ''

  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(valor))
}

export function converterMoedaBrasilParaNumero(valor) {
  if (valor === null || valor === undefined || valor === '') return null

  const texto = normalizarEntradaMoedaBrasil(valor).trim()
  if (!texto) return null

  const semSeparadorMilhar = texto.replace(/\./g, '')
  const partes = semSeparadorMilhar.split(',')

  if (partes.length > 2) return null
  if (partes.some((parte) => parte && !/^\d+$/.test(parte))) return null

  const numeroNormalizado = partes.length === 2
    ? `${partes[0] || '0'}.${partes[1]}`
    : partes[0]

  if (!/^\d+(\.\d+)?$/.test(numeroNormalizado)) return null

  const numero = Number(numeroNormalizado)
  return Number.isFinite(numero) ? numero : null
}
