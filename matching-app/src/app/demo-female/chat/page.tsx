'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { SlidersHorizontal, User } from 'lucide-react'
import {
  FEMALE_DEMO_MATCHES,
  FEMALE_DEMO_MESSAGES,
  MALE_PROFILE_MAP,
  FEMALE_USER_ID,
} from '@/lib/female-demo-data'
import { channel } from '@/lib/channel'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'
import type { DemoMatch, DemoMessage } from '@/lib/demo-data'

export default function FemaleChatListPage() {
  const [msgMap, setMsgMap] = useState<Record<string, DemoMessage[]>>(() => {
    const m: Record<string, DemoMessage[]> = {}
    for (const match of FEMALE_DEMO_MATCHES) {
      m[match.id] = FEMALE_DEMO_MESSAGES[match.id] ?? []
    }
    return m
  })
  const [extraMatches, setExtraMatches] = useState<DemoMatch[]>([])
  const [liveMsg, setLiveMsg] = useState<{ matchId: string; msg: DemoMessage } | null>(null)

  useEffect(() => {
    const m: Record<string, DemoMessage[]> = {}
    for (const match of FEMALE_DEMO_MATCHES) {
      try {
        const stored = JSON.parse(localStorage.getItem(`female_messages_${match.id}`) ?? 'null')
        m[match.id] = stored ?? FEMALE_DEMO_MESSAGES[match.id] ?? []
      } catch {
        m[match.id] = FEMALE_DEMO_MESSAGES[match.id] ?? []
      }
    }
    setMsgMap(m)

    try {
      const stored: Array<{ matchId: string; userId: string; matchedAt: string }> = JSON.parse(localStorage.getItem('female_matches') ?? '[]')
      const extra: DemoMatch[] = stored
        .filter(sm => !FEMALE_DEMO_MATCHES.find(m => m.id === sm.matchId))
        .map(sm => ({ id: sm.matchId, user1_id: FEMALE_USER_ID, user2_id: sm.userId, created_at: sm.matchedAt, last_message_at: null }))
      setExtraMatches(extra)
    } catch {}
  }, [])

  useEffect(() => {
    return channel.on(ev => {
      if (ev.type === 'message') {
        const msg: DemoMessage = {
          id: ev.msg.id, match_id: ev.matchId,
          sender_id: ev.msg.senderId, content: ev.msg.content,
          is_read: false, created_at: ev.msg.createdAt,
        }
        setLiveMsg({ matchId: ev.matchId, msg })
        setMsgMap(prev => {
          const existing = prev[ev.matchId] ?? []
          if (existing.find(m => m.id === msg.id)) return prev
          return { ...prev, [ev.matchId]: [...existing, msg] }
        })
      }
    })
  }, [])

  const allMatches = [...FEMALE_DEMO_MATCHES, ...extraMatches]

  return (
    <div className="min-h-screen">
      <div className="bg-white px-4 pt-10 pb-4 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">メッセージ</h1>
          <button className="p-2 rounded-full hover:bg-gray-50 transition">
            <SlidersHorizontal className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="bg-white divide-y divide-gray-50">
        {allMatches.map(match => {
          const partnerId = match.user1_id === FEMALE_USER_ID ? match.user2_id : match.user1_id
          const partner = MALE_PROFILE_MAP.get(partnerId)
          if (!partner) return null

          const messages = msgMap[match.id] ?? []
          const lastMsg = messages[messages.length - 1]
          const liveForThis = liveMsg?.matchId === match.id ? liveMsg.msg : null
          const displayMsg = liveForThis ?? lastMsg
          const unread = messages.filter(m => !m.is_read && m.sender_id !== FEMALE_USER_ID).length
          const noMessages = messages.length === 0

          return (
            <Link
              key={match.id}
              href={`/demo-female/chat/${match.id}`}
              className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition active:bg-gray-100 relative"
            >
              <div className="relative flex-shrink-0">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${partner.color} flex items-center justify-center text-xl`}>
                  {partner.emoji}
                </div>
                {partner.isOnline && (
                  <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between mb-0.5">
                  <p className="font-semibold text-gray-900 text-sm">
                    {partner.name}{'　'}
                    <span className="font-normal text-xs text-gray-400">
                      {partner.age}歳 {partner.location.replace(/[都府県]$/, '')}
                    </span>
                  </p>
                  {displayMsg && (
                    <p className="text-[11px] text-gray-400 flex-shrink-0 ml-1">
                      {formatDistanceToNow(new Date(displayMsg.created_at), { addSuffix: false, locale: ja })}
                    </p>
                  )}
                  {liveForThis && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold text-white flex-shrink-0 ml-1" style={{ background: '#A84060' }}>LIVE</span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-gray-500 truncate">
                    {noMessages && !displayMsg ? 'メッセージ交換をしていません' : displayMsg?.content ?? 'メッセージ交換をしていません'}
                  </p>
                  {unread > 0 && (
                    <span className="ml-1 min-w-5 h-5 text-white text-xs rounded-full flex items-center justify-center px-1.5 flex-shrink-0 font-bold" style={{ background: '#A84060' }}>
                      {unread}
                    </span>
                  )}
                  {noMessages && !displayMsg && (
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
