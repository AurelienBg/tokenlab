import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import ThemeProvider from '@/components/ThemeProvider'
import LangProvider from '@/components/LangProvider'

export const metadata: Metadata = {
  title: 'Tokenlab',
  description: 'Structurez votre tokenomics post-workshop',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        {/* Anti-flash: apply saved theme before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('tokenlab_theme');document.documentElement.setAttribute('data-theme',t||'dark')})()`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <LangProvider>
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
