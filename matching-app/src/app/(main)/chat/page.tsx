import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'
import { MessageCircle } from 'lucide-react'

export default async function ChatListPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: matches } = await supabase
    .from('matches')
    .select('*')
    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
    .order('last_message_at', { ascending: false, nullsFirst: false })

  const partnerIds = (matches ?? []).map((m) =>
    m.user1_id === user.id ? m.user2_id : m.user1_id
  )

  const { data: partners } = partnerIds.length > 0
    ? await supabase.from('profiles').select('*').in('user_id', partnerIds)
    : { data: [] }

  const profileMap = new Map((partners ?? []).map((p) => [p.user_id, p]))

  // 各マッチの最新メッセージを取得
  const matchIds = (matches ?? []).map((m) => m.id)
  const lastMessages: Record<string, { content: string; sender_id: string; created_at: string }> = {}

  if (matchIds.length > 0) {
    for (const matchId of matchIds) {
      const { data: msgs } = await supabase
        .from('messages')
        .select('content, sender_id, created_at')
        .eq('match_id', matchId)
        .order('created_at', { ascending: false })
        .limit(1)
      if (msgs && msgs.length > 0) {
        lastMessages[matchId] = msgs[0]
      }
    }
  }

  // 未読数
  const { data: unreadData } = await supabase
    .from('messages')
    .select('match_id')
    .eq('is_read', false)
    .neq('sender_id', user.id)

  const unreadCounts: Record<string, number> = {}
  for (const row of unreadData ?? []) {
    unreadCounts[row.match_id] = (unreadCounts[row.match_id] ?? 0) + 1
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-4 pt-12 pb-4 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">メッセージ</h1>
      </div>

      <div className="divide-y divide-gray-100">
        {(!matches || matches.length === 0) ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-10 h-10 text-rose-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">まだメッセージがありません</h3>
            <p className="text-gray-400 text-sm">マッチした相手にメッセージを送ってみよう！</p>
          </div>
        ) : (
          (matches ?? []).map((match) => {
            const partnerId = match.user1_id === user.id ? match.user2_id : match.user1_id
            const partner = profileMap.get(partnerId)
            if (!partner) return null

            const lastMsg = lastMessages[match.id]
            const unread = unreadCounts[match.id] ?? 0
            const gradient = getGradient(partner.id)

            return (
              <Link
                key={match.id}
                href={`/chat/${match.id}`}
                className="flex items-center gap-3 px-4 py-4 bg-white hover:bg-gray-50 transition"
              >
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                  {partner.avatar_url ? (
                    <img src={partner.avatar_url} alt={partner.name} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <span className="text-white text-xl font-bold">{partner.name.charAt(0)}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="font-semibold text-gray-900">{partner.name}</p>
                    {lastMsg && (
                      <p className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(lastMsg.created_at), { addSuffix: true, locale: ja })}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 truncate">
                      {lastMsg
                        ? `${lastMsg.sender_id === user.id ? 'あなた: ' : ''}${lastMsg.content}`
                        : 'マッチしました！メッセージを送ってみよう'}
                    </p>
                    {unread > 0 && (
                      <span className="ml-2 min-w-5 h-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center px-1 flex-shrink-0">
                        {unread}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            )
          })
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
  ]
  return gradients[id.charCodeAt(0) % gradients.length]
}
