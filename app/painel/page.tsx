import { cookies } from 'next/headers'
import { getSupabase } from '@/lib/supabase'
import PainelLogin from './login-form'
import PainelLista from './lista'

export const dynamic = 'force-dynamic'

export default async function PainelPage() {
  const cookieStore = await cookies()
  const auth = cookieStore.get('painel_auth')?.value

  if (!process.env.PAINEL_SENHA || auth !== process.env.PAINEL_SENHA) {
    return <PainelLogin />
  }

  const { data, error } = await getSupabase()
    .from('briefings')
    .select('*')
    .order('created_at', { ascending: false })

  return <PainelLista briefings={data || []} erro={error?.message} />
}
