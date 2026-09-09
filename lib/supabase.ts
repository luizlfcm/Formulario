import { createClient } from '@supabase/supabase-js'

// Essas variáveis vêm do painel do Supabase (Project Settings > API)
// e devem ser configuradas no Vercel como Environment Variables.
//
// O cliente só é criado dentro de getSupabase(), na hora da requisição —
// não no carregamento do módulo. Isso evita que o build inteiro quebre
// caso as variáveis ainda não tenham sido configuradas no Vercel.
export function getSupabase() {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      'SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não configuradas. ' +
      'Adicione essas variáveis em Vercel > Project Settings > Environment Variables.'
    )
  }

  return createClient(supabaseUrl, supabaseKey)
}
