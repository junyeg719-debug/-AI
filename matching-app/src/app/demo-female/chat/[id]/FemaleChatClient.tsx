'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Send, Sparkles, X, Bell, Phone, MoreHorizontal, Check, User } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import {
  FEMALE_DEMO_MATCHES,
  FEMALE_DEMO_MESSAGES,
  MALE_PROFILE_MAP,
  FEMALE_USER_ID,
  FEMALE_DEMO_USER,
} from '@/lib/female-demo-data'
import { channel } from '@/lib/channel'
import type { DemoMessage } from '@/lib/demo-data'

function getFemaleMessages(matchId: string): DemoMessage[] {
  try {
    const stored = JSON.parse(localStorage.getItem(`female_messages_${matchId}`) ?? 'null')
    return stored ?? FEMALE_DEMO_MESSAGES[matchId] ?? []
  } catch {
    return FEMALE_DEMO_MESSAGES[matchId] ?? []
  }
}

function saveFemaleMessages(matchId: string, messages: DemoMessage[]) {
  try { localStorage.setItem(`female_messages_${matchId}`, JSON.stringify(messages)) } catch {}
}

function groupByDate(messages: DemoMessage[]): Record<string, DemoMessage[]> {
  return messages.reduce<Record<string, DemoMessage[]>>((acc, msg) => {
    const date = format(new Date(msg.created_at), 'M月d日（E）', { locale: ja })
    if (!acc[date]) acc[date] = []
    acc[date].push(msg)
    return acc
  }, {})
}

function getAiSuggestions(partnerName: string, partnerInterests: string[], lastPartnerMsg: string): string[] {
  const interest = partnerInterests[0] ?? '趣味'
  const interest2 = partnerInterests[1] ?? '旅行'
  const base = [
    `${partnerName}さんのこと、もっと教えてほしいです😊 ${interest}はいつ頃から好きになったんですか？`,
    `${interest2}が好きなんですね！おすすめのスポットとか場所ってありますか？✨`,
    `プロフィール見て共通点がありそうだと思っていいねしました！これからよろしくお願いします🙇`,
    `最近どんなお休みの日を過ごしていますか？私も同じことが好きなのでお話ししたいです！`,
    `${partnerName}さんは普段どのあたりで過ごすことが多いですか？`,
  ]
  if (lastPartnerMsg.includes('カフェ')) {
    return [`カフェ好きなんですね！私もよくカフェに行きます☕ おすすめのお店はありますか？`, base[2], base[4]]
  }
  return [base[0], base[1], base[3]]
}

