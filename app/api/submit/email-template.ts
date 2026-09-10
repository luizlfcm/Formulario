// Template em tabelas HTML (não CSS moderno) para compatibilidade com
// clientes de email como Outlook e Gmail, que ignoram flexbox/grid.

const URL_PAINEL = 'https://formulario.luverisgroup.com.br/painel'
const GRADIENTE = 'linear-gradient(135deg, #7C3AED 0%, #DB2777 55%, #F59E0B 100%)'

function linha(label: string, valor?: string) {
  if (!valor) return ''
  return `
    <tr>
      <td style="padding: 6px 0; font-size: 13px; color: #6B6480; width: 140px; vertical-align: top;">${label}</td>
      <td style="padding: 6px 0; font-size: 13px; color: #2A2438; vertical-align: top;">${valor}</td>
    </tr>
  `
}

export function gerarEmailHtml(body: any): string {
  const bumps = (body.order_bumps || []).join(', ') || 'Nenhum'

  return `
  <div style="background: #F6F3FB; padding: 24px 12px; font-family: -apple-system, Helvetica, Arial, sans-serif;">
    <table role="presentation" width="100%" style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid #EEE9F7;">

      <tr>
        <td style="background: #7C3AED; background-image: ${GRADIENTE}; padding: 24px 28px;">
          <p style="margin: 0; font-size: 12px; letter-spacing: 0.05em; text-transform: uppercase; color: rgba(255,255,255,0.85); font-weight: 600;">
            Élite Digital Pages
          </p>
          <p style="margin: 6px 0 0; font-size: 18px; font-weight: 700; color: #ffffff;">
            Novo briefing recebido
          </p>
        </td>
      </tr>

      <tr>
        <td style="padding: 24px 28px 8px;">
          <p style="margin: 0 0 4px; font-size: 16px; font-weight: 700; color: #14101F;">
            ${body.nome_produto || body.nome_cliente || 'Sem nome de produto'}
          </p>
          <p style="margin: 0; font-size: 13px; color: #9A93AD;">
            ${body.nome_cliente || ''}${body.tipo_produto ? ` · ${body.tipo_produto}` : ''}
          </p>
        </td>
      </tr>

      <tr>
        <td style="padding: 12px 28px 4px;">
          <table role="presentation" width="100%" style="border-top: 1px solid #F0EDF7; padding-top: 8px;">
            ${linha('Email', body.email_cliente)}
            ${linha('WhatsApp', body.whatsapp_contato)}
            ${linha('Preço', body.preco)}
            ${linha('Order bumps', bumps)}
          </table>
        </td>
      </tr>

      <tr>
        <td style="padding: 20px 28px 28px;">
          <a href="${URL_PAINEL}"
             style="display: inline-block; width: 100%; box-sizing: border-box; text-align: center;
                    background: #7C3AED; background-image: ${GRADIENTE}; color: #ffffff;
                    text-decoration: none; font-size: 14px; font-weight: 700;
                    padding: 13px 20px; border-radius: 8px;">
            Ver briefing completo no painel
          </a>
        </td>
      </tr>

      <tr>
        <td style="padding: 0 28px 24px;">
          <p style="margin: 0; font-size: 11px; color: #B5ACCB; text-align: center;">
            Notificação automática — Élite Digital Pages
          </p>
        </td>
      </tr>

    </table>
  </div>
  `
}
