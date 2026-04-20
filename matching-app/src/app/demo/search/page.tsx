'use client'

import { Info, User } from 'lucide-react'
import { DEMO_FOOTPRINTS } from '@/lib/demo-data'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

// Group footprints by date
function groupByDate(footprints: typeof DEMO_FOOTPRINTS) {
  return footprints.reduce<Record<string, typeof DEMO_FOOTPRINTS>>((acc, fp) => {
    const key = format(new Date(fp.visitedAt), 'M/d（E）', { locale: ja })
    if (!acc[key]) acc[key] = []
    acc[key].push(fp)
    return acc
  }, {})
}

type LikeStatus = 'liked' | 'liked_x' | 'thanked' | null

function StatusButton({ status, likeCount }: { status: LikeStatus; likeCount?: number }) {
  if (status === 'liked') {
    return (
      <div
        className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold text-white w-full"
        style={{ background: 'linear-gradient(90deg, #F47C9E, #E85D87)' }}
      >
        <span>👍</span>
        <span>いいね！</span>
      </div>
    )
  }
  if (status === 'liked_x' && likeCount) {
    return (
      <div
        className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold text-white w-full"
        style={{ background: 'linear-gradient(90deg, #F47C9E, #E85D87)' }}
      >
        <span>👍</span>
        <span>いいね！×{likeCount}</span>
      </div>
    )
  }
  if (status === 'thanked') {
    return (
      <div
        className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold text-white w-full"
        style={{ background: 'linear-gradient(90deg, #F47C9E, #E85D87)' }}
      >
        <span>☺</span>
        <span>ありがとう！</span>
      </div>
    )
  }
  // null = not yet liked
  return (
    <button
      className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold w-full border transition active:scale-95"
      style={{ borderColor: '#E8E0E2', color: '#7E2841', background: '#F5E6EA' }}
    >
      <span>👍</span>
      <span>いいねする</span>
    </button>
  )
}

export default function DemoFootprintsPage() {
  const grouped = groupByDate(DEMO_FOOTPRINTS)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white px-4 pt-10 pb-4 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">足あと</h1>
          <button className="p-2 rounded-full hover:bg-gray-50 transition">
            <Info className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Highlight banner */}
      <div className="mx-4 mt-3 flex items-center justify-between px-4 py-2.5 rounded-xl"
        style={{ background: '#FFF8E7', borderLeft: '3px solid #F59E0B' }}>
        <p className="text-sm text-amber-800 font-medium">
          ハイライト表示で注目度をUPさせよう！
        </p>
        <button className="text-xs font-bold px-3 py-1 rounded-lg border border-amber-400 text-amber-700">
          詳細
        </button>
      </div>

      {/* Footprints list */}
      <div className="mt-3">
        {Object.entries(grouped).map(([date, footprints]) => (
          <div key={date}>
            {/* Date separator */}
            <div className="px-4 py-2 bg-gray-50 border-y border-gray-100">
              <p className="text-xs font-semibold text-gray-500">{date}</p>
            </div>

            {footprints.map((fp) => (
              <div
                key={fp.id}
                className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-50"
              >
                {/* Avatar with match % badge */}
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {fp.profile.avatar_url
                      ? <img src={fp.profile.avatar_url} className="w-full h-full object-cover" alt="" />
                      : <User className="w-8 h-8 text-gray-400" />
                    }
                  </div>
                  <div
                    className="absolute -bottom-1 -right-1 text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full"
                    style={{ background: '#7E2841' }}
                  >
                    {fp.profile.matchPercent}%
                  </div>
                </div>

                {/* Profile info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    {fp.profile.age}歳 {fp.profile.location.replace('府', '').replace('県', '').replace('都', '')}
                  </p>
                  <p className="text-xs text-gray-400">
                    {fp.profile.height}cm {fp.profile.occupation || '−'}
                  </p>
                  <div className="mt-1.5">
                    <StatusButton status={fp.likeStatus} likeCount={fp.likeCount} />
                  </div>
                </div>

                {/* Time */}
                <div className="flex-shrink-0 text-right">
                  <p className="text-xs text-gray-400">
                    {format(new Date(fp.visitedAt), 'HH:mm')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="h-6" />
    </div>
  )
}
