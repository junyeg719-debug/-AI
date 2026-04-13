import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Heart, MessageCircle } from 'lucide-react'

export default async function MatchesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: matches } = await supabase
    .from('matches')
    .select('*')
    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
    .order('created_at', { ascending: false })

  // マッチした相手のプロフィールを取得
  const matchedUserIds = (matches ?? []).map((m) =>
    m.user1_id === user.id ? m.user2_id : m.user1_id
  )

  const { data: matchedProfiles } = matchedUserIds.length > 0
    ? await supabase
        .from('profiles')
        .select('*')
        .in('user_id', matchedUserIds)
    : { data: [] }

  const profileMap = new Map(
    (matchedProfiles ?? []).map((p) => [p.user_id, p])
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">マッチ一覧</h1>
        <p className="text-gray-500 text-sm mt-0.5">{(matches ?? []).length}人とマッチ中</p>
      </div>

      <div className="px-4 py-4">
        {(!matches || matches.length === 0) ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-rose-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">まだマッチがありません</h3>
            <p className="text-gray-400 text-sm">「探す」でいろんな人にいいねしてみよう！</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {(matches ?? []).map((match) => {
              const partnerId = match.user1_id === user.id ? match.user2_id : match.user1_id
              const partner = profileMap.get(partnerId)
              if (!partner) return null

              const initial = partner.name.charAt(0)
              const gradient = getGradient(partner.id)

              return (
                <Link
                  key={match.id}
                  href={`/chat/${match.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group"
                >
                  <div className={`h-36 bg-gradient-to-br ${gradient} relative flex items-center justify-center`}>
                    {partner.avatar_url ? (
                      <img
                        src={partner.avatar_url}
                        alt={partner.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-4xl font-bold opacity-80">{initial}</span>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{partner.name}</p>
                        <p className="text-gray-400 text-xs">{partner.age}歳 {partner.location && `・${partner.location}`}</p>
                      </div>
                      <MessageCircle className="w-4 h-4 text-rose-400" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function getGradient(id: string) {
  const gradients = [
    'from-rose-400 to-pink-500',
    'from-violet-400 to-purple-500',
    'from-sky-400 to-blue-500',
    'from-emerald-400 to-teal-500',
    'from-amber-400 to-orange-500',
    'from-fuchsia-400 to-pink-500',
  ]
  return gradients[id.charCodeAt(0) % gradients.length]
}
