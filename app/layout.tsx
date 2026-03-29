import type { Metadata } from 'next'
import './globals.css'
import ThemeProvider from '@/components/ThemeProvider'
import LangProvider from '@/components/LangProvider'

export const metadata: Metadata = {
  title: 'Tokenlab',
  description: 'Structure your tokenomics — post-workshop tool for Web3 founders',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <LangProvider>
            {children}
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
