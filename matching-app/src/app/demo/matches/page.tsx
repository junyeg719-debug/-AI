'use client'

import Link from 'next/link'
import { Heart, MessageCircle } from 'lucide-react'
import { DEMO_MATCHES, MATCHED_PROFILES } from '@/lib/demo-data'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'

export default function DemoMatchesPage() {
  const profileMap = new Map(MATCHED_PROFILES.map((p) => [p.user_id, p]))

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white px-4 pt-10 pb-4 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">マッチ一覧</h1>
        <p className="text-gray-500 text-sm mt-0.5">{DEMO_MATCHES.length}人とマッチ中</p>
      </div>

      {/* New match banner */}
      <div className="mx-4 mt-4 p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl border border-rose-100">
        <p className="text-rose-600 text-sm font-semibold mb-1">💕 新しくマッチしました</p>
        <p className="text-gray-500 text-xs">「探す」でいいねをするとここに表示されます</p>
      </div>

      <div className="px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          {DEMO_MATCHES.map((match) => {
            const partner = profileMap.get(match.user2_id) ?? profileMap.get(match.user1_id)
            if (!partner) return null

            return (
              <Link
                key={match.id}
                href={`/demo/chat/${match.id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition group"
              >
                <div className={`h-36 bg-gradient-to-br ${partner.color} relative flex items-center justify-center`}>
                  <span className="text-5xl">{partner.emoji}</span>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition rounded-t-2xl" />
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{partner.name}</p>
                      <p className="text-gray-400 text-xs">{partner.age}歳 ・{partner.location}</p>
                    </div>
                    <MessageCircle className="w-4 h-4 text-rose-400" />
                  </div>
                  {match.created_at && (
                    <p className="text-gray-300 text-xs mt-1">
                      {formatDistanceToNow(new Date(match.created_at), { addSuffix: true, locale: ja })}
                    </p>
                  )}
                </div>
              </Link>
            )
          })}

          {/* プレースホルダー */}
          <div className="bg-white/60 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center h-44 gap-2">
            <Heart className="w-8 h-8 text-gray-200" />
            <p className="text-gray-300 text-xs text-center px-2">いいねを送ってみよう</p>
          </div>
        </div>
      </div>
    </div>
  )
}
