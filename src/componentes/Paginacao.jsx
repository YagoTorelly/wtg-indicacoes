export default function Paginacao({ pagina, totalPaginas, onMudar }) {
  if (totalPaginas <= 1) return null

  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1)
  const visiveis = paginas.filter(
    (p) => p === 1 || p === totalPaginas || Math.abs(p - pagina) <= 1
  )

  const estilo = (ativa) => ({
    padding: '6px 12px',
    border: ativa ? '2px solid var(--azul)' : 'var(--borda)',
    borderRadius: '6px',
    background: ativa ? 'var(--azul)' : 'var(--branco)',
    color: ativa ? 'var(--branco)' : 'var(--cinza-700)',
    fontSize: '13px',
    fontWeight: ativa ? '600' : '400',
    cursor: 'pointer',
    transition: 'all 0.15s',
    minWidth: '36px',
    textAlign: 'center',
  })

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        padding: '16px 0',
      }}
    >
      <button
        style={estilo(false)}
        disabled={pagina === 1}
        onClick={() => onMudar(pagina - 1)}
      >
        ‹
      </button>

      {visiveis.map((p, i) => {
        const anterior = visiveis[i - 1]
        const mostrarElipse = anterior && p - anterior > 1

        return (
          <span key={p} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {mostrarElipse && (
              <span style={{ color: 'var(--cinza-500)', padding: '0 4px' }}>…</span>
            )}
            <button style={estilo(p === pagina)} onClick={() => onMudar(p)}>
              {p}
            </button>
          </span>
        )
      })}

      <button
        style={estilo(false)}
        disabled={pagina === totalPaginas}
        onClick={() => onMudar(pagina + 1)}
      >
        ›
      </button>
    </div>
  )
}
