'use client'

import { useState, useRef, useEffect, use } from 'react'
import { ArrowLeft, Send } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import {
  DEMO_MATCHES, MATCHED_PROFILES, DEMO_MESSAGES,
  DEMO_USER_ID, type DemoMessage,
} from '@/lib/demo-data'

export default function DemoChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: matchId } = use(params)
  const match = DEMO_MATCHES.find((m) => m.id === matchId)
  const partnerId = match
    ? (match.user1_id === DEMO_USER_ID ? match.user2_id : match.user1_id)
    : null
  const partner = MATCHED_PROFILES.find((p) => p.user_id === partnerId)

  const [messages, setMessages] = useState<DemoMessage[]>(DEMO_MESSAGES[matchId] ?? [])
  const [input, setInput] = useState('')
  const [partnerTyping, setPartnerTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!match || !partner) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">チャットが見つかりません</p>
      </div>
    )
  }

  const sendMessage = () => {
    const content = input.trim()
    if (!content) return
    setInput('')

    const newMsg: DemoMessage = {
      id: `msg-demo-${Date.now()}`,
      match_id: matchId,
      sender_id: DEMO_USER_ID,
      content,
      is_read: false,
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, newMsg])

    // 相手の返信をシミュレート
    setPartnerTyping(true)
    const replies = [
      'そうなんですね！✨',
      'それは楽しそうですね😊',
      'ぜひ聞かせてください！',
      'なるほど、私もそう思います！',
      `${partner.interests[0]}もいいですよね～`,
      'また話しましょう！',
    ]
    const reply = replies[Math.floor(Math.random() * replies.length)]
    setTimeout(() => {
      setPartnerTyping(false)
      const replyMsg: DemoMessage = {
        id: `msg-reply-${Date.now()}`,
        match_id: matchId,
        sender_id: partner.user_id,
        content: reply,
        is_read: true,
        created_at: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, replyMsg])
    }, 1200 + Math.random() * 800)
  }

  const grouped = groupByDate(messages)

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 pt-10 pb-3 shadow-sm flex items-center gap-3 sticky top-6 z-10">
        <Link href="/demo/chat" className="p-2 hover:bg-gray-100 rounded-full transition">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${partner.color} flex items-center justify-center text-xl flex-shrink-0`}>
          {partner.emoji}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{partner.name}</p>
          <p className="text-xs text-gray-400">{partner.age}歳 ・{partner.location}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {Object.entries(grouped).map(([date, msgs]) => (
          <div key={date}>
            <div className="flex items-center gap-2 my-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium px-2">{date}</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className="space-y-2">
              {msgs.map((msg) => {
                const isMine = msg.sender_id === DEMO_USER_ID
                return (
                  <div key={msg.id} className={`flex items-end gap-2 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                    {!isMine && (
                      <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${partner.color} flex items-center justify-center flex-shrink-0 text-sm`}>
                        {partner.emoji}
                      </div>
                    )}
                    <div className={`max-w-[70%] flex flex-col gap-0.5 ${isMine ? 'items-end' : 'items-start'}`}>
                      <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        isMine
                          ? 'bg-gradient-to-br from-rose-400 to-pink-500 text-white rounded-br-sm'
                          : 'bg-white text-gray-800 shadow-sm rounded-bl-sm'
                      }`}>
                        {msg.content}
                      </div>
                      <span className="text-xs text-gray-400 px-1">
                        {format(new Date(msg.created_at), 'HH:mm')}
                        {isMine && <span className="ml-1 text-rose-400">既読</span>}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {partnerTyping && (
          <div className="flex items-end gap-2">
            <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${partner.color} flex items-center justify-center text-sm`}>
              {partner.emoji}
            </div>
            <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-100 px-4 py-3 pb-6">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
            placeholder="メッセージを入力..."
            rows={1}
            className="flex-1 px-4 py-2.5 bg-gray-100 rounded-2xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-rose-300 max-h-28"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 hover:opacity-90 transition disabled:opacity-40 shadow-md"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}

function groupByDate(messages: DemoMessage[]): Record<string, DemoMessage[]> {
  return messages.reduce<Record<string, DemoMessage[]>>((acc, msg) => {
    const date = format(new Date(msg.created_at), 'M月d日（E）', { locale: ja })
    if (!acc[date]) acc[date] = []
    acc[date].push(msg)
    return acc
  }, {})
}
