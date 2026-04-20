'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SlidersHorizontal, Camera, CheckCircle, Heart, User } from 'lucide-react'
import { CANDIDATE_PROFILES, MATCHED_PROFILES, type DemoProfile } from '@/lib/demo-data'

const SORT_TABS = [
  { label: 'いいね！が多い順', key: 'likes' },
  { label: 'ログイン順', key: 'login' },
  { label: 'おすすめ順', key: 'recommend' },
  { label: '新メンバー', key: 'new' },
  { label: 'マイQ&A', key: 'qa' },
]

const ALL_BROWSE = [...MATCHED_PROFILES, ...CANDIDATE_PROFILES]

function sortProfiles(profiles: DemoProfile[], key: string): DemoProfile[] {
  switch (key) {
    case 'likes':
      return [...profiles].sort((a, b) => b.likeCount - a.likeCount)
    case 'login':
      return [...profiles].filter((p) => p.isOnline).concat(profiles.filter((p) => !p.isOnline))
    case 'new':
      return [...profiles].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
    default:
      return profiles
  }
}

export default function DemoDiscoverPage() {
  const [activeTab, setActiveTab] = useState('recommend')
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())

  const profiles = sortProfiles(ALL_BROWSE, activeTab)

  const toggleLike = (id: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="min-h-screen">
      {/* ── Header ── */}
      <div className="bg-white px-4 pt-10 pb-0 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-baseline gap-1">
            <h1 className="text-2xl font-bold" style={{ color: '#7E2841' }}>魅力マッチ</h1>
            <span className="text-xs text-gray-400 font-normal">by 魅力大学</span>
          </div>
          <button className="p-2 rounded-full hover:bg-gray-100 transition">
            <SlidersHorizontal className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Sort tabs */}
        <div className="flex overflow-x-auto gap-0 -mx-4 px-4 pb-0 no-scrollbar">
          {SORT_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex-shrink-0 px-3 py-2.5 text-sm font-medium transition-colors relative whitespace-nowrap"
              style={{ color: activeTab === tab.key ? '#7E2841' : '#9CA3AF' }}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ background: '#7E2841' }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Story circles ── */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {/* Pickup member circle */}
          <div className="flex-shrink-0 flex flex-col items-center gap-1">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
              style={{ background: 'linear-gradient(135deg, #7E2841, #A03558)' }}
            >
              <div className="text-center leading-tight">
                <div className="text-[9px]">本日の</div>
                <div className="text-[9px]">Pickup</div>
              </div>
            </div>
            <span className="text-[10px] text-gray-500 text-center w-14 truncate">Pickup</span>
          </div>
          {profiles.slice(0, 6).map((p) => (
            <div key={p.id} className="flex-shrink-0 flex flex-col items-center gap-1">
              <div
                className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center relative shadow-sm overflow-hidden"
                style={{ border: p.isOnline ? '2px solid #22c55e' : '2px solid #E8E0E2' }}
              >
                {p.avatar_url
                  ? <img src={p.avatar_url} className="w-full h-full object-cover" alt={p.name} />
                  : <User className="w-8 h-8 text-gray-400" />
                }
                {p.isOnline && (
                  <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              <span className="text-[10px] text-gray-500 text-center w-14 truncate">{p.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Promotional banner ── */}
      <div className="px-4 py-3">
        <div
          className="rounded-2xl p-4 text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #7E2841 0%, #A03558 60%, #C0476E 100%)' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-lg">🪙</span>
                <span className="text-xs font-medium opacity-90">期間限定</span>
              </div>
              <p className="text-lg font-bold leading-tight">ポイント増量</p>
              <p className="text-xs opacity-80 mt-0.5">キャンペーン開催中！</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black opacity-20 absolute right-4 top-2">✦</div>
              <button className="bg-white text-[#7E2841] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                詳細を見る
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Profile grid ── */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-3">
          {profiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              liked={likedIds.has(profile.id)}
              onLike={() => toggleLike(profile.id)}
            />
          ))}
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}

// ── Profile card ──────────────────────────────
function ProfileCard({
  profile,
  liked,
  onLike,
}: {
  profile: DemoProfile
  liked: boolean
  onLike: () => void
}) {
  return (
    <Link href={`/demo/profile/${profile.id}`} className="bg-white rounded-2xl overflow-hidden shadow-sm active:scale-[0.98] transition-transform block">
      {/* Photo area */}
      <div
        className="relative bg-gray-200 flex items-center justify-center overflow-hidden"
        style={{ aspectRatio: '3/4' }}
      >
        {profile.avatar_url
          ? <img src={profile.avatar_url} className="w-full h-full object-cover absolute inset-0" alt={profile.name} />
          : <User className="w-20 h-20 text-gray-400" />
        }

        {/* Photo count */}
        <div className="absolute bottom-2 right-2 bg-black/40 text-white text-[11px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
          <Camera className="w-3 h-3" />
          <span>{profile.photoCount}</span>
        </div>

        {/* NEW badge */}
        {new Date(profile.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
          <div
            className="absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: '#7E2841' }}
          >
            NEW
          </div>
        )}

        {/* Like button */}
        <button
          onClick={(e) => { e.stopPropagation(); onLike() }}
          className="absolute bottom-2 left-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm transition-transform active:scale-90"
        >
          <Heart
            className="w-4 h-4 transition-colors"
            style={{ color: liked ? '#7E2841' : '#D1D5DB', fill: liked ? '#7E2841' : 'none' }}
          />
        </button>
      </div>

      {/* Info */}
      <div className="px-2.5 py-2">
        <div className="flex items-center gap-1 mb-0.5">
          {profile.isOnline && (
            <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
          )}
          <span className="text-[13px] font-semibold text-gray-800 truncate">
            {profile.age}歳 {profile.location.replace('府', '').replace('県', '').replace('都', '')}
          </span>
          {profile.isVerified && (
            <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#3B82F6' }} />
          )}
        </div>
        <div className="flex items-center gap-2 text-[11px]" style={{ color: '#9CA3AF' }}>
          <span className="flex items-center gap-0.5">
            <span>👍</span>
            <span>{profile.likeCount}</span>
          </span>
          <span className="flex items-center gap-0.5">
            <Camera className="w-3 h-3" />
            <span>{profile.photoCount}</span>
          </span>
          <span style={{ color: '#7E2841' }} className="font-medium">
            ♥{profile.matchPercent}%
          </span>
        </div>
      </div>
    </Link>
  )
}
