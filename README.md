# Formulário de Briefing — Élite Digital Pages

## Identidade visual

- **Logo:** `public/logo.svg` — ícone de gema facetada + wordmark, em
  degradê violeta → rosa → âmbar. Reaproveite esse arquivo em emails,
  redes sociais ou na própria página de vendas para manter consistência.
- **Cores:** violeta `#7C3AED`, rosa `#DB2777`, âmbar `#F59E0B` (degradê
  usado em botões e barra de progresso); fundo lilás claro `#F6F3FB`;
  texto principal `#14101F`.
- **Tipografia:** Space Grotesk (títulos/logo) + Inter (corpo de texto),
  carregadas via Google Fonts no `app/layout.tsx`.
- Os campos do formulário permanecem neutros (fundo branco, bordas
  discretas) para manter a legibilidade — a identidade da marca fica
  concentrada no cabeçalho, botões e barra de progresso.

Formulário multi-etapas (1 bloco por tela) para captar as informações
necessárias antes de montar a página de vendas de um cliente.

## 1. Instalar dependências

No seu projeto Next.js (App Router):

```bash
npm install @supabase/supabase-js resend
```

Copie para o seu projeto:
- `app/page.tsx` — o formulário
- `app/api/submit/route.ts` — recebe e salva os dados
- `lib/supabase.ts` — cliente do Supabase

## 2. Criar a tabela no Supabase

1. Crie um projeto grátis em https://supabase.com
2. Vá em **SQL Editor** e rode o conteúdo de `supabase-schema.sql`
3. Em **Project Settings > API**, copie:
   - `Project URL` → `SUPABASE_URL`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

## 3. Configurar o Resend (notificação por email)

1. Conta grátis em https://resend.com
2. Verifique um domínio
3. Gere uma API Key → `RESEND_API_KEY`
4. Em `app/api/submit/route.ts`, ajuste `from` (domínio verificado) e `to`
   (seu email)

## 4. Variáveis de ambiente

Copie `.env.local.example` para `.env.local` e preencha. No Vercel, adicione
as mesmas em **Project Settings > Environment Variables**.

## 5. Deploy via GitHub

1. Crie um repositório no GitHub e suba o projeto:
   ```bash
   git init
   git add .
   git commit -m "Formulário de briefing Élite Digital Pages"
   git branch -M main
   git remote add origin https://github.com/seu-usuario/seu-repo.git
   git push -u origin main
   ```
2. No painel da Vercel, clique em **Add New > Project** e importe esse
   repositório do GitHub
3. Adicione as variáveis de ambiente (`SUPABASE_URL`,
   `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`) em **Environment Variables**
4. Deploy automático a cada `git push` na branch `main`

O `.gitignore` já está configurado para não subir `node_modules`,
`.env.local` e arquivos de build.

## 6. Como ver os briefings preenchidos

- **Supabase > Table Editor > briefings** — lista completa, com filtro e
  exportação em CSV
- **Email** — cada preenchimento manda um resumo pro seu email na hora

## Sobre os uploads (depoimentos, logo, foto, arquivos de copy)

O formulário **não** tem campos de upload — em vez disso, ele instrui o
cliente a enviar esses materiais pelo WhatsApp, informando o nome completo.
Isso evita ter que configurar Supabase Storage e mantém o formulário rápido
de preencher. Se no futuro quiser trazer os uploads para dentro do
formulário, dá pra adicionar usando Supabase Storage — é só avisar.

## Dado sensível: login/senha de hospedagem

O campo do Bloco 5 grava a senha de hospedagem do cliente em texto puro na
coluna `hospedagem_login_senha`. Vale considerar:
- Restringir o acesso a essa tabela no Supabase (RLS) só para você
- Apagar o valor do campo depois que a página for publicada e a senha for
  trocada pelo cliente
