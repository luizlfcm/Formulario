import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { senha } = await req.json()

  if (!process.env.PAINEL_SENHA) {
    return NextResponse.json(
      { error: 'PAINEL_SENHA não configurada no servidor' },
      { status: 500 }
    )
  }

  if (senha !== process.env.PAINEL_SENHA) {
    return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 })
  }

  const res = NextResponse.json({ success: true })
  res.cookies.set('painel_auth', process.env.PAINEL_SENHA, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  })
  return res
}
