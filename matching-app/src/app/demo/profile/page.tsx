'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Star, Bell, ThumbsUp, Award, BookOpen, Settings, Gem, Pencil } from 'lucide-react'
import { DEMO_USER } from '@/lib/demo-data'

const MENU_ROWS = [
  [
    { icon: Star, label: 'お気に入り', badge: null },
    { icon: Bell, label: 'お知らせ', badge: 'N' },
    { icon: ThumbsUp, label: '自分から', badge: null },
  ],
  [
    { icon: Award, label: 'Omiaiポイント', badge: null },
    { icon: Gem, label: '有料会員', badge: null },
    { icon: Gem, label: 'プレミアムパック', badge: null },
  ],
  [
    { icon: BookOpen, label: 'ヘルプ', badge: null },
    { icon: Settings, label: '各種設定', badge: null },
    null,
  ],
]

export default function ProfileDashboard() {
  const [photo, setPhoto] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhoto(URL.createObjectURL(file))
    e.target.value = ''
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top: avatar + button */}
      <div className="px-5 pt-14 pb-5 flex items-center gap-4">
        <button onClick={() => fileRef.current?.click()} className="relative flex-shrink-0">
          {photo
            ? <img src={photo} alt="avatar" className="w-20 h-20 rounded-full object-cover border border-gray-200" />
            : <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${DEMO_USER.color} flex items-center justify-center text-4xl`}>
                {DEMO_USER.emoji}
              </div>
          }
          <div className="absolute bottom-0.5 right-0.5 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow border border-gray-200">
            <Pencil className="w-3 h-3 text-gray-500" />
          </div>
        </button>

        <Link href="/demo/profile/edit"
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full border-2 border-gray-800 font-bold text-gray-800 text-sm active:bg-gray-50 transition">
          ✏️ プロフィールを設定
        </Link>
      </div>

      {/* Stats row */}
      <div className="flex border-t border-b border-gray-100 divide-x divide-gray-100">
        <div className="flex-1 py-4 text-center">
          <p className="text-[11px] text-gray-400 mb-1">会員ステータス</p>
          <p className="text-sm font-bold text-blue-500">無料会員</p>
        </div>
        <div className="flex-1 py-4 text-center">
          <p className="text-[11px] text-gray-400 mb-1">残いいね！数</p>
          <p className="text-sm font-bold text-gray-800">👍 131</p>
        </div>
        <div className="flex-1 py-4 text-center">
          <p className="text-[11px] text-gray-400 mb-1">残ポイント数</p>
          <p className="text-sm font-bold text-gray-800">🪙 0</p>
        </div>
      </div>

      {/* Icon grid */}
      <div className="py-2">
        {MENU_ROWS.map((row, ri) => (
          <div key={ri} className="flex border-b border-gray-50">
            {row.map((item, ci) =>
              item ? (
                <button key={ci} className="flex-1 flex flex-col items-center justify-center gap-2 py-6 active:bg-gray-50 transition relative">
                  <div className="relative">
                    <item.icon className="w-7 h-7 text-gray-700" strokeWidth={1.5} />
                    {item.badge && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-gray-600">{item.label}</span>
                </button>
              ) : (
                <div key={ci} className="flex-1" />
              )
            )}
          </div>
        ))}
      </div>

      {/* Banners */}
      <div className="px-4 pt-4 flex gap-3">
        <div className="flex-1 h-24 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #1a73e8, #0d47a1)' }}>
          有料会員プラン<br />
          <span className="text-xs font-normal">詳細を見る →</span>
        </div>
        <div className="flex-1 h-24 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)' }}>
          ポイントを<br />購入する →
        </div>
      </div>

      {/* Instagram link */}
      <div className="px-4 pt-3 pb-4">
        <a
          href="https://www.instagram.com/motesnap_?igsh=cm84bml5OHFncnI2"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-4 rounded-2xl active:opacity-80 transition"
          style={{ background: 'linear-gradient(135deg, #f9ce34, #ee2a7b, #6228d7)' }}
        >
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-white font-bold text-sm">@motesnap_</p>
            <p className="text-white/80 text-xs mt-0.5">Instagramをフォローする</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </a>

        <a
          href="https://mote-snap.com/?utm_source=ig&utm_medium=social&utm_content=link_in_bio"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-white shadow-sm active:opacity-80 transition"
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #f9ce34, #f5a623)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm text-gray-800">mote-snap.com</p>
            <p className="text-gray-400 text-xs mt-0.5">公式サイトを見る</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </a>
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
    </div>
  )
}
