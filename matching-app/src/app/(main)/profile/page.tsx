import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Settings, MapPin, Briefcase, Edit2, LogOut } from 'lucide-react'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!profile) redirect('/signup')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">マイプロフィール</h1>
          <Link
            href="/profile/edit"
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </Link>
        </div>

        {/* Avatar & Name */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                profile.name.charAt(0)
              )}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
            <p className="text-gray-500 text-sm">{profile.age}歳</p>
            <div className="flex items-center gap-3 mt-1">
              {profile.location && (
                <span className="flex items-center gap-1 text-gray-500 text-xs">
                  <MapPin className="w-3 h-3" />
                  {profile.location}
                </span>
              )}
              {profile.occupation && (
                <span className="flex items-center gap-1 text-gray-500 text-xs">
                  <Briefcase className="w-3 h-3" />
                  {profile.occupation}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Bio */}
        {profile.bio && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">自己紹介</h3>
            <p className="text-gray-800 text-sm leading-relaxed">{profile.bio}</p>
          </div>
        )}

        {/* Interests */}
        {profile.interests.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">趣味・興味</h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-full text-sm font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Details */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 mb-3">基本情報</h3>
          <div className="space-y-2">
            <InfoRow label="性別" value={profile.gender === 'male' ? '男性' : profile.gender === 'female' ? '女性' : 'その他'} />
            <InfoRow label="探している相手" value={profile.looking_for === 'male' ? '男性' : profile.looking_for === 'female' ? '女性' : '両方'} />
            {profile.height && <InfoRow label="身長" value={`${profile.height}cm`} />}
          </div>
        </div>

        {/* Edit Button */}
        <Link
          href="/profile/edit"
          className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-rose-400 to-pink-500 text-white font-semibold rounded-2xl hover:opacity-90 transition shadow-lg shadow-rose-200"
        >
          <Edit2 className="w-4 h-4" />
          プロフィールを編集
        </Link>

        {/* Logout */}
        <form action="/auth/signout" method="post">
          <button
            formAction="/auth/signout"
            className="flex items-center justify-center gap-2 w-full py-3 border border-gray-200 text-gray-500 font-medium rounded-2xl hover:bg-gray-50 transition"
          >
            <LogOut className="w-4 h-4" />
            ログアウト
          </button>
        </form>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-gray-500 text-sm">{label}</span>
      <span className="text-gray-800 text-sm font-medium">{value}</span>
    </div>
  )
}
