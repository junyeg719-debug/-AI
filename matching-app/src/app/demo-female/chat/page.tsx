'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Send } from 'lucide-react'
import Link from 'next/link'
import { storage } from '@/lib/storage'
import { channel } from '@/lib/channel'
import { DEMO_USER } from '@/lib/demo-data'
import type { DemoMessage } from '@/lib/demo-data'

const MATCH_ID = 'match-demo-pair'
const FEMALE_USER_ID = 'user-001'
const FEMALE_NAME = 'まい'
const MALE = DEMO_USER

export default function FemaleChatPage() {
  const [messages, setMessages] = useState<DemoMessage[]>([])
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stored = storage.getMessages(MATCH_ID) as DemoMessage[]
    setMessages(stored)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    return channel.on(ev => {
      if (ev.type === 'message' && ev.matchId === MATCH_ID) {
        const msg: DemoMessage = {
          id: ev.msg.id,
          match_id: MATCH_ID,
          sender_id: ev.msg.senderId,
          content: ev.msg.content,
          is_read: false,
          created_at: ev.msg.createdAt,
        }
        setMessages(prev => {
          if (prev.find(m => m.id === msg.id)) return prev
          const next = [...prev, msg]
          storage.setMessages(MATCH_ID, next)
          return next
        })
      }
    })
  }, [])

  const sendMessage = () => {
    const text = input.trim()
    if (!text) return
    const msg: DemoMessage = {
      id: `f-${Date.now()}`,
      match_id: MATCH_ID,
      sender_id: FEMALE_USER_ID,
      content: text,
      is_read: false,
      created_at: new Date().toISOString(),
    }
    setMessages(prev => {
      const next = [...prev, msg]
      storage.setMessages(MATCH_ID, next)
      return next
    })
    channel.send({ type: 'message', matchId: MATCH_ID, msg: { id: msg.id, content: msg.content, senderId: msg.sender_id, createdAt: msg.created_at } })
    setInput('')
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 pt-10 pb-3 shadow-sm flex items-center gap-3 flex-shrink-0">
        <Link href="/demo-female" className="p-2 rounded-full hover:bg-gray-100 transition">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 flex-shrink-0">
          俊
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm text-gray-900">{MALE.name} {MALE.age}歳</p>
          <p className="text-xs text-gray-400">{MALE.occupation}</p>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full font-bold text-white" style={{ background: '#A84060' }}>
          女性ビュー
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">
            <p className="text-2xl mb-2">💕</p>
            <p>マッチングしました！</p>
            <p className="text-xs mt-1">最初のメッセージを送りましょう</p>
          </div>
        )}
        {messages.map(msg => {
          const isMine = msg.sender_id === FEMALE_USER_ID
          return (
            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'} items-end gap-2`}>
              {!isMine && (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                  俊
                </div>
              )}
              <div
                className="max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
                style={isMine
                  ? { background: '#A84060', color: 'white', borderBottomRightRadius: 4 }
                  : { background: 'white', color: '#1f2937', borderBottomLeftRadius: 4 }
                }
              >
                {msg.content}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white px-4 py-3 flex gap-2 items-center border-t border-gray-100 flex-shrink-0">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder={`${FEMALE_NAME}として送信...`}
          className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm focus:outline-none"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition"
          style={{ background: '#A84060' }}
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  )
}
