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

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
    </div>
  )
}
