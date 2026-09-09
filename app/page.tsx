'use client'

import { useState } from 'react'

// Nomes dos blocos, usados no indicador de progresso
const BLOCOS = [
  'Identificação',
  'Produto',
  'Prova',
  'Oferta',
  'Hospedagem',
  'Pixel',
  'Copy',
  'Visual',
  'Fechamento',
]

type Respostas = {
  nome_cliente: string
  email_cliente: string
  telefone: string
  nome_produto: string
  whatsapp_contato: string
  link_checkout: string
  tipo_produto: string
  promessa: string
  problema_dor: string
  publico_alvo: string
  preco: string
  tem_depoimentos: string
  resultados_numeros: string
  credenciais: string
  oferta_inclusa: string
  garantia: string
  tem_escassez: string
  escassez_desc: string
  tem_hospedagem: string
  hospedagem_login_senha: string
  quer_contratar_hospedagem: string
  tem_pixel: string
  pixel_info: string
  status_copy: string
  copy_texto: string
  link_vsl: string
  cores_preferencia: string
  referencia_pagina: string
  estilo_layout: string
  quer_contagem_regressiva: string
  quer_faq: string
  order_bumps: string[]
  observacao_extra: string
}

const VAZIO: Respostas = {
  nome_cliente: '', email_cliente: '', telefone: '',
  nome_produto: '', whatsapp_contato: '', link_checkout: '', tipo_produto: '',
  promessa: '', problema_dor: '', publico_alvo: '', preco: '',
  tem_depoimentos: '', resultados_numeros: '', credenciais: '',
  oferta_inclusa: '', garantia: '', tem_escassez: '', escassez_desc: '',
  tem_hospedagem: '', hospedagem_login_senha: '', quer_contratar_hospedagem: '',
  tem_pixel: '', pixel_info: '',
  status_copy: '', copy_texto: '',
  link_vsl: '', cores_preferencia: '', referencia_pagina: '', estilo_layout: '',
  quer_contagem_regressiva: '', quer_faq: '',
  order_bumps: [], observacao_extra: '',
}

