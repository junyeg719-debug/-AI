'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Send, Sparkles, X, Bell, Phone, MoreHorizontal, Check } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import {
  DEMO_MATCHES,
  MATCHED_PROFILES,
  DEMO_MESSAGES,
  DEMO_USER_ID,
  DEMO_USER,
  type DemoMessage,
} from '@/lib/demo-data'

const FIRST_MSG_TEMPLATE = 'はじめまして！プロフィール拝見して、共通点がありそうだと思っていいねしました😊 ぜひお話しできたら嬉しいです。よろしくお願いします！'

type CommonTag = { icon: string; label: string }

function getCommonTags(partner: { interests: string[]; location: string; smoking: string; drinking?: string; holiday?: string }): CommonTag[] {
  const tags: CommonTag[] = []
  if (partner.location === DEMO_USER.location) tags.push({ icon: '📍', label: partner.location.replace('県', '').replace('府', '').replace('都', '') })
  if (partner.holiday && partner.holiday === DEMO_USER.holiday) tags.push({ icon: '🗓', label: partner.holiday })
  if (partner.drinking && partner.drinking === DEMO_USER.drinking) tags.push({ icon: '🍺', label: partner.drinking })
  if (partner.smoking === DEMO_USER.smoking) tags.push({ icon: '🚬', label: partner.smoking })
  const commonInterests = DEMO_USER.interests.filter(i => partner.interests.includes(i))
  commonInterests.slice(0, 2).forEach(i => tags.push({ icon: '✨', label: i }))
  return tags.slice(0, 5)
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
  if (lastPartnerMsg.includes('コーヒー') || lastPartnerMsg.includes('カフェ')) {
    return [`コーヒー好きなんですね！私もよくカフェに行きます☕ おすすめのお店はありますか？`, `ラテアートって見てるだけで癒されますよね🎨 どんなデザインが得意ですか？`, base[2]]
  }
  if (lastPartnerMsg.includes('花') || lastPartnerMsg.includes('フラワー')) {
    return [`お花に囲まれたお仕事、素敵ですね🌸 どんな種類のお花が一番好きですか？`, `フラワーアレンジメントとかも作るんですか？センスありそうで気になります✨`, base[4]]
  }
  if (lastPartnerMsg.includes('動物') || lastPartnerMsg.includes('ハリネズミ')) {
    return [`動物カフェって入ったことないんですが、ハリネズミカフェってどんな感じですか😊`, `看護師さんなんですね！お仕事お疲れ様です🦔`, `${interest2}も好きなんですか？一緒に行けたら楽しそうですね！`]
  }
  return [base[0], base[1], base[3]]
}

function groupByDate(messages: DemoMessage[]): Record<string, DemoMessage[]> {
  return messages.reduce<Record<string, DemoMessage[]>>((acc, msg) => {
    const date = format(new Date(msg.created_at), 'M月d日（E）', { locale: ja })
    if (!acc[date]) acc[date] = []
    acc[date].push(msg)
    return acc
  }, {})
}

