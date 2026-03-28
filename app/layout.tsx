import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import ThemeProvider from '@/components/ThemeProvider'
import LangProvider from '@/components/LangProvider'
import { AuthSync } from '@/components/AuthSync'

export const metadata: Metadata = {
  title: 'Tokenlab',
  description: 'Structurez votre tokenomics post-workshop',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <LangProvider>
            <AuthSync />
            <Sidebar />
            <main className="ml-[240px] min-h-screen">
              {children}
            </main>
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
