'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, CheckCircle, Lock, User, Heart } from 'lucide-react'
import {
  MALE_CANDIDATES,
  MALE_LIKED_ME_IDS,
  MATCH_ID_BY_MALE_PROFILE_ID,
} from '@/lib/female-demo-data'
import type { DemoProfile } from '@/lib/demo-data'
import { channel } from '@/lib/channel'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'

const CONFETTI_COLORS = ['#A84060', '#F8A4C0', '#FFD700', '#FF6B6B', '#4ECDC4', '#A8E6CF', '#FFEAA7', '#DDA0DD']

const LIKED_ME_PROFILES = MALE_CANDIDATES.filter(p => MALE_LIKED_ME_IDS.has(p.id))
const PAST_LIKED_ME = MALE_CANDIDATES.filter(p => !MALE_LIKED_ME_IDS.has(p.id)).slice(0, 4)

function getFemLikedIds(): string[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem('female_liked_ids') ?? '[]') } catch { return [] }
}

export default function FemaleMatchesPage() {
  const router = useRouter()
  const [matchedProfile, setMatchedProfile] = useState<DemoProfile | null>(null)
  const [matchId, setMatchId] = useState('')
  const [likedBack, setLikedBack] = useState<Set<string>>(new Set())
  const [liveLikedBy, setLiveLikedBy] = useState<string[]>([])

  useEffect(() => {
    const ids = getFemLikedIds()
    setLikedBack(new Set(ids))
  }, [])

  useEffect(() => {
    return channel.on(ev => {
      if (ev.type === 'like_sent') {
        const p = MALE_CANDIDATES.find(c => c.id === ev.profileId)
        if (p && !MALE_LIKED_ME_IDS.has(p.id)) {
          setLiveLikedBy(prev => prev.includes(ev.profileId) ? prev : [...prev, ev.profileId])
        }
      }
    })
  }, [])

  const handleLikeBack = (profile: DemoProfile) => {
    const mid = MATCH_ID_BY_MALE_PROFILE_ID[profile.id] ?? `fmatch-${profile.id}`
    const next = new Set([...likedBack, profile.id])
    setLikedBack(next)
    try {
      localStorage.setItem('female_liked_ids', JSON.stringify([...next]))
      const existing = JSON.parse(localStorage.getItem('female_matches') ?? '[]')
      if (!existing.find((m: { matchId: string }) => m.matchId === mid)) {
        existing.push({ matchId: mid, userId: profile.user_id, matchedAt: new Date().toISOString() })
        localStorage.setItem('female_matches', JSON.stringify(existing))
      }
    } catch {}
    setMatchId(mid)
    setMatchedProfile(profile)
  }

  const liveProfiles = liveLikedBy.map(id => MALE_CANDIDATES.find(p => p.id === id)).filter(Boolean) as DemoProfile[]
  const newLikes = [...LIKED_ME_PROFILES, ...liveProfiles]

  return (
    <div className="min-h-screen">
      <div className="bg-white px-4 pt-10 pb-4 sticky top-0 z-20 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">いいね！</h1>
        <p className="text-sm mt-0.5" style={{ color: '#A84060' }}>
          新しくもらったいいね！：{newLikes.length}
        </p>
      </div>

      <div className="mx-4 mt-4 rounded-2xl p-3 flex items-center justify-between" style={{ background: '#F5E6EA' }}>
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4" style={{ color: '#A84060' }} />
          <p className="text-sm font-medium" style={{ color: '#A84060' }}>
            女性は全員のお相手を無料で閲覧できます
          </p>
        </div>
        <span className="text-xs text-white font-bold px-2.5 py-1 rounded-full" style={{ background: '#A84060' }}>
          無料
        </span>
      </div>

      <div className="px-4 mt-4">
        <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">新着</p>
        {newLikes.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <p className="text-2xl mb-2">💌</p>
            <p className="text-sm text-gray-400">まだいいね！がありません</p>
            <p className="text-xs text-gray-300 mt-1">男性タブでいいね！すると届きます</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {newLikes.map(profile => (
              <LikeCard
                key={profile.id}
                profile={profile}
                likedAt={new Date(Date.now() - 1000 * 60 * 30).toISOString()}
                isBlurred={false}
                liked={likedBack.has(profile.id)}
                onLikeBack={handleLikeBack}
              />
            ))}
          </div>
        )}
      </div>

      {PAST_LIKED_ME.length > 0 && (
        <div className="px-4 mt-6">
          <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">過去のいいね！</p>
          <div className="grid grid-cols-2 gap-3">
            {PAST_LIKED_ME.map(profile => (
              <LikeCard
                key={profile.id}
                profile={profile}
                likedAt={new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString()}
                isBlurred={true}
                liked={false}
                onLikeBack={() => {}}
              />
            ))}
          </div>
        </div>
      )}

      <div className="h-6" />

      {matchedProfile && (
        <MatchPopup
          profile={matchedProfile}
          matchId={matchId}
          onClose={() => setMatchedProfile(null)}
          onMessage={() => { setMatchedProfile(null); router.push(`/demo-female/chat/${matchId}`) }}
        />
      )}

      <style>{`
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

function LikeCard({ profile, likedAt, isBlurred, liked, onLikeBack }: {
  profile: DemoProfile
  likedAt: string
  isBlurred: boolean
  liked: boolean
  onLikeBack: (p: DemoProfile) => void
}) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      <div className="relative" style={{ aspectRatio: '3/4', filter: isBlurred ? 'blur(8px)' : 'none' }}>
        <div className={`w-full h-full bg-gradient-to-br ${profile.color} flex items-center justify-center text-5xl`}>
          {isBlurred ? '❓' : profile.emoji}
        </div>
        <div className="absolute bottom-2 right-2 bg-black/40 text-white text-[11px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
          <Camera className="w-3 h-3" />
          <span>{profile.photoCount}</span>
        </div>
      </div>
      <div className="px-2.5 py-2">
        <div className="flex items-center gap-1 mb-0.5">
          {profile.isOnline && !isBlurred && <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />}
          <span className="text-[13px] font-semibold text-gray-800 truncate">
            {profile.age}歳 {profile.location.replace(/[都府県]$/, '')}
          </span>
          {profile.isVerified && !isBlurred && <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 text-blue-500" />}
        </div>
        <p className="text-[11px] text-gray-400 mb-2">{profile.height}cm {profile.occupation}</p>
        {isBlurred ? (
          <div className="w-full text-center text-[11px] font-medium py-1.5 rounded-lg flex items-center justify-center gap-1" style={{ background: '#F5E6EA', color: '#A84060' }}>
            <Lock className="w-3 h-3" />
            見る
          </div>
        ) : liked ? (
          <div className="w-full text-center text-[11px] font-bold py-1.5 rounded-lg" style={{ background: '#A84060', color: 'white' }}>
            ❤️ いいね済み
          </div>
        ) : (
          <div className="flex items-center justify-between gap-1">
            <button
              onClick={() => onLikeBack(profile)}
              className="flex-1 flex items-center justify-center gap-1 text-[11px] font-bold px-2 py-1.5 rounded-lg transition active:scale-95"
              style={{ background: '#F5E6EA', color: '#A84060' }}
            >
              <Heart className="w-3 h-3 fill-[#A84060]" style={{ color: '#A84060' }} />
              いいね！
            </button>
            <span className="text-[10px] text-gray-400 flex-shrink-0">
              {formatDistanceToNow(new Date(likedAt), { addSuffix: true, locale: ja })}
            </span>
          </div>
        )}
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
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center shadow-md">
            <User className="w-10 h-10 text-gray-300" />
          </div>
          <Heart className="w-9 h-9 fill-[#A84060]" style={{ color: '#A84060', animation: 'heartPulse 0.8s ease-in-out infinite' }} />
          <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${profile.color} flex items-center justify-center text-3xl shadow-md`}>
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
