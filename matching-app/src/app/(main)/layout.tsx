import BottomNav from '@/components/BottomNav'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-md mx-auto pb-20">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