export default function FormularioBriefing() {
  const [step, setStep] = useState(0)
  const [r, setR] = useState<Respostas>(VAZIO)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  const [concluido, setConcluido] = useState(false)

  const set = (campo: keyof Respostas, valor: any) =>
    setR((prev) => ({ ...prev, [campo]: valor }))

  const toggleBump = (valor: string) => {
    setR((prev) => ({
      ...prev,
      order_bumps: prev.order_bumps.includes(valor)
        ? prev.order_bumps.filter((v) => v !== valor)
        : [...prev.order_bumps, valor],
    }))
  }

  const podeAvancar = () => {
    if (step === 0) return r.nome_cliente && r.email_cliente
    return true
  }

  const avancar = () => setStep((s) => Math.min(s + 1, BLOCOS.length - 1))
  const voltar = () => setStep((s) => Math.max(s - 1, 0))

  async function enviar() {
    setEnviando(true)
    setErro('')
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(r),
      })
      if (!res.ok) throw new Error()
      setConcluido(true)
    } catch {
      setErro('Não foi possível enviar. Verifique sua conexão e tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  if (concluido) {
    return (
      <main style={S.page}>
        <div style={S.wrapper}>
          <Cabecalho />
          <div style={S.card}>
          <h1 style={S.h1}>Briefing recebido</h1>
          <p style={S.p}>
            Obrigado, {r.nome_cliente.split(' ')[0]}. Nossa equipe vai analisar
            suas respostas e, em caso de dúvida, entramos em contato pelo
            WhatsApp informado. Prazo de confecção: <strong>3 dias úteis</strong>.
          </p>
          <p style={S.p}>
            Se tiver depoimentos, fotos, logo ou outros materiais para a
            página, envie diretamente pelo nosso WhatsApp informando seu
            <strong> nome completo</strong>.
          </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main style={S.page}>
      <div style={S.wrapper}>
        <Cabecalho />
        <div style={S.card}>
        <Progresso step={step} />

        {step === 0 && (
          <Bloco titulo="Identificação">
            <Campo label="Nome do cliente" required>
              <input style={S.input} value={r.nome_cliente}
                onChange={(e) => set('nome_cliente', e.target.value)} />
            </Campo>
            <Campo label="E-mail do cliente" required>
              <input type="email" style={S.input} value={r.email_cliente}
                onChange={(e) => set('email_cliente', e.target.value)} />
            </Campo>
            <Campo label="Telefone">
              <input type="tel" style={S.input} value={r.telefone}
                onChange={(e) => set('telefone', e.target.value)} />
            </Campo>
          </Bloco>
        )}

        {step === 1 && (
          <Bloco titulo="Dados do produtor/produto">
            <Campo label="Nome/marca do produto">
              <input style={S.input} value={r.nome_produto}
                onChange={(e) => set('nome_produto', e.target.value)} />
            </Campo>
            <Campo label="WhatsApp para contato">
              <input style={S.input} value={r.whatsapp_contato}
                onChange={(e) => set('whatsapp_contato', e.target.value)} />
            </Campo>
            <Campo label="Link do checkout">
              <input style={S.input} value={r.link_checkout}
                onChange={(e) => set('link_checkout', e.target.value)} />
            </Campo>
            <Campo label="O que é o produto?">
              <Radios nome="tipo_produto" valor={r.tipo_produto}
                opcoes={['Curso', 'Mentoria', 'Ebook', 'Outro']}
                onChange={(v) => set('tipo_produto', v)} />
            </Campo>
            <Campo label="Qual a promessa principal do seu produto, em uma frase?">
              <input style={S.input} value={r.promessa}
                onChange={(e) => set('promessa', e.target.value)} />
            </Campo>
            <Campo label="Qual problema/dor esse produto resolve?">
              <textarea style={S.textarea} value={r.problema_dor}
                onChange={(e) => set('problema_dor', e.target.value)} />
            </Campo>
            <Campo label="Para quem é esse produto (público-alvo)?">
              <textarea style={S.textarea} value={r.publico_alvo}
                onChange={(e) => set('publico_alvo', e.target.value)} />
            </Campo>
            <Campo label="Qual o preço de venda do produto?">
              <input style={S.input} value={r.preco}
                onChange={(e) => set('preco', e.target.value)} />
            </Campo>
          </Bloco>
        )}

        {step === 2 && (
          <Bloco titulo="Prova e credibilidade">
            <Campo label="Você tem depoimentos reais de alunos/clientes?">
              <SimNao valor={r.tem_depoimentos} onChange={(v) => set('tem_depoimentos', v)} />
            </Campo>
            {r.tem_depoimentos === 'sim' && (
              <Aviso>
                Envie os prints/vídeos de depoimento pelo nosso WhatsApp,
                informando seu nome completo.
              </Aviso>
            )}
            <Campo label='Tem resultados ou números pra mostrar? (ex: "+500 alunos")'>
              <input style={S.input} value={r.resultados_numeros}
                onChange={(e) => set('resultados_numeros', e.target.value)} />
            </Campo>
            <Campo label="Tem alguma credencial/experiência relevante?">
              <input style={S.input} value={r.credenciais}
                onChange={(e) => set('credenciais', e.target.value)} />
            </Campo>
          </Bloco>
        )}

        {step === 3 && (
          <Bloco titulo="Oferta">
            <Campo label="O que está incluso no produto (módulos, bônus, etc)?">
              <textarea style={S.textarea} value={r.oferta_inclusa}
                onChange={(e) => set('oferta_inclusa', e.target.value)} />
            </Campo>
            <Campo label="Tem garantia? Qual prazo?">
              <input style={S.input} value={r.garantia}
                onChange={(e) => set('garantia', e.target.value)} />
            </Campo>
            <Campo label="Tem escassez real (vagas limitadas, prazo)?">
              <SimNao valor={r.tem_escassez} onChange={(v) => set('tem_escassez', v)} />
            </Campo>
            {r.tem_escassez === 'sim' && (
              <Campo label="Descreva">
                <input style={S.input} value={r.escassez_desc}
                  onChange={(e) => set('escassez_desc', e.target.value)} />
              </Campo>
            )}
          </Bloco>
        )}

        {step === 4 && (
          <Bloco titulo="Hospedagem">
            <Campo label="Você já tem hospedagem/domínio próprio?">
              <SimNao valor={r.tem_hospedagem} onChange={(v) => set('tem_hospedagem', v)} />
            </Campo>
            {r.tem_hospedagem === 'sim' && (
              <Campo label="Cole aqui o login e senha de acesso à sua hospedagem/domínio para subirmos a página">
                <textarea style={S.textarea} value={r.hospedagem_login_senha}
                  onChange={(e) => set('hospedagem_login_senha', e.target.value)} />
                <Aviso>
                  Por segurança, troque a senha assim que a página estiver no
                  ar. Se solicitar alguma revisão futura, será necessário
                  enviar a senha novamente.
                </Aviso>
              </Campo>
            )}
            {r.tem_hospedagem === 'não' && (
              <Campo label="Deseja contratar a hospedagem mensal (com suporte e revisões inclusas)?">
                <SimNao valor={r.quer_contratar_hospedagem} onChange={(v) => set('quer_contratar_hospedagem', v)} />
              </Campo>
            )}
          </Bloco>
        )}

        {step === 5 && (
          <Bloco titulo="Pixel">
            <Campo label="Você já tem Pixel configurado (Meta/TikTok/Google)?">
              <SimNao valor={r.tem_pixel} onChange={(v) => set('tem_pixel', v)} />
            </Campo>
            {r.tem_pixel === 'sim' && (
              <Campo label="Informe qual(is) e o ID/código de cada um">
                <textarea style={S.textarea} value={r.pixel_info}
                  onChange={(e) => set('pixel_info', e.target.value)} />
              </Campo>
            )}
          </Bloco>
        )}

        {step === 6 && (
          <Bloco titulo="Copy">
            <Campo label="Você já tem o texto/copy da página pronto?">
              <Radios nome="status_copy" valor={r.status_copy}
                opcoes={['Sim, vou colar/enviar', 'Não, quero que escrevam', 'Tenho uma base, mas quero que melhorem']}
                onChange={(v) => set('status_copy', v)} />
            </Campo>
            {(r.status_copy === 'Sim, vou colar/enviar' || r.status_copy === 'Tenho uma base, mas quero que melhorem') && (
              <Campo label="Cole o texto aqui">
                <textarea style={S.textarea} value={r.copy_texto}
                  onChange={(e) => set('copy_texto', e.target.value)} />
                <Aviso>Se preferir enviar um arquivo, mande pelo WhatsApp informando seu nome completo.</Aviso>
              </Campo>
            )}
          </Bloco>
        )}

        {step === 7 && (
          <Bloco titulo="Visual e layout">
            <Aviso>
              Envie pelo WhatsApp, informando seu nome completo: logo/imagem
              do produto e uma foto sua (produtor).
            </Aviso>
            <Campo label="Link do vídeo de vendas (VSL), se tiver">
              <input style={S.input} value={r.link_vsl}
                onChange={(e) => set('link_vsl', e.target.value)} />
            </Campo>
            <Campo label="Cores de preferência (opcional)">
              <input style={S.input} value={r.cores_preferencia}
                onChange={(e) => set('cores_preferencia', e.target.value)} />
            </Campo>
            <Campo label="Referência de outra página que você gosta (opcional)">
              <input style={S.input} value={r.referencia_pagina}
                onChange={(e) => set('referencia_pagina', e.target.value)} />
            </Campo>
            <Campo label="Qual estilo de layout prefere?">
              <Radios nome="estilo_layout" valor={r.estilo_layout}
                opcoes={['Clássico', 'Moderno-minimalista', 'Storytelling', 'Sigam o que converte melhor']}
                onChange={(v) => set('estilo_layout', v)} />
            </Campo>
            <Campo label="Quer contagem regressiva/escassez visual na página?">
              <SimNao valor={r.quer_contagem_regressiva} onChange={(v) => set('quer_contagem_regressiva', v)} />
            </Campo>
            <Campo label="Quer seção de perguntas frequentes (FAQ)?">
              <SimNao valor={r.quer_faq} onChange={(v) => set('quer_faq', v)} />
            </Campo>
          </Bloco>
        )}

        {step === 8 && (
          <Bloco titulo="Fechamento">
            <Campo label="Contratou algum order bump?">
              <div style={S.checkboxGroup}>
                {['Hospedagem mensal', 'Pixel+Cloudflare', 'Criativos'].map((op) => (
                  <label key={op} style={S.checkboxLabel}>
                    <input type="checkbox" checked={r.order_bumps.includes(op)}
                      onChange={() => toggleBump(op)} />
                    {op}
                  </label>
                ))}
              </div>
            </Campo>
            <Campo label="Alguma observação extra? (opcional)">
              <textarea style={S.textarea} value={r.observacao_extra}
                onChange={(e) => set('observacao_extra', e.target.value)} />
            </Campo>
            <Aviso>
              Suas respostas serão analisadas pela nossa equipe. Em caso de
              dúvidas, entraremos em contato. Prazo de confecção: 3 dias
              úteis. Se tiver depoimentos, fotos, logo ou outros materiais,
              envie pelo WhatsApp informando seu nome completo.
            </Aviso>
          </Bloco>
        )}

        {erro && <p style={S.erro}>{erro}</p>}

        <div style={S.nav}>
          {step > 0 && (
            <button style={S.btnSecundario} onClick={voltar} type="button">
              Voltar
            </button>
          )}
          {step < BLOCOS.length - 1 ? (
            <button style={S.btnPrimario} onClick={avancar} disabled={!podeAvancar()} type="button">
              Continuar
            </button>
          ) : (
            <button style={S.btnPrimario} onClick={enviar} disabled={enviando} type="button">
              {enviando ? 'Enviando...' : 'Enviar briefing'}
            </button>
          )}
        </div>
        </div>
      </div>
    </main>
  )
}

// ---------- Subcomponentes ----------

function Cabecalho() {
  return (
    <div style={S.cabecalho}>
      <img src="/logo.svg" alt="Élite Digital Pages" style={S.logo} />
    </div>
  )
}

function Progresso({ step }: { step: number }) {
  return (
    <div style={S.progresso}>
      <div style={S.progressoTexto}>
        Etapa {step + 1} de {BLOCOS.length} — {BLOCOS[step]}
      </div>
      <div style={S.progressoTrilha}>
        <div style={{ ...S.progressoBarra, width: `${((step + 1) / BLOCOS.length) * 100}%` }} />
      </div>
    </div>
  )
}

function Bloco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div style={S.bloco}>
      <h2 style={S.h2}>{titulo}</h2>
      {children}
    </div>
  )
}

