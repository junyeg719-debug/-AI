import FemaleBottomNav from '@/components/FemaleBottomNav'
import { LikesProvider } from '@/lib/likes-context'

export default function FemaleLayout({ children }: { children: React.ReactNode }) {
  return (
    <LikesProvider>
      <div className="min-h-screen" style={{ background: '#F8F5F6' }}>
        <main className="max-w-md mx-auto pb-20">
          {children}
        </main>
        <FemaleBottomNav />
      </div>
    </LikesProvider>
  )
}
