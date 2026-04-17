import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export default function Modal({ aberto, onFechar, titulo, children, largura = '560px' }) {
  const overlayRef = useRef(null)

  useEffect(() => {
    if (aberto) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [aberto])

  if (!aberto) return null

  return createPortal(
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(2px)',
          zIndex: 1000,
        }}
        onClick={onFechar}
      />

      <div
        ref={overlayRef}
        className="modal-scroll"
        onClick={(e) => { if (e.target === overlayRef.current) onFechar() }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: largura,
            background: 'var(--branco)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            animation: 'fadeIn 0.2s ease',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 24px',
              borderBottom: 'var(--borda)',
              borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
            }}
          >
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--cinza-900)' }}>
              {titulo}
            </h2>
            <button
              onClick={onFechar}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '22px',
                color: 'var(--cinza-500)',
                padding: '4px 8px',
                borderRadius: '4px',
                lineHeight: 1,
                cursor: 'pointer',
                transition: 'color var(--transicao)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--cinza-900)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--cinza-500)' }}
            >
              ×
            </button>
          </div>

          <div style={{ padding: '24px' }}>
            {children}
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}
