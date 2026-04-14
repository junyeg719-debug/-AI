import DemoBottomNav from '@/components/DemoBottomNav'

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: '#F8F5F6' }}>
      <main className="max-w-md mx-auto pb-20">
        {children}
      </main>
      <DemoBottomNav />
    </div>
  )
}
