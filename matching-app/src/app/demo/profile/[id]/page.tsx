import { ALL_PROFILES } from '@/lib/demo-data'
import ProfileDetailClient from './ProfileDetailClient'

export function generateStaticParams() {
  return ALL_PROFILES.map(p => ({ id: p.id }))
}

export default async function ProfileDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const profile = ALL_PROFILES.find(p => p.id === id)
  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">プロフィールが見つかりません</p>
      </div>
    )
  }
  return <ProfileDetailClient profile={profile} />
}
