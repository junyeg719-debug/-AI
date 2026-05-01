export default function FemaleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: '#F8F5F6' }}>
      <main className="max-w-md mx-auto">
        {children}
      </main>
    </div>
  )
}
