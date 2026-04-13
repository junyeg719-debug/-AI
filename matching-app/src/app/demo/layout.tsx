import DemoBottomNav from '@/components/DemoBottomNav'

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-amber-400 text-amber-900 text-center text-xs font-medium py-1 px-4">
        🎮 デモモード — データはブラウザ内のみで動作します
      </div>
      <main className="max-w-md mx-auto pb-20 pt-6">
        {children}
      </main>
      <DemoBottomNav />
    </div>
  )
}
