import { useState } from 'react'
import { PRODUTOS, STATUS } from '../constantes'

const estiloInput = {
  padding: '8px 12px',
  border: 'var(--borda)',
  borderRadius: 'var(--radius)',
  fontSize: '13px',
  color: 'var(--cinza-900)',
  background: 'var(--branco)',
  outline: 'none',
  transition: 'border-color 0.15s',
}

export default function FiltrosIndicacoes({ onChange }) {
  const [busca, setBusca] = useState('')
  const [status, setStatus] = useState('')
  const [produto, setProduto] = useState('')

  function aplicar(novosBusca = busca, novoStatus = status, novoProduto = produto) {
    onChange({
      busca: novosBusca || undefined,
      status: novoStatus || undefined,
      produto: novoProduto || undefined,
    })
  }

  function limpar() {
    setBusca('')
    setStatus('')
    setProduto('')
    onChange({})
  }

  const temFiltros = busca || status || produto

  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      <input
        style={{ ...estiloInput, minWidth: '200px', flex: 1 }}
        placeholder="Buscar por cliente, e-mail ou telefone..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') aplicar(e.target.value, status, produto) }}
        onBlur={(e) => aplicar(e.target.value, status, produto)}
        onFocus={(e) => { e.target.style.borderColor = 'var(--azul)' }}
      />

      <select
        style={{ ...estiloInput, minWidth: '160px' }}
        value={status}
        onChange={(e) => { setStatus(e.target.value); aplicar(busca, e.target.value, produto) }}
      >
        <option value="">Todos os status</option>
        {Object.entries(STATUS).map(([key, { label }]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>

      <select
        style={{ ...estiloInput, minWidth: '160px' }}
        value={produto}
        onChange={(e) => { setProduto(e.target.value); aplicar(busca, status, e.target.value) }}
      >
        <option value="">Todos os produtos</option>
        {PRODUTOS.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      {temFiltros && (
        <button
          onClick={limpar}
          style={{
            padding: '8px 14px',
            border: 'var(--borda)',
            borderRadius: 'var(--radius)',
            background: 'var(--branco)',
            color: 'var(--cinza-700)',
            fontSize: '13px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--cinza-100)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--branco)' }}
        >
          Limpar filtros
        </button>
      )}
    </div>
  )
}
