import type { Metadata } from 'next'
import './globals.css'
import ThemeProvider from '@/components/ThemeProvider'
import LangProvider from '@/components/LangProvider'

export const metadata: Metadata = {
  title: 'Tokenlab — Structure your tokenomics',
  description: 'Post-workshop tool for Web3 founders. 9 modules, AI Coach, PDF export. Structure your tokenomics from token decision to TGE strategy.',
  metadataBase: new URL('https://tokenlabapp.vercel.app'),
  openGraph: {
    title: 'Tokenlab — Structure your tokenomics',
    description: 'Post-workshop tool for Web3 founders. 9 modules, AI Coach, PDF export.',
    url: 'https://tokenlabapp.vercel.app',
    siteName: 'Tokenlab',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tokenlab — Structure your tokenomics',
    description: 'Post-workshop tool for Web3 founders. 9 modules, AI Coach, PDF export.',
  },
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
