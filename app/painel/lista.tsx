'use client'

import { useMemo, useState } from 'react'
import {
  Users, Package, ShieldCheck, Tag, Server, Target, Pen, Palette,
  Flag, Search, Calendar, TrendingUp, Copy, Check, ChevronDown, Sparkles,
} from 'lucide-react'

type Briefing = Record<string, any>

export default function PainelLista({ briefings, erro }: { briefings: Briefing[]; erro?: string }) {
  const [busca, setBusca] = useState('')

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase()
    if (!q) return briefings
    return briefings.filter((b) =>
      [b.nome_cliente, b.nome_produto, b.email_cliente]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    )
  }, [busca, briefings])

  const stats = useMemo(() => {
    const agora = new Date()
    const inicioHoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate())
    const seteDiasAtras = new Date(inicioHoje.getTime() - 7 * 24 * 60 * 60 * 1000)
    let hoje = 0
    let semana = 0
    for (const b of briefings) {
      const d = new Date(b.created_at)
      if (d >= inicioHoje) hoje++
      if (d >= seteDiasAtras) semana++
    }
    return { total: briefings.length, hoje, semana }
  }, [briefings])

  if (erro) {
    return (
      <main style={S.page}>
        <p style={{ color: '#F87171' }}>Erro ao carregar os briefings: {erro}</p>
      </main>
    )
  }

  return (
    <main style={S.page}>
      <style>{ESTILO_GLOBAL}</style>
      <div style={S.wrapper}>
        <header style={S.header}>
          <div style={S.headerTopo}>
            <img src="/logo.svg" alt="Élite Digital Pages" style={{ height: '30px', filter: 'brightness(0) invert(1)' }} />
            <span style={S.badgeLive}>
              <Sparkles size={12} /> painel interno
            </span>
          </div>
          <h1 style={S.titulo}>Briefings recebidos</h1>
          <p style={S.subtitulo}>Acompanhamento em tempo real dos formulários preenchidos por clientes.</p>
        </header>

        <div style={S.statsRow}>
          <StatCard icone={<Package size={18} />} label="Total" valor={stats.total} />
          <StatCard icone={<Calendar size={18} />} label="Hoje" valor={stats.hoje} />
          <StatCard icone={<TrendingUp size={18} />} label="Últimos 7 dias" valor={stats.semana} />
        </div>

        <div style={S.buscaWrapper}>
          <Search size={16} color="#9C8FBE" />
          <input
            placeholder="Buscar por cliente, produto ou email..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={S.buscaInput}
          />
        </div>

        {filtrados.length === 0 && (
          <p style={{ color: '#6B6480', textAlign: 'center', padding: '32px 0' }}>
            {briefings.length === 0 ? 'Nenhum briefing recebido ainda.' : 'Nada encontrado para essa busca.'}
          </p>
        )}

        <div style={S.lista}>
          {filtrados.map((b) => (
            <CardBriefing key={b.id} b={b} />
          ))}
        </div>
      </div>
    </main>
  )
}

function StatCard({ icone, label, valor }: { icone: React.ReactNode; label: string; valor: number }) {
  return (
    <div style={S.statCard}>
      <div style={S.statIcone}>{icone}</div>
      <div>
        <div style={S.statValor}>{valor}</div>
        <div style={S.statLabel}>{label}</div>
      </div>
    </div>
  )
}