export default function FemaleChatClient({ matchId }: { matchId: string }) {
  const staticMatch = FEMALE_DEMO_MATCHES.find(m => m.id === matchId)
  const dynamicMatch = !staticMatch ? (() => {
    try {
      const stored: Array<{ matchId: string; userId: string; matchedAt: string }> = JSON.parse(localStorage.getItem('female_matches') ?? '[]')
      const m = stored.find(sm => sm.matchId === matchId)
      return m ? { id: matchId, user1_id: FEMALE_USER_ID, user2_id: m.userId, created_at: m.matchedAt, last_message_at: null } : null
    } catch { return null }
  })() : null
  const match = staticMatch ?? dynamicMatch

  const partnerId = match ? (match.user1_id === FEMALE_USER_ID ? match.user2_id : match.user1_id) : null
  const partner = partnerId ? MALE_PROFILE_MAP.get(partnerId) : null

  const seedMessages = FEMALE_DEMO_MESSAGES[matchId] ?? []
  const isFirstMessage = seedMessages.length === 0
  const [messages, setMessages] = useState<DemoMessage[]>(seedMessages)
  const [input, setInput] = useState(isFirstMessage ? 'はじめまして！プロフィール見て気になりました😊 ぜひお話しできたら嬉しいです！' : '')
  const [partnerTyping, setPartnerTyping] = useState(false)
  const [showAiPanel, setShowAiPanel] = useState(false)
  const [hasSentFirst, setHasSentFirst] = useState(!isFirstMessage)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stored = getFemaleMessages(matchId)
    if (stored.length > 0) {
      setMessages(stored)
      setHasSentFirst(true)
    }
  }, [matchId])

  useEffect(() => {
    return channel.on(ev => {
      if (ev.type === 'message' && ev.matchId === matchId) {
        const msg: DemoMessage = {
          id: ev.msg.id, match_id: matchId,
          sender_id: ev.msg.senderId, content: ev.msg.content,
          is_read: false, created_at: ev.msg.createdAt,
        }
        setMessages(prev => {
          if (prev.find(m => m.id === msg.id)) return prev
          const next = [...prev, msg]
          saveFemaleMessages(matchId, next)
          return next
        })
        setHasSentFirst(true)
      }
    })
  }, [matchId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, partnerTyping])

  if (!match || !partner) {
    return <div className="flex items-center justify-center min-h-screen"><p className="text-gray-500">チャットが見つかりません</p></div>
  }

  const lastPartnerMsg = messages.filter(m => m.sender_id !== FEMALE_USER_ID).at(-1)?.content ?? ''
  const aiSuggestions = getAiSuggestions(partner.name, partner.interests, lastPartnerMsg)

  const sendMessage = (content?: string) => {
    const text = (content ?? input).trim()
    if (!text) return
    setInput('')
    setShowAiPanel(false)
    setHasSentFirst(true)
    const newMsg: DemoMessage = {
      id: `fmsg-${Date.now()}`, match_id: matchId,
      sender_id: FEMALE_USER_ID, content: text,
      is_read: false, created_at: new Date().toISOString(),
    }
    setMessages(prev => {
      const next = [...prev, newMsg]
      saveFemaleMessages(matchId, next)
      return next
    })
    channel.send({ type: 'message', matchId, msg: { id: newMsg.id, content: text, senderId: FEMALE_USER_ID, createdAt: newMsg.created_at } })
    setPartnerTyping(true)
    const replies = [
      `${FEMALE_DEMO_USER.name}さん、よろしくお願いします！😊`,
      'そうなんですね！もっと教えてほしいです✨',
      'それは素敵ですね！私もそう思います',
      'ぜひ話しましょう！',
      `${partner.interests[0]}が好きなんですか？私も気になっています！`,
      '今度ぜひ一緒に行きませんか？',
    ]
    setTimeout(() => {
      setPartnerTyping(false)
      const replyMsg: DemoMessage = {
        id: `freply-${Date.now()}`, match_id: matchId,
        sender_id: partner.user_id,
        content: replies[Math.floor(Math.random() * replies.length)],
        is_read: true, created_at: new Date().toISOString(),
      }
      setMessages(prev => {
        const next = [...prev, replyMsg]
        saveFemaleMessages(matchId, next)
        return next
      })
      channel.send({ type: 'message', matchId, msg: { id: replyMsg.id, content: replyMsg.content, senderId: partner.user_id, createdAt: replyMsg.created_at } })
    }, 1200 + Math.random() * 800)
  }

  const grouped = groupByDate(messages)

  return (
    <div className="fixed inset-0 flex flex-col z-[100]" style={{ background: '#F8F5F6' }}>
      {/* Header */}
      <div className="bg-white px-4 pt-10 pb-3 shadow-sm flex items-center gap-3 sticky top-0 z-10">
        <Link href="/demo-female/chat" className="p-2 hover:bg-gray-100 rounded-full transition">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${partner.color} flex items-center justify-center text-lg flex-shrink-0 relative`}>
          {partner.emoji}
          {partner.isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">{partner.name}</p>
          <p className="text-xs text-gray-400">{partner.age}歳 ・{partner.location}</p>
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button className="p-2 hover:bg-gray-100 rounded-full transition"><Bell className="w-5 h-5 text-gray-500" /></button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition"><Phone className="w-5 h-5 text-gray-500" /></button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition"><MoreHorizontal className="w-5 h-5 text-gray-500" /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Match intro */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center py-8 gap-2 px-6">
            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${partner.color} flex items-center justify-center text-4xl shadow-md`}>
              {partner.emoji}
            </div>
            <p className="font-bold text-gray-800 text-lg">{partner.name}さんとマッチ！</p>
            <p className="text-gray-400 text-sm text-center leading-relaxed">{partner.bio}</p>
          </div>
        )}

        {/* Messages */}
        <div className="px-4 py-4 space-y-4">
          {Object.entries(grouped).map(([date, msgs]) => (
            <div key={date}>
              <div className="flex items-center gap-2 my-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium px-2">{date}</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <div className="space-y-2">
                {msgs.map(msg => {
                  const isMine = msg.sender_id === FEMALE_USER_ID
                  return (
                    <div key={msg.id} className={`flex items-end gap-2 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                      {!isMine && (
                        <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${partner.color} flex items-center justify-center flex-shrink-0 text-sm`}>
                          {partner.emoji}
                        </div>
                      )}
                      <div className={`max-w-[70%] flex flex-col gap-0.5 ${isMine ? 'items-end' : 'items-start'}`}>
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isMine ? 'rounded-br-sm text-white' : 'bg-white text-gray-800 shadow-sm rounded-bl-sm'}`}
                          style={isMine ? { background: 'linear-gradient(135deg, #A84060, #7E2841)' } : undefined}
                        >
                          {msg.content}
                        </div>
                        <div className={`flex items-center gap-1 px-1 ${isMine ? 'flex-row-reverse' : ''}`}>
                          <span className="text-xs text-gray-400">{format(new Date(msg.created_at), 'HH:mm')}</span>
                          {isMine && msg.is_read && (
                            <>
                              <Check className="w-3 h-3" style={{ color: '#A84060' }} />
                              <span className="text-[10px]" style={{ color: '#A84060' }}>既読</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

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
      </div>

      {/* Privacy notice */}
      {!hasSentFirst && (
        <div className="px-4 pb-2">
          <p className="text-[11px] text-gray-400 leading-relaxed">
            1通目のメッセージであなたを特定できる個人情報は送信できません。健全なサービスを運営する目的で運営者がメッセージの内容を確認・削除する場合があります。
          </p>
        </div>
      )}

      {/* Template bar (first message) */}
      {!hasSentFirst && (
        <div className="bg-white border-t border-gray-100 px-3 py-2 flex items-center gap-2 overflow-x-auto">
          <p className="text-xs text-gray-400 flex-shrink-0">テンプレ：</p>
          {[
            'よろしくお願いします！',
            `${partner.interests[0]}が好きなんですね！`,
            'プロフィール見て気になりました😊',
          ].map(tpl => (
            <button
              key={tpl}
              onClick={() => setInput(tpl)}
              className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition whitespace-nowrap"
              style={{ borderColor: '#D4B0BB', color: '#A84060', background: '#FEF9FA' }}
            >
              {tpl}
            </button>
          ))}
        </div>
      )}

      {/* AI panel */}
      {showAiPanel && (
        <div className="bg-white border-t border-gray-100 px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" style={{ color: '#A84060' }} />
              <p className="text-sm font-bold" style={{ color: '#A84060' }}>AI返信サポート</p>
            </div>
            <button onClick={() => setShowAiPanel(false)} className="p-1 rounded-full hover:bg-gray-100 transition">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <div className="space-y-2">
            {aiSuggestions.map((s, i) => (
              <button key={i} onClick={() => sendMessage(s)} className="w-full text-left text-sm px-3 py-2.5 rounded-xl border transition" style={{ borderColor: '#E8E0E2', background: '#FAFAFA', color: '#1A1A1A' }}>
                {s}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 text-center mt-2">✨ AIが会話の流れを読んで返信を提案しています</p>
        </div>
      )}

      {/* Input bar */}
      <div className="bg-white border-t border-gray-100 px-4 py-3 pb-6">
        <div className="flex items-end gap-2">
          <button
            onClick={() => setShowAiPanel(v => !v)}
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition active:scale-90"
            style={{ background: showAiPanel ? '#A84060' : '#F5E6EA', color: showAiPanel ? '#fff' : '#A84060' }}
          >
            <Sparkles className="w-5 h-5" />
          </button>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
            placeholder="メッセージを入力..."
            rows={1}
            className="flex-1 px-4 py-2.5 bg-gray-100 rounded-2xl text-sm resize-none focus:outline-none max-h-28"
            style={{ caretColor: '#A84060' }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md transition disabled:opacity-40 active:scale-90"
            style={{ background: 'linear-gradient(135deg, #A84060, #7E2841)' }}
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
