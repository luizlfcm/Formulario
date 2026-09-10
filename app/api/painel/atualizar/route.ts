import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const auth = req.cookies.get('painel_auth')?.value
  if (!process.env.PAINEL_SENHA || auth !== process.env.PAINEL_SENHA) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { id, status, observacao_interna, site_publicado } = await req.json()

  if (!id) {
    return NextResponse.json({ error: 'id é obrigatório' }, { status: 400 })
  }

  const { error } = await getSupabase()
    .from('briefings')
    .update({ status, observacao_interna, site_publicado })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
