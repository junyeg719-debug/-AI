'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { SlidersHorizontal, User } from 'lucide-react'
import { DEMO_MATCHES, ALL_PROFILES, DEMO_MESSAGES, DEMO_USER_ID, type DemoMessage } from '@/lib/demo-data'
import { storage } from '@/lib/storage'
import { channel } from '@/lib/channel'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'

const DEMO_MATCH_ID = 'match-demo-pair'

export default function DemoChatListPage() {
  const profileMap = new Map(ALL_PROFILES.map((p) => [p.user_id, p]))
  const [msgMap, setMsgMap] = useState<Record<string, DemoMessage[]>>(() => {
    const m: Record<string, DemoMessage[]> = {}
    for (const match of DEMO_MATCHES) {
      m[match.id] = DEMO_MESSAGES[match.id] ?? []
    }
    return m
  })
  const [liveMatch, setLiveMatch] = useState<{ userId: string } | null>(null)
  const [liveMsg, setLiveMsg] = useState<DemoMessage | null>(null)

  useEffect(() => {
    const m: Record<string, DemoMessage[]> = {}
    for (const match of DEMO_MATCHES) {
      const stored = storage.getMessages(match.id) as DemoMessage[]
      m[match.id] = stored.length > 0 ? stored : (DEMO_MESSAGES[match.id] ?? [])
    }
    setMsgMap(m)
    const storedMatch = storage.getMatches().find(sm => sm.matchId === DEMO_MATCH_ID)
    if (storedMatch) setLiveMatch({ userId: storedMatch.userId })
    const storedMsgs = storage.getMessages(DEMO_MATCH_ID) as DemoMessage[]
    if (storedMsgs.length > 0) setLiveMsg(storedMsgs[storedMsgs.length - 1])
  }, [])

  useEffect(() => {
    return channel.on(ev => {
      if (ev.type === 'matched' && ev.matchId === DEMO_MATCH_ID) {
        const m = storage.getMatches().find(sm => sm.matchId === DEMO_MATCH_ID)
        if (m) setLiveMatch({ userId: m.userId })
      }
      if (ev.type === 'message' && ev.matchId === DEMO_MATCH_ID) {
        setLiveMsg({ id: ev.msg.id, match_id: DEMO_MATCH_ID, sender_id: ev.msg.senderId, content: ev.msg.content, is_read: false, created_at: ev.msg.createdAt })
      }
    })
  }, [])

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
        {/* Live demo match (match-demo-pair) */}
        {liveMatch && (() => {
          const partner = profileMap.get(liveMatch.userId)
          if (!partner) return null
          return (
            <Link key={DEMO_MATCH_ID} href={`/demo/chat/${DEMO_MATCH_ID}`}
              className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition active:bg-gray-100 relative">
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-300 to-rose-400 flex items-center justify-center text-xl">
                  {partner.emoji}
                </div>
                {partner.isOnline && <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-bold text-sm text-gray-900">{partner.name} {partner.age}歳</span>
                  <span className="text-[11px] text-gray-400 flex-shrink-0">たった今</span>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500 truncate flex-1">
                    {liveMsg ? liveMsg.content : 'マッチングしました！'}
                  </p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold text-white flex-shrink-0" style={{ background: '#A84060' }}>LIVE</span>
                </div>
              </div>
            </Link>
          )
        })()}

        {DEMO_MATCHES.map((match) => {
          const partnerId =
            match.user1_id === DEMO_USER_ID ? match.user2_id : match.user1_id
          const partner = profileMap.get(partnerId)
          if (!partner) return null

          const messages = msgMap[match.id] ?? []
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
                      {partner.age}歳 {partner.location.replace(/[都府県]$/, '')}
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
                      : lastMsg?.content ?? 'メッセージ交換をしていません'}
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
