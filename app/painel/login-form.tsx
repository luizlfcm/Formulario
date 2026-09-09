'use client'

import { useState } from 'react'

export default function PainelLogin() {
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function entrar(e: React.FormEvent) {
    e.preventDefault()
    setCarregando(true)
    setErro('')
    try {
      const res = await fetch('/api/painel/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senha }),
      })
      if (res.ok) {
        window.location.reload()
      } else {
        const data = await res.json().catch(() => ({}))
        setErro(data.error || 'Senha incorreta')
        setCarregando(false)
      }
    } catch {
      setErro('Erro de conexão. Tente novamente.')
      setCarregando(false)
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#F6F3FB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      <form
        onSubmit={entrar}
        style={{
          width: '100%',
          maxWidth: '340px',
          background: '#fff',
          borderRadius: '14px',
          padding: '32px',
          boxShadow: '0 4px 24px rgba(124, 58, 237, 0.08)',
          border: '1px solid #EEE9F7',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <img src="/logo.svg" alt="Élite Digital Pages" style={{ height: '32px', margin: '0 auto 4px' }} />
        <h1
          style={{
            fontSize: '17px',
            fontWeight: 700,
            margin: 0,
            textAlign: 'center',
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          Painel de briefings
        </h1>
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          autoFocus
          style={{
            padding: '11px 13px',
            border: '1.5px solid #E4DEF0',
            borderRadius: '8px',
            fontSize: '14px',
          }}
        />
        {erro && <p style={{ color: '#C0243B', fontSize: '13px', margin: 0 }}>{erro}</p>}
        <button
          type="submit"
          disabled={carregando}
          style={{
            padding: '12px',
            background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 55%, #F59E0B 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </main>
  )
}
