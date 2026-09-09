'use client'

import { useState } from 'react'
import { Lock } from 'lucide-react'

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
        background: '#120B1F',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', -apple-system, sans-serif",
        padding: '16px',
      }}
    >
      <form
        onSubmit={entrar}
        style={{
          width: '100%',
          maxWidth: '340px',
          background: '#1B1330',
          borderRadius: '16px',
          padding: '36px 32px',
          border: '1px solid #2E2147',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
          <img src="/logo.svg" alt="Élite Digital Pages" style={{ height: '30px', filter: 'brightness(0) invert(1)' }} />
          <div
            style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 55%, #F59E0B 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Lock size={20} color="#fff" />
          </div>
        </div>
        <h1
          style={{
            fontSize: '16px', fontWeight: 700, margin: 0, textAlign: 'center', color: '#F5F2FF',
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
            padding: '12px 14px',
            border: '1px solid #2E2147',
            background: '#120B1F',
            color: '#F5F2FF',
            borderRadius: '8px',
            fontSize: '14px',
          }}
        />
        {erro && <p style={{ color: '#FB7185', fontSize: '13px', margin: 0, textAlign: 'center' }}>{erro}</p>}
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
