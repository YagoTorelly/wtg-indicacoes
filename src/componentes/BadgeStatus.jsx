import { STATUS } from '../constantes'

export default function BadgeStatus({ status }) {
  const config = STATUS[status] || { label: status, cor: '#9CA3AF' }

  const mapa = {
    em_andamento: {
      color: 'var(--amarelo)',
      background: 'var(--amarelo-bg)',
    },
    realizado: {
      color: 'var(--verde)',
      background: 'var(--verde-bg)',
    },
    nao_realizado: {
      color: 'var(--vermelho)',
      background: 'var(--vermelho-bg)',
    },
  }

  const cores = mapa[status] || { color: '#6B7280', background: '#F3F4F6' }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '3px 10px',
        borderRadius: '99px',
        fontSize: '11px',
        fontWeight: '600',
        letterSpacing: '0.3px',
        color: cores.color,
        background: cores.background,
      }}
    >
      <span
        style={{
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: cores.color,
          display: 'inline-block',
        }}
      />
      {config.label}
    </span>
  )
}