export default function ChatClient({ matchId }: { matchId: string }) {
  const match = DEMO_MATCHES.find((m) => m.id === matchId)
  const partnerId = match ? (match.user1_id === DEMO_USER_ID ? match.user2_id : match.user1_id) : null
  const partner = MATCHED_PROFILES.find((p) => p.user_id === partnerId)

  const isFirstMessage = (DEMO_MESSAGES[matchId] ?? []).length === 0
  const [messages, setMessages] = useState<DemoMessage[]>(DEMO_MESSAGES[matchId] ?? [])
  const [input, setInput] = useState(isFirstMessage ? FIRST_MSG_TEMPLATE : '')
  const [partnerTyping, setPartnerTyping] = useState(false)
  const [showAiPanel, setShowAiPanel] = useState(false)
  const [hasSentFirst, setHasSentFirst] = useState(!isFirstMessage)
  const bottomRef = useRef<HTMLDivElement>(null)

  const lastPartnerMsg = messages.filter((m) => m.sender_id !== DEMO_USER_ID).at(-1)?.content ?? ''
  const aiSuggestions = partner ? getAiSuggestions(partner.name, partner.interests, lastPartnerMsg) : []
  const commonTags = partner ? getCommonTags(partner) : []

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, partnerTyping])

  if (!match || !partner) {
    return <div className="flex items-center justify-center min-h-screen"><p className="text-gray-500">チャットが見つかりません</p></div>
  }

  const sendMessage = (content?: string) => {
    const text = (content ?? input).trim()
    if (!text) return
    setInput('')
    setShowAiPanel(false)
    setHasSentFirst(true)
    setMessages((prev) => [...prev, { id: `msg-${Date.now()}`, match_id: matchId, sender_id: DEMO_USER_ID, content: text, is_read: false, created_at: new Date().toISOString() }])
    setPartnerTyping(true)
    const replies = ['そうなんですね！✨', 'それは楽しそうですね😊', 'ぜひ聞かせてください！', 'なるほど、私もそう思います！', `${partner.interests[0]}もいいですよね〜`, '今度一緒に行きませんか？']
    setTimeout(() => {
      setPartnerTyping(false)
      setMessages((prev) => [...prev, { id: `reply-${Date.now()}`, match_id: matchId, sender_id: partner.user_id, content: replies[Math.floor(Math.random() * replies.length)], is_read: true, created_at: new Date().toISOString() }])
    }, 1200 + Math.random() * 800)
  }

  const grouped = groupByDate(messages)

  return (
    <div className="fixed inset-0 flex flex-col z-40" style={{ background: '#F8F5F6' }}>
      {/* Header */}
      <div className="bg-white px-4 pt-10 pb-3 shadow-sm flex items-center gap-3 sticky top-0 z-10">
        <Link href="/demo/chat" className="p-2 hover:bg-gray-100 rounded-full transition">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${partner.color} flex items-center justify-center text-xl flex-shrink-0 relative`}>
          {partner.emoji}
          {partner.isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">{partner.name}</p>
          <p className="text-xs text-gray-400">{partner.age}歳 ・{partner.location}</p>
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button className="p-2 hover:bg-gray-100 rounded-full transition">
            <Bell className="w-5 h-5 text-gray-500" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition">
            <Phone className="w-5 h-5 text-gray-500" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition">
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Photo strip */}
        <div className="bg-white px-4 py-3 border-b border-gray-100">
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                {i === 0 ? (
                  <div className={`w-full h-full bg-gradient-to-br ${partner.color} flex items-center justify-center text-2xl`}>{partner.emoji}</div>
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-300 text-[10px]">写真</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Common talking points */}
        {commonTags.length > 0 && (
          <div className="mx-3 mt-3">
            <div className="flex justify-center mb-1">
              <span className="text-xs text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-200">話題になりそうな共通点</span>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex gap-2 mb-3">
                <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${partner.color} flex items-center justify-center text-2xl`}>{partner.emoji}</div>
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-2xl">😊</div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {commonTags.map((tag) => (
                  <span key={tag.label} className="text-xs px-2.5 py-1 rounded-full border border-gray-200 text-gray-600 flex items-center gap-1">
                    <span>{tag.icon}</span>{tag.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Match intro (no messages yet) */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center py-6 gap-2 px-6">
            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${partner.color} flex items-center justify-center text-4xl shadow-md`}>{partner.emoji}</div>
            <p className="font-bold text-gray-800 text-lg">{partner.name}さんとマッチ！</p>
            <p className="text-gray-400 text-sm text-center leading-relaxed">{partner.bio}</p>
          </div>
        )}

        {/* Message list */}
        <div className="px-4 py-4 space-y-4">
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
                        <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${partner.color} flex items-center justify-center flex-shrink-0 text-sm`}>{partner.emoji}</div>
                      )}
                      <div className={`max-w-[70%] flex flex-col gap-0.5 ${isMine ? 'items-end' : 'items-start'}`}>
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isMine ? 'rounded-br-sm text-white' : 'bg-white text-gray-800 shadow-sm rounded-bl-sm'}`}
                          style={isMine ? { background: 'linear-gradient(135deg, #7E2841, #A03558)' } : undefined}
                        >
                          {msg.content}
                        </div>
                        <div className={`flex items-center gap-1 px-1 ${isMine ? 'flex-row-reverse' : ''}`}>
                          <span className="text-xs text-gray-400">{format(new Date(msg.created_at), 'HH:mm')}</span>
                          {isMine && msg.is_read && (
                            <>
                              <Check className="w-3 h-3" style={{ color: '#7E2841' }} />
                              <span className="text-[10px]" style={{ color: '#7E2841' }}>既読</span>
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
              <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${partner.color} flex items-center justify-center text-sm`}>{partner.emoji}</div>
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
            1通目のメッセージであなたを特定できる個人情報は送信できません。健全なサービスを運営する目的で運営者がメッセージの内容を確認・削除する場合があります。また、1年以上経過したメッセージは閲覧できません。これに同意した上で送信して下さい。
          </p>
        </div>
      )}

      {/* Template suggestion bar (first message only) */}
      {!hasSentFirst && (
        <div className="bg-white border-t border-gray-100 px-3 py-2 flex items-center gap-2 overflow-x-auto">
          <p className="text-xs text-gray-400 flex-shrink-0">テンプレ：</p>
          {[
            'よろしくお願いします！',
            `${partner.interests[0]}が好きなんですね！`,
            'プロフィール見て気になりました😊',
          ].map((tpl) => (
            <button
              key={tpl}
              onClick={() => setInput(tpl)}
              className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border transition whitespace-nowrap"
              style={{ borderColor: '#D4B0BB', color: '#7E2841', background: '#FEF9FA' }}
            >
              {tpl}
            </button>
          ))}
        </div>
      )}

      {/* AI suggestions panel */}
      {showAiPanel && (
        <div className="bg-white border-t border-gray-100 px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" style={{ color: '#7E2841' }} />
              <p className="text-sm font-bold" style={{ color: '#7E2841' }}>AI返信サポート</p>
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
            onClick={() => setShowAiPanel((v) => !v)}
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition active:scale-90"
            style={{ background: showAiPanel ? '#7E2841' : '#F5E6EA', color: showAiPanel ? '#fff' : '#7E2841' }}
          >
            <Sparkles className="w-5 h-5" />
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
            placeholder="メッセージを入力..."
            rows={1}
            className="flex-1 px-4 py-2.5 bg-gray-100 rounded-2xl text-sm resize-none focus:outline-none max-h-28"
            style={{ caretColor: '#7E2841' }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md transition disabled:opacity-40 active:scale-90"
            style={{ background: 'linear-gradient(135deg, #7E2841, #A03558)' }}
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
