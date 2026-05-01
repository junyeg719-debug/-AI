'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SlidersHorizontal, Camera, CheckCircle, Heart, User } from 'lucide-react'
import {
  MALE_CANDIDATES,
  MALE_LIKED_ME_IDS,
  MATCH_ID_BY_MALE_PROFILE_ID,
} from '@/lib/female-demo-data'
import type { DemoProfile } from '@/lib/demo-data'
import { useLikes } from '@/lib/likes-context'

const SORT_TABS = [
  { label: 'いいね！が多い順', key: 'likes' },
  { label: 'ログイン順', key: 'login' },
  { label: 'おすすめ順', key: 'recommend' },
  { label: '新メンバー', key: 'new' },
]

const CONFETTI_COLORS = ['#A84060', '#F8A4C0', '#FFD700', '#FF6B6B', '#4ECDC4', '#A8E6CF', '#FFEAA7', '#DDA0DD']

function sortProfiles(profiles: DemoProfile[], key: string): DemoProfile[] {
  switch (key) {
    case 'likes': return [...profiles].sort((a, b) => b.likeCount - a.likeCount)
    case 'login': return [...profiles].filter(p => p.isOnline).concat(profiles.filter(p => !p.isOnline))
    case 'new': return [...profiles].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    default: return profiles
  }
}

function getFemLikedIds(): string[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem('female_liked_ids') ?? '[]') } catch { return [] }
}
function saveFemLikedIds(ids: string[]) {
  try { localStorage.setItem('female_liked_ids', JSON.stringify(ids)) } catch {}
}

