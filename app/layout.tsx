import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Élite Digital Pages — Briefing',
  description: 'Formulário de briefing para criação de páginas de vendas',
  icons: { icon: '/logo.svg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  )
}
