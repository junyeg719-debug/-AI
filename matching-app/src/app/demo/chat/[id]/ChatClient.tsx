'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Send, Sparkles, X } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import {
  DEMO_MATCHES,
  MATCHED_PROFILES,
  DEMO_MESSAGES,
  DEMO_USER_ID,
  type DemoMessage,
} from '@/lib/demo-data'

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

  const [messages, setMessages] = useState<DemoMessage[]>(DEMO_MESSAGES[matchId] ?? [])
  const [input, setInput] = useState('')
  const [partnerTyping, setPartnerTyping] = useState(false)
  const [showAiPanel, setShowAiPanel] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const lastPartnerMsg = messages.filter((m) => m.sender_id !== DEMO_USER_ID).at(-1)?.content ?? ''
  const aiSuggestions = partner ? getAiSuggestions(partner.name, partner.interests, lastPartnerMsg) : []

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
    <div className="flex flex-col h-screen" style={{ background: '#F8F5F6' }}>
      <div className="bg-white px-4 pt-10 pb-3 shadow-sm flex items-center gap-3 sticky top-0 z-10">
        <Link href="/demo/chat" className="p-2 hover:bg-gray-100 rounded-full transition">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${partner.color} flex items-center justify-center text-xl flex-shrink-0 relative`}>
          {partner.emoji}
          {partner.isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900">{partner.name}</p>
          <p className="text-xs text-gray-400">{partner.age}歳 ・{partner.location}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center py-8 gap-3">
            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${partner.color} flex items-center justify-center text-4xl shadow-md`}>{partner.emoji}</div>
            <p className="font-bold text-gray-800 text-lg">{partner.name}さんとマッチ！</p>
            <div className="flex flex-wrap gap-1.5 justify-center px-4">
              {partner.interests.slice(0, 4).map((i) => (<span key={i} className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: '#F5E6EA', color: '#7E2841' }}>{i}</span>))}
            </div>
            <p className="text-gray-400 text-sm text-center px-6">{partner.bio}</p>
          </div>
        )}
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
                    {!isMine && <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${partner.color} flex items-center justify-center flex-shrink-0 text-sm`}>{partner.emoji}</div>}
                    <div className={`max-w-[70%] flex flex-col gap-0.5 ${isMine ? 'items-end' : 'items-start'}`}>
                      <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isMine ? 'rounded-br-sm text-white' : 'bg-white text-gray-800 shadow-sm rounded-bl-sm'}`} style={isMine ? { background: 'linear-gradient(135deg, #7E2841, #A03558)' } : undefined}>
                        {msg.content}
                      </div>
                      <span className="text-xs text-gray-400 px-1">
                        {format(new Date(msg.created_at), 'HH:mm')}
                        {isMine && <span className="ml-1" style={{ color: '#7E2841' }}>既読</span>}
                      </span>
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

      {showAiPanel && (
        <div className="bg-white border-t border-gray-100 px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" style={{ color: '#7E2841' }} />
              <p className="text-sm font-bold" style={{ color: '#7E2841' }}>AI返信サポート</p>
            </div>
            <button onClick={() => setShowAiPanel(false)} className="p-1 rounded-full hover:bg-gray-100 transition"><X className="w-4 h-4 text-gray-400" /></button>
          </div>
          <div className="space-y-2">
            {aiSuggestions.map((s, i) => (
              <button key={i} onClick={() => sendMessage(s)} className="w-full text-left text-sm px-3 py-2.5 rounded-xl border transition" style={{ borderColor: '#E8E0E2', background: '#FAFAFA', color: '#1A1A1A' }}>{s}</button>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 text-center mt-2">✨ AIが会話の流れを読んで返信を提案しています</p>
        </div>
      )}

      <div className="bg-white border-t border-gray-100 px-4 py-3 pb-6">
        <div className="flex items-end gap-2">
          <button onClick={() => setShowAiPanel((v) => !v)} className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition active:scale-90" style={{ background: showAiPanel ? '#7E2841' : '#F5E6EA', color: showAiPanel ? '#fff' : '#7E2841' }}>
            <Sparkles className="w-5 h-5" />
          </button>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }} placeholder="メッセージを入力..." rows={1} className="flex-1 px-4 py-2.5 bg-gray-100 rounded-2xl text-sm resize-none focus:outline-none max-h-28" style={{ caretColor: '#7E2841' }} />
          <button onClick={() => sendMessage()} disabled={!input.trim()} className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md transition disabled:opacity-40 active:scale-90" style={{ background: 'linear-gradient(135deg, #7E2841, #A03558)' }}>
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