export default function FemaleDiscoverPage() {
  const router = useRouter()
  const { decrement } = useLikes()
  const [activeTab, setActiveTab] = useState('recommend')
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())
  const [pendingLike, setPendingLike] = useState<DemoProfile | null>(null)
  const [matchedProfile, setMatchedProfile] = useState<DemoProfile | null>(null)
  const [matchId, setMatchId] = useState('')

  useEffect(() => {
    setLikedIds(new Set(getFemLikedIds()))
  }, [])

  const handleLikeClick = (profile: DemoProfile) => {
    if (likedIds.has(profile.id)) {
      const next = new Set(likedIds)
      next.delete(profile.id)
      setLikedIds(next)
      saveFemLikedIds([...next])
    } else {
      setPendingLike(profile)
    }
  }

  const confirmLike = (profile: DemoProfile) => {
    const next = new Set([...likedIds, profile.id])
    setLikedIds(next)
    saveFemLikedIds([...next])
    setPendingLike(null)
    decrement()
    if (MALE_LIKED_ME_IDS.has(profile.id)) {
      const mid = MATCH_ID_BY_MALE_PROFILE_ID[profile.id] ?? `fmatch-${profile.id}`
      setMatchId(mid)
      setMatchedProfile(profile)
      try {
        const existing = JSON.parse(localStorage.getItem('female_matches') ?? '[]')
        if (!existing.find((m: { matchId: string }) => m.matchId === mid)) {
          existing.push({ matchId: mid, userId: profile.user_id, matchedAt: new Date().toISOString() })
          localStorage.setItem('female_matches', JSON.stringify(existing))
        }
      } catch {}
    }
  }

  const profiles = sortProfiles(MALE_CANDIDATES, activeTab)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white px-4 pt-10 pb-0 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-baseline gap-1">
            <h1 className="text-2xl font-bold" style={{ color: '#A84060' }}>魅力マッチ</h1>
            <span className="text-xs text-gray-400 font-normal">by 魅力大学</span>
          </div>
          <button className="p-2 rounded-full hover:bg-gray-100 transition">
            <SlidersHorizontal className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="flex overflow-x-auto gap-0 -mx-4 px-4 pb-0 no-scrollbar">
          {SORT_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex-shrink-0 px-3 py-2.5 text-sm font-medium transition-colors relative whitespace-nowrap"
              style={{ color: activeTab === tab.key ? '#A84060' : '#9CA3AF' }}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ background: '#A84060' }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Story circles */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          <div className="flex-shrink-0 flex flex-col items-center gap-1">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-sm" style={{ background: 'linear-gradient(135deg, #A84060, #7E2841)' }}>
              <div className="text-center leading-tight">
                <div className="text-[9px]">本日の</div>
                <div className="text-[9px]">Pickup</div>
              </div>
            </div>
            <span className="text-[10px] text-gray-500">Pickup</span>
          </div>
          {profiles.slice(0, 6).map(p => (
            <div key={p.id} className="flex-shrink-0 flex flex-col items-center gap-1">
              <div
                className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden"
                style={{ border: p.isOnline ? '2px solid #22c55e' : '2px solid #E8E0E2' }}
              >
                <div className={`w-full h-full bg-gradient-to-br ${p.color} flex items-center justify-center text-xl`}>
                  {p.emoji}
                </div>
              </div>
              <span className="text-[10px] text-gray-500 text-center w-14 truncate">{p.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Promo banner */}
      <div className="px-4 py-3">
        <div className="rounded-2xl p-4 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #A84060 0%, #C0476E 60%, #D4607A 100%)' }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-lg">💎</span>
                <span className="text-xs font-medium opacity-90">期間限定</span>
              </div>
              <p className="text-lg font-bold leading-tight">女性は全機能</p>
              <p className="text-xs opacity-80 mt-0.5">無料で使えます！</p>
            </div>
            <button className="bg-white text-[#A84060] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
              詳細を見る
            </button>
          </div>
        </div>
      </div>

      {/* Profile grid */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-3">
          {profiles.map(profile => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              liked={likedIds.has(profile.id)}
              onLikeClick={handleLikeClick}
            />
          ))}
        </div>
      </div>

      {/* Like confirmation modal */}
      {pendingLike && (
        <LikeModal
          profile={pendingLike}
          onConfirm={() => confirmLike(pendingLike)}
          onCancel={() => setPendingLike(null)}
        />
      )}

      {/* Match popup */}
      {matchedProfile && (
        <MatchPopup
          profile={matchedProfile}
          matchId={matchId}
          onClose={() => setMatchedProfile(null)}
          onMessage={() => { setMatchedProfile(null); router.push(`/demo-female/chat/${matchId}`) }}
        />
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes confettiFall {
          0% { transform: translateY(-60px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes matchCardIn {
          0% { transform: scale(0.8) translateY(40px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes heartPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.25); }
        }
      `}</style>
    </div>
  )
}

function ProfileCard({
  profile, liked, onLikeClick,
}: {
  profile: DemoProfile
  liked: boolean
  onLikeClick: (p: DemoProfile) => void
}) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      <div className="relative" style={{ aspectRatio: '3/4' }}>
        <div className={`w-full h-full bg-gradient-to-br ${profile.color} flex items-center justify-center text-5xl`}>
          {profile.emoji}
        </div>
        {profile.isOnline && (
          <span className="absolute top-2 left-2 text-[10px] font-bold text-white bg-green-500 px-1.5 py-0.5 rounded-full">
            オンライン
          </span>
        )}
        {MALE_LIKED_ME_IDS.has(profile.id) && !liked && (
          <span className="absolute top-2 right-2 text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full" style={{ background: '#A84060' }}>
            ❤️ 気になってる
          </span>
        )}
        <div className="absolute bottom-2 right-2 flex items-center gap-0.5 bg-black/40 text-white text-[10px] px-1.5 py-0.5 rounded-full">
          <Camera className="w-3 h-3" />
          <span>{profile.photoCount}</span>
        </div>
        {profile.matchPercent >= 85 && (
          <div className="absolute bottom-2 left-2 text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full" style={{ background: '#A84060' }}>
            {profile.matchPercent}% マッチ
          </div>
        )}
      </div>
      <div className="px-2.5 pt-2 pb-2.5">
        <div className="flex items-center gap-1 mb-0.5">
          <span className="text-sm font-bold text-gray-900 truncate">{profile.name}</span>
          <span className="text-xs text-gray-400">{profile.age}歳</span>
          {profile.isVerified && <CheckCircle className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />}
        </div>
        <p className="text-[11px] text-gray-400 mb-2 truncate">
          {profile.location.replace(/[都府県]$/, '')} · {profile.occupation}
        </p>
        <button
          onClick={() => onLikeClick(profile)}
          className="w-full flex items-center justify-center gap-1 py-1.5 rounded-xl text-[12px] font-bold transition active:scale-95"
          style={liked
            ? { background: '#7E2841', color: 'white' }
            : { background: '#F5E6EA', color: '#A84060' }
          }
        >
          <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-white text-white' : 'fill-[#A84060]'}`} style={liked ? {} : { color: '#A84060' }} />
          {liked ? 'いいね済み' : 'いいね！'}
        </button>
      </div>
    </div>
  )
}

function LikeModal({ profile, onConfirm, onCancel }: { profile: DemoProfile; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[150] flex items-end justify-center" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative bg-white rounded-t-3xl w-full max-w-md px-6 pt-6 pb-10" onClick={e => e.stopPropagation()} style={{ animation: 'matchCardIn 0.2s ease-out' }}>
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />
        <div className="flex flex-col items-center mb-6">
          <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${profile.color} flex items-center justify-center text-4xl mb-3 shadow-sm`}>
            {profile.emoji}
          </div>
          <p className="text-lg font-bold text-gray-900">{profile.name}さん</p>
          <p className="text-sm text-gray-400 mt-0.5">{profile.age}歳 · {profile.location.replace(/[都府県]$/, '')}</p>
          {MALE_LIKED_ME_IDS.has(profile.id) && (
            <span className="mt-2 text-xs font-bold px-3 py-1 rounded-full" style={{ background: '#FDF0F3', color: '#A84060' }}>
              ❤️ あなたのことが気になっています
            </span>
          )}
        </div>
        <button onClick={onConfirm} className="w-full py-4 rounded-2xl text-white font-bold text-base shadow-sm flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, #A84060, #7E2841)' }}>
          <Heart className="w-5 h-5 fill-white text-white" />
          いいね！を送る
        </button>
        <button onClick={onCancel} className="w-full py-3 text-sm text-gray-400 mt-1">キャンセル</button>
      </div>
    </div>
  )
}

function MatchPopup({ profile, matchId, onClose, onMessage }: { profile: DemoProfile; matchId: string; onClose: () => void; onMessage: () => void }) {
  const pieces = Array.from({ length: 30 }, (_, i) => i)
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-black/75" />
      {pieces.map(i => (
        <div key={i} style={{ position: 'absolute', left: `${(i * 11 + 5) % 100}%`, top: '-40px', width: `${7 + (i % 4) * 3}px`, height: `${7 + (i % 4) * 3}px`, background: CONFETTI_COLORS[i % CONFETTI_COLORS.length], borderRadius: i % 3 !== 0 ? '50%' : '3px', animation: `confettiFall ${2 + (i % 5) * 0.35}s ${(i * 0.11) % 2.2}s ease-in forwards`, pointerEvents: 'none' }} />
      ))}
      <div className="relative bg-white rounded-3xl px-8 py-10 mx-5 text-center shadow-2xl w-full max-w-sm" style={{ animation: 'matchCardIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center shadow-md flex-shrink-0">
            <User className="w-10 h-10 text-gray-300" />
          </div>
          <Heart className="w-9 h-9 fill-[#A84060] flex-shrink-0" style={{ color: '#A84060', animation: 'heartPulse 0.8s ease-in-out infinite' }} />
          <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${profile.color} flex items-center justify-center text-3xl shadow-md flex-shrink-0`}>
            {profile.emoji}
          </div>
        </div>
        <p className="text-2xl font-black text-gray-900 mb-1">マッチしました！</p>
        <p className="text-sm text-gray-500 mb-2">{profile.name}さんとマッチングが成立しました 🎉</p>
        <p className="text-xs text-gray-400 mb-8">共通の趣味や話題で盛り上がりましょう</p>
        <button onClick={onMessage} className="w-full py-4 rounded-2xl text-white font-bold text-base shadow-sm mb-3" style={{ background: 'linear-gradient(135deg, #A84060, #7E2841)' }}>
          メッセージを送る
        </button>
        <button onClick={onClose} className="w-full py-2 text-sm text-gray-400">あとで</button>
      </div>
    </div>
  )
}
