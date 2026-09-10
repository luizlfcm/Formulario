import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { Resend } from 'resend'
import { gerarEmailHtml } from './email-template'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (!body.nome_cliente || !body.email_cliente) {
      return NextResponse.json(
        { error: 'Nome e email são obrigatórios' },
        { status: 400 }
      )
    }

    // Converte os "sim"/"não" em boolean antes de salvar
    const paraBool = (v: string) => (v === 'sim' ? true : v === 'não' ? false : null)

    const registro = {
      nome_cliente: body.nome_cliente,
      email_cliente: body.email_cliente,
      telefone: body.telefone || null,
      nome_produto: body.nome_produto || null,
      whatsapp_contato: body.whatsapp_contato || null,
      link_checkout: body.link_checkout || null,
      tipo_produto: body.tipo_produto || null,
      promessa: body.promessa || null,
      problema_dor: body.problema_dor || null,
      publico_alvo: body.publico_alvo || null,
      preco: body.preco || null,
      tem_depoimentos: paraBool(body.tem_depoimentos),
      resultados_numeros: body.resultados_numeros || null,
      credenciais: body.credenciais || null,
      oferta_inclusa: body.oferta_inclusa || null,
      garantia: body.garantia || null,
      tem_escassez: paraBool(body.tem_escassez),
      escassez_desc: body.escassez_desc || null,
      tem_hospedagem: paraBool(body.tem_hospedagem),
      hospedagem_login_senha: body.hospedagem_login_senha || null,
      quer_contratar_hospedagem: paraBool(body.quer_contratar_hospedagem),
      tem_pixel: paraBool(body.tem_pixel),
      pixel_info: body.pixel_info || null,
      status_copy: body.status_copy || null,
      copy_texto: body.copy_texto || null,
      link_vsl: body.link_vsl || null,
      cores_preferencia: body.cores_preferencia || null,
      referencia_pagina: body.referencia_pagina || null,
      estilo_layout: body.estilo_layout || null,
      quer_contagem_regressiva: paraBool(body.quer_contagem_regressiva),
      quer_faq: paraBool(body.quer_faq),
      order_bumps: body.order_bumps || [],
      observacao_extra: body.observacao_extra || null,
    }

    const { error: dbError } = await getSupabase().from('briefings').insert([registro])

    if (dbError) {
      console.error('Erro ao salvar no Supabase:', dbError)
      return NextResponse.json({ error: 'Erro ao salvar os dados' }, { status: 500 })
    }

    // Notificação por email com resumo do briefing (não bloqueia a resposta se falhar)
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: 'noreply@mail.luverisgroup.com.br',
        to: 'luiz.lfcm@gmail.com',
        subject: `Novo briefing: ${body.nome_produto || body.nome_cliente}`,
        html: gerarEmailHtml(body),
      })
    } catch (emailError) {
      console.error('Erro ao enviar notificação:', emailError)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Erro inesperado:', err)
    return NextResponse.json({ error: 'Erro inesperado' }, { status: 500 })
  }
}
