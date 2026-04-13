'use client'

import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { DEMO_MATCHES, MATCHED_PROFILES, DEMO_MESSAGES, DEMO_USER_ID } from '@/lib/demo-data'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'

export default function DemoChatListPage() {
  const profileMap = new Map(MATCHED_PROFILES.map((p) => [p.user_id, p]))

  return (
    <div className="min-h-screen">
      <div className="bg-white px-4 pt-10 pb-4 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">メッセージ</h1>
      </div>

      <div className="bg-white divide-y divide-gray-50">
        {DEMO_MATCHES.map((match) => {
          const partnerId = match.user1_id === DEMO_USER_ID ? match.user2_id : match.user1_id
          const partner = profileMap.get(partnerId)
          if (!partner) return null

          const messages = DEMO_MESSAGES[match.id] ?? []
          const lastMsg = messages[messages.length - 1]
          const unread = messages.filter((m) => !m.is_read && m.sender_id !== DEMO_USER_ID).length

          return (
            <Link
              key={match.id}
              href={`/demo/chat/${match.id}`}
              className="flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition"
            >
              <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${partner.color} flex items-center justify-center flex-shrink-0 text-2xl`}>
                {partner.emoji}
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
                      ? `${lastMsg.sender_id === DEMO_USER_ID ? 'あなた: ' : ''}${lastMsg.content}`
                      : 'マッチしました！'}
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
        })}
      </div>
    </div>
  )
}
