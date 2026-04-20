'use client'

import Link from 'next/link'
import { SlidersHorizontal, User } from 'lucide-react'
import { DEMO_MATCHES, MATCHED_PROFILES, DEMO_MESSAGES, DEMO_USER_ID } from '@/lib/demo-data'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'

export default function DemoChatListPage() {
  const profileMap = new Map(MATCHED_PROFILES.map((p) => [p.user_id, p]))

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white px-4 pt-10 pb-4 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">メッセージ</h1>
          <button className="p-2 rounded-full hover:bg-gray-50 transition">
            <SlidersHorizontal className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Match list */}
      <div className="bg-white divide-y divide-gray-50 mt-0">
        {DEMO_MATCHES.map((match) => {
          const partnerId =
            match.user1_id === DEMO_USER_ID ? match.user2_id : match.user1_id
          const partner = profileMap.get(partnerId)
          if (!partner) return null

          const messages = DEMO_MESSAGES[match.id] ?? []
          const lastMsg = messages[messages.length - 1]
          const unread = messages.filter(
            (m) => !m.is_read && m.sender_id !== DEMO_USER_ID,
          ).length
          const noMessages = messages.length === 0

          return (
            <Link
              key={match.id}
              href={`/demo/chat/${match.id}`}
              className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition active:bg-gray-100"
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {partner.avatar_url
                    ? <img src={partner.avatar_url} className="w-full h-full object-cover" alt={partner.name} />
                    : <User className="w-8 h-8 text-gray-400" />
                  }
                </div>
                {partner.isOnline && (
                  <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between mb-0.5">
                  <p className="font-semibold text-gray-900 text-sm">
                    {partner.name}{'　'}
                    <span className="font-normal text-xs text-gray-400">
                      {partner.age}歳 {partner.location.replace('府', '').replace('県', '').replace('都', '')}
                    </span>
                  </p>
                  {lastMsg && (
                    <p className="text-[11px] text-gray-400 flex-shrink-0 ml-1">
                      {formatDistanceToNow(new Date(lastMsg.created_at), {
                        addSuffix: false,
                        locale: ja,
                      })}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-gray-500 truncate">
                    {noMessages
                      ? 'メッセージ交換をしていません'
                      : lastMsg
                        ? lastMsg.sender_id === DEMO_USER_ID
                          ? lastMsg.content
                          : lastMsg.content
                        : 'メッセージ交換をしていません'}
                  </p>
                  {unread > 0 && (
                    <span
                      className="ml-1 min-w-5 h-5 text-white text-xs rounded-full flex items-center justify-center px-1.5 flex-shrink-0 font-bold"
                      style={{ background: '#7E2841' }}
                    >
                      {unread}
                    </span>
                  )}
                  {noMessages && (
                    <span className="text-[11px] text-gray-400 flex-shrink-0">未返信</span>
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
