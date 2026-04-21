'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, CheckCircle, Lock, User, Heart } from 'lucide-react'
import { LIKES_RECEIVED, MATCH_ID_BY_PROFILE_ID, type DemoProfile } from '@/lib/demo-data'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'

const CONFETTI_COLORS = ['#7E2841', '#F8A4C0', '#FFD700', '#FF6B6B', '#4ECDC4', '#A8E6CF', '#FFEAA7', '#DDA0DD']

export default function DemoLikesPage() {
  const [matchedProfile, setMatchedProfile] = useState<DemoProfile | null>(null)
  const [matchId, setMatchId] = useState('')

  const newLikes = LIKES_RECEIVED.filter(l => l.isNew)
  const pastLikes = LIKES_RECEIVED.filter(l => !l.isNew)

  const handleLikeBack = (profile: DemoProfile) => {
    const mid = MATCH_ID_BY_PROFILE_ID[profile.id] ?? 'match-006'
    setMatchId(mid)
    setMatchedProfile(profile)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white px-4 pt-10 pb-4 sticky top-0 z-20 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">いいね！</h1>
        <p className="text-sm mt-0.5" style={{ color: '#7E2841' }}>
          新しくもらったいいね！：{newLikes.length}
        </p>
      </div>

      {/* Premium banner */}
      <div
        className="mx-4 mt-4 rounded-2xl p-3 flex items-center justify-between"
        style={{ background: '#F5E6EA' }}
      >
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4" style={{ color: '#7E2841' }} />
          <p className="text-sm font-medium" style={{ color: '#7E2841' }}>
            プレミアムパック登録でお相手を閲覧できます
          </p>
        </div>
        <button
          className="text-xs text-white font-bold px-3 py-1.5 rounded-full flex-shrink-0"
          style={{ background: '#7E2841' }}
        >
          詳細
        </button>
      </div>

      {/* New likes */}
      <div className="px-4 mt-4">
        <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">新着</p>
        <div className="grid grid-cols-2 gap-3">
          {newLikes.map(({ profile, likedAt }) => (
            <LikeCard
              key={profile.id}
              profile={profile}
              likedAt={likedAt}
              isBlurred={false}
              onLikeBack={handleLikeBack}
            />
          ))}
        </div>
      </div>

      {/* Past likes (blurred) */}
      {pastLikes.length > 0 && (
        <div className="px-4 mt-6">
          <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">過去のいいね！</p>
          <div className="grid grid-cols-2 gap-3">
            {pastLikes.map(({ profile, likedAt }) => (
              <LikeCard
                key={profile.id}
                profile={profile}
                likedAt={likedAt}
                isBlurred={true}
                onLikeBack={handleLikeBack}
              />
            ))}
          </div>
        </div>
      )}

      <div className="h-6" />

      {/* Match popup */}
      {matchedProfile && (
        <MatchPopup
          profile={matchedProfile}
          matchId={matchId}
          onClose={() => setMatchedProfile(null)}
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

// ── Like Card ──────────────────────────────────
function LikeCard({
  profile,
  likedAt,
  isBlurred,
  onLikeBack,
}: {
  profile: DemoProfile
  likedAt: string
  isBlurred: boolean
  onLikeBack: (profile: DemoProfile) => void
}) {
  const [liked, setLiked] = useState(false)

  const handleLike = () => {
    setLiked(true)
    onLikeBack(profile)
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      {/* Photo */}
      <div
        className="relative bg-gray-200 flex items-center justify-center overflow-hidden"
        style={{ aspectRatio: '3/4', filter: isBlurred ? 'blur(8px)' : 'none' }}
      >
        {profile.avatar_url
          ? <img src={profile.avatar_url} className="w-full h-full object-cover absolute inset-0" alt="" />
          : <User className="w-20 h-20 text-gray-400" />
        }
        <div className="absolute bottom-2 right-2 bg-black/40 text-white text-[11px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
          <Camera className="w-3 h-3" />
          <span>{profile.photoCount}</span>
        </div>
      </div>

      {/* Info */}
      <div className="px-2.5 py-2">
        <div className="flex items-center gap-1 mb-0.5">
          {profile.isOnline && !isBlurred && (
            <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
          )}
          <span className="text-[13px] font-semibold text-gray-800 truncate">
            {profile.age}歳{' '}
            {profile.location.replace('府', '').replace('県', '').replace('都', '')}
          </span>
          {profile.isVerified && !isBlurred && (
            <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 text-blue-500" />
          )}
        </div>
        <p className="text-[11px] text-gray-400 mb-2">
          {profile.height}cm {profile.occupation}
        </p>

        {isBlurred ? (
          <div
            className="w-full text-center text-[11px] font-medium py-1.5 rounded-lg flex items-center justify-center gap-1"
            style={{ background: '#F5E6EA', color: '#7E2841' }}
          >
            <Lock className="w-3 h-3" />
            解除して見る
          </div>
        ) : liked ? (
          <div
            className="w-full text-center text-[11px] font-bold py-1.5 rounded-lg"
            style={{ background: '#7E2841', color: 'white' }}
          >
            ❤️ いいね済み
          </div>
        ) : (
          <div className="flex items-center justify-between gap-1">
            <button
              onClick={handleLike}
              className="flex-1 flex items-center justify-center gap-1 text-[11px] font-bold px-2 py-1.5 rounded-lg transition active:scale-95"
              style={{ background: '#F5E6EA', color: '#7E2841' }}
            >
              <Heart className="w-3 h-3 fill-[#7E2841]" style={{ color: '#7E2841' }} />
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

// ── Match Popup ────────────────────────────────
function MatchPopup({
  profile,
  matchId,
  onClose,
}: {
  profile: DemoProfile
  matchId: string
  onClose: () => void
}) {
  const router = useRouter()
  const pieces = Array.from({ length: 36 }, (_, i) => i)

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-black/75" />

      {/* Confetti */}
      {pieces.map(i => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${(i * 11 + 5) % 100}%`,
            top: '-40px',
            width: `${7 + (i % 4) * 3}px`,
            height: `${7 + (i % 4) * 3}px`,
            background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
            borderRadius: i % 3 !== 0 ? '50%' : '3px',
            animation: `confettiFall ${2 + (i % 5) * 0.35}s ${(i * 0.11) % 2.2}s ease-in forwards`,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Card */}
      <div
        className="relative bg-white rounded-3xl px-8 py-10 mx-5 text-center shadow-2xl w-full max-w-sm"
        style={{ animation: 'matchCardIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        {/* Avatars */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div
            className="rounded-full bg-gray-200 overflow-hidden flex items-center justify-center shadow-md flex-shrink-0"
            style={{ width: 72, height: 72 }}
          >
            <User className="w-10 h-10 text-gray-400" />
          </div>
          <Heart
            className="w-9 h-9 fill-[#7E2841] flex-shrink-0"
            style={{ color: '#7E2841', animation: 'heartPulse 0.8s ease-in-out infinite' }}
          />
          <div
            className="rounded-full bg-gray-200 overflow-hidden flex items-center justify-center shadow-md flex-shrink-0"
            style={{ width: 72, height: 72 }}
          >
            {profile.avatar_url
              ? <img src={profile.avatar_url} className="w-full h-full object-cover" alt="" />
              : <User className="w-10 h-10 text-gray-400" />
            }
          </div>
        </div>

        <p className="text-2xl font-black text-gray-900 mb-1">マッチしました！</p>
        <p className="text-sm text-gray-500 mb-2">
          {profile.name}さんとマッチングが成立しました 🎉
        </p>
        <p className="text-xs text-gray-400 mb-8">
          共通の趣味や話題で盛り上がりましょう
        </p>

        <button
          onClick={() => { onClose(); router.push(`/demo/chat/${matchId}`) }}
          className="w-full py-4 rounded-2xl text-white font-bold text-base shadow-sm mb-3"
          style={{ background: 'linear-gradient(135deg, #7E2841, #A03558)' }}
        >
          メッセージを送る
        </button>
        <button onClick={onClose} className="w-full py-2 text-sm text-gray-400">
          あとで
        </button>
      </div>
    </div>
  )
}
