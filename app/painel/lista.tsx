type Briefing = Record<string, any>

export default function PainelLista({ briefings, erro }: { briefings: Briefing[]; erro?: string }) {
  if (erro) {
    return (
      <main style={S.page}>
        <p style={{ color: '#C0243B' }}>Erro ao carregar os briefings: {erro}</p>
      </main>
    )
  }

  return (
    <main style={S.page}>
      <div style={S.wrapper}>
        <div style={S.cabecalho}>
          <img src="/logo.svg" alt="Élite Digital Pages" style={{ height: '36px' }} />
          <span style={S.contador}>{briefings.length} briefing(s) recebido(s)</span>
        </div>

        {briefings.length === 0 && (
          <p style={{ color: '#6B6480' }}>Nenhum briefing recebido ainda.</p>
        )}

        {briefings.map((b) => (
          <div key={b.id} style={S.card}>
            <div style={S.cardTopo}>
              <h2 style={S.nomeProduto}>{b.nome_produto || '(sem nome de produto)'}</h2>
              <span style={S.data}>
                {new Date(b.created_at).toLocaleString('pt-BR', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                })}
              </span>
            </div>

            <Secao titulo="Identificação">
              <Campo label="Nome do cliente" valor={b.nome_cliente} />
              <Campo label="Email" valor={b.email_cliente} />
              <Campo label="Telefone" valor={b.telefone} />
            </Secao>

            <Secao titulo="Produto">
              <Campo label="Nome/marca" valor={b.nome_produto} />
              <Campo label="WhatsApp" valor={b.whatsapp_contato} />
              <Campo label="Link checkout" valor={b.link_checkout} link />
              <Campo label="Tipo" valor={b.tipo_produto} />
              <Campo label="Promessa" valor={b.promessa} />
              <Campo label="Problema/dor" valor={b.problema_dor} longo />
              <Campo label="Público-alvo" valor={b.publico_alvo} longo />
              <Campo label="Preço" valor={b.preco} />
            </Secao>

            <Secao titulo="Prova e credibilidade">
              <Campo label="Tem depoimentos?" valor={simNao(b.tem_depoimentos)} />
              <Campo label="Resultados/números" valor={b.resultados_numeros} />
              <Campo label="Credenciais" valor={b.credenciais} />
            </Secao>

            <Secao titulo="Oferta">
              <Campo label="O que inclui" valor={b.oferta_inclusa} longo />
              <Campo label="Garantia" valor={b.garantia} />
              <Campo label="Escassez real?" valor={simNao(b.tem_escassez)} />
              <Campo label="Descrição da escassez" valor={b.escassez_desc} />
            </Secao>

            <Secao titulo="Hospedagem">
              <Campo label="Já tem hospedagem?" valor={simNao(b.tem_hospedagem)} />
              <Campo label="Login/senha enviados" valor={b.hospedagem_login_senha} longo sensivel />
              <Campo label="Quer contratar hospedagem mensal?" valor={simNao(b.quer_contratar_hospedagem)} />
            </Secao>

            <Secao titulo="Pixel">
              <Campo label="Já tem Pixel?" valor={simNao(b.tem_pixel)} />
              <Campo label="Pixels/IDs informados" valor={b.pixel_info} longo />
            </Secao>

            <Secao titulo="Copy">
              <Campo label="Status da copy" valor={b.status_copy} />
              <Campo label="Texto colado" valor={b.copy_texto} longo />
            </Secao>

            <Secao titulo="Visual">
              <Campo label="Link VSL" valor={b.link_vsl} link />
              <Campo label="Cores de preferência" valor={b.cores_preferencia} />
              <Campo label="Referência" valor={b.referencia_pagina} link />
              <Campo label="Estilo de layout" valor={b.estilo_layout} />
              <Campo label="Contagem regressiva?" valor={simNao(b.quer_contagem_regressiva)} />
              <Campo label="FAQ?" valor={simNao(b.quer_faq)} />
            </Secao>

            <Secao titulo="Fechamento">
              <Campo label="Order bumps" valor={(b.order_bumps || []).join(', ')} />
              <Campo label="Observação extra" valor={b.observacao_extra} longo />
            </Secao>
          </div>
        ))}
      </div>
    </main>
  )
}

function simNao(v: boolean | null): string {
  if (v === true) return 'Sim'
  if (v === false) return 'Não'
  return ''
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  // Esconde a seção inteira se nenhum campo filho tiver valor
  const filhos = Array.isArray(children) ? children : [children]
  const temAlgo = filhos.some((c: any) => c?.props?.valor)
  if (!temAlgo) return null

  return (
    <div style={S.secao}>
      <h3 style={S.secaoTitulo}>{titulo}</h3>
      <div style={S.secaoCorpo}>{children}</div>
    </div>
  )
}

function Campo({
  label,
  valor,
  longo,
  link,
  sensivel,
}: {
  label: string
  valor?: string
  longo?: boolean
  link?: boolean
  sensivel?: boolean
}) {
  if (!valor) return null

  return (
    <div style={longo ? S.campoLongo : S.campo}>
      <span style={S.campoLabel}>{label}</span>
      {link ? (
        <a href={valor} target="_blank" rel="noreferrer" style={S.campoLink}>
          {valor}
        </a>
      ) : (
        <span style={sensivel ? S.campoSensivel : S.campoValor}>{valor}</span>
      )}
    </div>
  )
}

const S: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#F6F3FB',
    padding: '32px 16px',
    fontFamily: "'Inter', -apple-system, sans-serif",
    color: '#14101F',
  },
  wrapper: { maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' },
  cabecalho: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' },
  contador: { fontSize: '13px', color: '#6B6480', fontWeight: 500 },
  card: {
    background: '#fff',
    borderRadius: '14px',
    padding: '24px',
    boxShadow: '0 4px 24px rgba(124, 58, 237, 0.06)',
    border: '1px solid #EEE9F7',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  cardTopo: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' },
  nomeProduto: { fontSize: '18px', fontWeight: 700, margin: 0, fontFamily: "'Space Grotesk', sans-serif" },
  data: { fontSize: '12px', color: '#9A93AD' },
  secao: { borderTop: '1px solid #F0EDF7', paddingTop: '12px', marginTop: '8px' },
  secaoTitulo: {
    fontSize: '11px', fontWeight: 700, color: '#7C3AED', margin: '0 0 8px',
    textTransform: 'uppercase' as const, letterSpacing: '0.04em',
  },
  secaoCorpo: { display: 'flex', flexDirection: 'column', gap: '8px' },
  campo: { display: 'flex', gap: '8px', flexWrap: 'wrap' as const, fontSize: '13px' },
  campoLongo: { display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '13px' },
  campoLabel: { color: '#9A93AD', fontWeight: 500, minWidth: '150px' },
  campoValor: { color: '#2A2438' },
  campoLink: { color: '#7C3AED', wordBreak: 'break-all' as const },
  campoSensivel: { color: '#C0243B', fontFamily: 'monospace', fontSize: '12px' },
}