function Campo({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label style={S.campo}>
      <span style={S.campoLabel}>{label}{required && ' *'}</span>
      {children}
    </label>
  )
}

function SimNao({ valor, onChange }: { valor: string; onChange: (v: string) => void }) {
  return <Radios nome="simnao" valor={valor} opcoes={['sim', 'não']} onChange={onChange} />
}

function Radios({ nome, valor, opcoes, onChange }: { nome: string; valor: string; opcoes: string[]; onChange: (v: string) => void }) {
  return (
    <div style={S.radioGroup}>
      {opcoes.map((op) => (
        <label key={op} style={S.radioLabel}>
          <input type="radio" name={nome} checked={valor === op} onChange={() => onChange(op)} />
          {op}
        </label>
      ))}
    </div>
  )
}

function Aviso({ children }: { children: React.ReactNode }) {
  return <p style={S.aviso}>{children}</p>
}

// ---------- Estilos ----------

// Marca: Élite Digital Pages
// Gradiente principal: violeta → rosa → âmbar (mesmo do logo)
const GRADIENTE = 'linear-gradient(135deg, #7C3AED 0%, #DB2777 55%, #F59E0B 100%)'

const S: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#F6F3FB',
    display: 'flex',
    justifyContent: 'center',
    padding: '32px 16px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    color: '#14101F',
  },
  wrapper: { width: '100%', maxWidth: '560px' },
  cabecalho: { display: 'flex', justifyContent: 'center', marginBottom: '20px' },
  logo: { height: '40px' },
  card: {
    width: '100%',
    background: '#fff',
    borderRadius: '14px',
    padding: '32px',
    boxShadow: '0 4px 24px rgba(124, 58, 237, 0.08)',
    border: '1px solid #EEE9F7',
  },
  progresso: { marginBottom: '24px' },
  progressoTexto: { fontSize: '13px', color: '#7A6C99', marginBottom: '8px', fontWeight: 500 },
  progressoTrilha: { height: '5px', background: '#EEE9F7', borderRadius: '3px', overflow: 'hidden' },
  progressoBarra: { height: '100%', background: GRADIENTE, transition: 'width 0.25s ease', borderRadius: '3px' },
  bloco: { display: 'flex', flexDirection: 'column', gap: '18px' },
  h1: {
    fontSize: '22px', fontWeight: 700, margin: '0 0 12px',
    fontFamily: "'Space Grotesk', sans-serif",
  },
  h2: {
    fontSize: '18px', fontWeight: 700, margin: '0 0 4px',
    fontFamily: "'Space Grotesk', sans-serif",
  },
  p: { fontSize: '14px', lineHeight: 1.6, color: '#4A4459', margin: 0 },
  campo: { display: 'flex', flexDirection: 'column', gap: '6px' },
  campoLabel: { fontSize: '14px', fontWeight: 600, color: '#2A2438' },
  input: {
    padding: '11px 13px', border: '1.5px solid #E4DEF0', borderRadius: '8px',
    fontSize: '14px', fontFamily: 'inherit', outlineColor: '#DB2777',
  },
  textarea: {
    padding: '11px 13px', border: '1.5px solid #E4DEF0', borderRadius: '8px',
    fontSize: '14px', minHeight: '90px', fontFamily: 'inherit', resize: 'vertical',
    outlineColor: '#DB2777',
  },
  radioGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  radioLabel: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', accentColor: '#DB2777' },
  checkboxGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  checkboxLabel: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', accentColor: '#DB2777' },
  aviso: {
    fontSize: '13px', lineHeight: 1.5, color: '#6B2D8C', background: '#F6EEFB',
    padding: '11px 13px', borderRadius: '8px', margin: 0, borderLeft: '3px solid #7C3AED',
  },
  erro: { color: '#C0243B', fontSize: '13px', marginTop: '16px' },
  nav: { display: 'flex', justifyContent: 'space-between', marginTop: '28px', gap: '12px' },
  btnPrimario: {
    marginLeft: 'auto', padding: '12px 24px', background: GRADIENTE, color: '#fff',
    border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(219, 39, 119, 0.3)',
  },
  btnSecundario: {
    padding: '12px 24px', background: 'transparent', color: '#4A4459',
    border: '1.5px solid #E4DEF0', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
  },
}
