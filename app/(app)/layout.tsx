import Sidebar from '@/components/Sidebar'
import { AuthSync } from '@/components/AuthSync'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthSync />
      <Sidebar />
      <main className="ml-[240px] min-h-screen">
        {children}
      </main>
    </>
  )
}