function CardBriefing({ b }: { b: Briefing }) {
  const [copiado, setCopiado] = useState(false)
  const iniciais = (b.nome_produto || b.nome_cliente || '?').slice(0, 2).toUpperCase()

  async function copiarResumo() {
    const texto = gerarResumoTexto(b)
    try {
      await navigator.clipboard.writeText(texto)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      // clipboard indisponível — ignora silenciosamente
    }
  }

  return (
    <details className="edp-card" style={S.card}>
      <summary className="edp-summary" style={S.summary}>
        <div style={S.avatar}>{iniciais}</div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={S.summaryTopo}>
            <span style={S.nomeProduto}>{b.nome_produto || '(sem nome de produto)'}</span>
            {b.preco && <span style={S.pillPreco}>{b.preco}</span>}
          </div>
          <div style={S.summarySub}>
            {b.nome_cliente}
            {b.tipo_produto && <span style={S.pontinho}> · {b.tipo_produto}</span>}
          </div>
          {(b.order_bumps || []).length > 0 && (
            <div style={S.pillsRow}>
              {b.order_bumps.map((bump: string) => (
                <span key={bump} style={S.pillBump}>{bump}</span>
              ))}
            </div>
          )}
        </div>

        <div style={S.summaryDireita}>
          <span style={S.data}>
            {new Date(b.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
          </span>
          <ChevronDown size={18} className="edp-chevron" color="#9C8FBE" />
        </div>
      </summary>

      <div style={S.corpo}>
        <button onClick={copiarResumo} style={S.btnCopiar} type="button">
          {copiado ? <Check size={14} /> : <Copy size={14} />}
          {copiado ? 'Copiado!' : 'Copiar resumo'}
        </button>

        <Secao icone={<Users size={14} />} titulo="Identificação">
          <Campo label="Nome do cliente" valor={b.nome_cliente} />
          <Campo label="Email" valor={b.email_cliente} />
          <Campo label="Telefone" valor={b.telefone} />
        </Secao>

        <Secao icone={<Package size={14} />} titulo="Produto">
          <Campo label="Nome/marca" valor={b.nome_produto} />
          <Campo label="WhatsApp" valor={b.whatsapp_contato} />
          <Campo label="Link checkout" valor={b.link_checkout} link />
          <Campo label="Tipo" valor={b.tipo_produto} />
          <Campo label="Promessa" valor={b.promessa} />
          <Campo label="Problema/dor" valor={b.problema_dor} longo />
          <Campo label="Público-alvo" valor={b.publico_alvo} longo />
          <Campo label="Preço" valor={b.preco} />
        </Secao>

        <Secao icone={<ShieldCheck size={14} />} titulo="Prova e credibilidade">
          <Campo label="Tem depoimentos?" valor={simNao(b.tem_depoimentos)} />
          <Campo label="Resultados/números" valor={b.resultados_numeros} />
          <Campo label="Credenciais" valor={b.credenciais} />
        </Secao>

        <Secao icone={<Tag size={14} />} titulo="Oferta">
          <Campo label="O que inclui" valor={b.oferta_inclusa} longo />
          <Campo label="Garantia" valor={b.garantia} />
          <Campo label="Escassez real?" valor={simNao(b.tem_escassez)} />
          <Campo label="Descrição da escassez" valor={b.escassez_desc} />
        </Secao>

        <Secao icone={<Server size={14} />} titulo="Hospedagem">
          <Campo label="Já tem hospedagem?" valor={simNao(b.tem_hospedagem)} />
          <Campo label="Login/senha enviados" valor={b.hospedagem_login_senha} longo sensivel />
          <Campo label="Quer contratar hospedagem mensal?" valor={simNao(b.quer_contratar_hospedagem)} />
        </Secao>

        <Secao icone={<Target size={14} />} titulo="Pixel">
          <Campo label="Já tem Pixel?" valor={simNao(b.tem_pixel)} />
          <Campo label="Pixels/IDs informados" valor={b.pixel_info} longo />
        </Secao>

        <Secao icone={<Pen size={14} />} titulo="Copy">
          <Campo label="Status da copy" valor={b.status_copy} />
          <Campo label="Texto colado" valor={b.copy_texto} longo />
        </Secao>

        <Secao icone={<Palette size={14} />} titulo="Visual">
          <Campo label="Link VSL" valor={b.link_vsl} link />
          <Campo label="Cores de preferência" valor={b.cores_preferencia} />
          <Campo label="Referência" valor={b.referencia_pagina} link />
          <Campo label="Estilo de layout" valor={b.estilo_layout} />
          <Campo label="Contagem regressiva?" valor={simNao(b.quer_contagem_regressiva)} />
          <Campo label="FAQ?" valor={simNao(b.quer_faq)} />
        </Secao>

        <Secao icone={<Flag size={14} />} titulo="Fechamento">
          <Campo label="Order bumps" valor={(b.order_bumps || []).join(', ')} />
          <Campo label="Observação extra" valor={b.observacao_extra} longo />
        </Secao>
      </div>
    </details>
  )
}

function gerarResumoTexto(b: Briefing): string {
  const linhas = [
    `BRIEFING — ${b.nome_produto || b.nome_cliente}`,
    `Recebido em ${new Date(b.created_at).toLocaleString('pt-BR')}`,
    '',
    '— IDENTIFICAÇÃO —',
    `Nome: ${b.nome_cliente || '-'}`,
    `Email: ${b.email_cliente || '-'}`,
    `Telefone: ${b.telefone || '-'}`,
    '',
    '— PRODUTO —',
    `Nome/marca: ${b.nome_produto || '-'}`,
    `WhatsApp: ${b.whatsapp_contato || '-'}`,
    `Checkout: ${b.link_checkout || '-'}`,
    `Tipo: ${b.tipo_produto || '-'}`,
    `Promessa: ${b.promessa || '-'}`,
    `Problema/dor: ${b.problema_dor || '-'}`,
    `Público-alvo: ${b.publico_alvo || '-'}`,
    `Preço: ${b.preco || '-'}`,
    '',
    '— PROVA —',
    `Depoimentos? ${simNao(b.tem_depoimentos) || '-'}`,
    `Resultados: ${b.resultados_numeros || '-'}`,
    `Credenciais: ${b.credenciais || '-'}`,
    '',
    '— OFERTA —',
    `Inclui: ${b.oferta_inclusa || '-'}`,
    `Garantia: ${b.garantia || '-'}`,
    `Escassez? ${simNao(b.tem_escassez) || '-'} ${b.escassez_desc || ''}`,
    '',
    '— HOSPEDAGEM —',
    `Já tem? ${simNao(b.tem_hospedagem) || '-'}`,
    `Quer contratar mensal? ${simNao(b.quer_contratar_hospedagem) || '-'}`,
    '',
    '— PIXEL —',
    `Já tem? ${simNao(b.tem_pixel) || '-'}`,
    `Info: ${b.pixel_info || '-'}`,
    '',
    '— COPY —',
    `Status: ${b.status_copy || '-'}`,
    '',
    '— VISUAL —',
    `VSL: ${b.link_vsl || '-'}`,
    `Cores: ${b.cores_preferencia || '-'}`,
    `Estilo: ${b.estilo_layout || '-'}`,
    `Contagem regressiva? ${simNao(b.quer_contagem_regressiva) || '-'}`,
    `FAQ? ${simNao(b.quer_faq) || '-'}`,
    '',
    '— FECHAMENTO —',
    `Order bumps: ${(b.order_bumps || []).join(', ') || 'nenhum'}`,
    `Observação: ${b.observacao_extra || '-'}`,
  ]
  return linhas.join('\n')
}

function simNao(v: boolean | null): string {
  if (v === true) return 'Sim'
  if (v === false) return 'Não'
  return ''
}

function Secao({ icone, titulo, children }: { icone: React.ReactNode; titulo: string; children: React.ReactNode }) {
  const filhos = Array.isArray(children) ? children : [children]
  const temAlgo = filhos.some((c: any) => c?.props?.valor)
  if (!temAlgo) return null

  return (
    <div style={S.secao}>
      <h3 style={S.secaoTitulo}>
        {icone} {titulo}
      </h3>
      <div style={S.secaoCorpo}>{children}</div>
    </div>
  )
}

function Campo({ label, valor, longo, link, sensivel }: {
  label: string; valor?: string; longo?: boolean; link?: boolean; sensivel?: boolean
}) {
  if (!valor) return null
  return (
    <div style={longo ? S.campoLongo : S.campo}>
      <span style={S.campoLabel}>{label}</span>
      {link ? (
        <a href={valor} target="_blank" rel="noreferrer" style={S.campoLink}>{valor}</a>
      ) : (
        <span style={sensivel ? S.campoSensivel : S.campoValor}>{valor}</span>
      )}
    </div>
  )
}

const ESTILO_GLOBAL = `
  .edp-summary::-webkit-details-marker { display: none; }
  .edp-summary { list-style: none; cursor: pointer; }
  .edp-summary:hover { background: rgba(124,58,237,0.06); }
  .edp-chevron { transition: transform 0.2s ease; }
  details[open] .edp-chevron { transform: rotate(180deg); }
  .edp-card { transition: border-color 0.2s ease; }
`

const S: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#120B1F',
    padding: '40px 16px 80px',
    fontFamily: "'Inter', -apple-system, sans-serif",
    color: '#F5F2FF',
  },
  wrapper: { maxWidth: '760px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' },
  header: { display: 'flex', flexDirection: 'column', gap: '6px' },
  headerTopo: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' },
  badgeLive: {
    display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 600,
    color: '#C4B5FD', background: 'rgba(139,92,246,0.15)', padding: '4px 10px', borderRadius: '999px',
  },
  titulo: { fontSize: '26px', fontWeight: 700, margin: 0, fontFamily: "'Space Grotesk', sans-serif" },
  subtitulo: { fontSize: '14px', color: '#9C8FBE', margin: 0 },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' },
  statCard: {
    display: 'flex', alignItems: 'center', gap: '12px', background: '#1B1330',
    border: '1px solid #2E2147', borderRadius: '12px', padding: '16px',
  },
  statIcone: {
    width: '36px', height: '36px', borderRadius: '10px',
    background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0,
  },
  statValor: { fontSize: '20px', fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1.1 },
  statLabel: { fontSize: '12px', color: '#9C8FBE' },
  buscaWrapper: {
    display: 'flex', alignItems: 'center', gap: '10px', background: '#1B1330',
    border: '1px solid #2E2147', borderRadius: '10px', padding: '10px 14px',
  },
  buscaInput: {
    flex: 1, background: 'transparent', border: 'none', outline: 'none',
    color: '#F5F2FF', fontSize: '14px', fontFamily: 'inherit',
  },
  lista: { display: 'flex', flexDirection: 'column', gap: '10px' },
  card: {
    background: '#1B1330', border: '1px solid #2E2147', borderRadius: '14px', overflow: 'hidden',
  },
  summary: { display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 18px' },
  avatar: {
    width: '42px', height: '42px', borderRadius: '10px', flexShrink: 0,
    background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 55%, #F59E0B 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '14px', fontWeight: 700, color: '#fff', fontFamily: "'Space Grotesk', sans-serif",
  },
  summaryTopo: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' as const },
  nomeProduto: { fontSize: '15px', fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" },
  pillPreco: {
    fontSize: '11px', fontWeight: 600, color: '#34D399', background: 'rgba(52,211,153,0.12)',
    padding: '2px 8px', borderRadius: '999px',
  },
  summarySub: { fontSize: '13px', color: '#9C8FBE', marginTop: '2px' },
  pontinho: { color: '#6B6480' },
  pillsRow: { display: 'flex', gap: '6px', flexWrap: 'wrap' as const, marginTop: '8px' },
  pillBump: {
    fontSize: '10.5px', fontWeight: 600, color: '#C4B5FD', background: 'rgba(139,92,246,0.14)',
    padding: '3px 8px', borderRadius: '999px',
  },
  summaryDireita: { display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 },
  data: { fontSize: '12px', color: '#6B6480' },
  corpo: {
    padding: '4px 18px 20px', display: 'flex', flexDirection: 'column', gap: '4px',
    borderTop: '1px solid #2E2147',
  },
  btnCopiar: {
    display: 'flex', alignItems: 'center', gap: '6px', alignSelf: 'flex-end', marginTop: '14px',
    fontSize: '12px', fontWeight: 600, color: '#C4B5FD', background: 'rgba(139,92,246,0.12)',
    border: '1px solid rgba(139,92,246,0.25)', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer',
  },
  secao: { borderTop: '1px solid #2A1F42', paddingTop: '14px', marginTop: '10px' },
  secaoTitulo: {
    display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#C4B5FD',
    margin: '0 0 10px', textTransform: 'uppercase' as const, letterSpacing: '0.05em',
  },
  secaoCorpo: { display: 'flex', flexDirection: 'column', gap: '8px' },
  campo: { display: 'flex', gap: '8px', flexWrap: 'wrap' as const, fontSize: '13px' },
  campoLongo: { display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '13px' },
  campoLabel: { color: '#6B6480', fontWeight: 500, minWidth: '150px' },
  campoValor: { color: '#E5DFFA' },
  campoLink: { color: '#C4B5FD', wordBreak: 'break-all' as const },
  campoSensivel: { color: '#FB7185', fontFamily: 'monospace', fontSize: '12px' },
}
