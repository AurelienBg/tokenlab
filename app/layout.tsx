import type { Metadata } from 'next'
import './globals.css'
import Sidebar from '@/components/Sidebar'

export const metadata: Metadata = {
  title: 'Tokenlab',
  description: 'Structurez votre tokenomics post-workshop',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Sidebar />
        <main className="ml-[240px] min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}
