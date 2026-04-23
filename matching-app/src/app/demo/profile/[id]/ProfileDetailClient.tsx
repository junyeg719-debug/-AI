'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, MoreHorizontal, User, CheckCircle, ThumbsUp, Undo2, X, Send } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type DemoProfile, LIKED_ME_PROFILE_IDS, MATCH_ID_BY_PROFILE_ID } from '@/lib/demo-data'
import { useLikes } from '@/lib/likes-context'
import { storage } from '@/lib/storage'

const CONFETTI_COLORS = ['#7E2841', '#F8A4C0', '#FFD700', '#FF6B6B', '#4ECDC4', '#A8E6CF', '#FFEAA7', '#DDA0DD']

export default function ProfileDetailClient({ profile }: { profile: DemoProfile }) {
  const router = useRouter()
  const { decrement } = useLikes()
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    if (storage.getLikedIds().includes(profile.id)) setLiked(true)
  }, [profile.id])
  const [showStickyHeader, setShowStickyHeader] = useState(false)
  const [showCommentModal, setShowCommentModal] = useState(false)
  const [comment, setComment] = useState('')
  const [matchedProfile, setMatchedProfile] = useState<DemoProfile | null>(null)
  const [matchId, setMatchId] = useState('')
  const heroRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      const heroBottom = heroRef.current?.getBoundingClientRect().bottom ?? 0
      setShowStickyHeader(heroBottom < 50)
    }
    el.addEventListener('scroll', onScroll)
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  const triggerMatch = () => {
    const mid = MATCH_ID_BY_PROFILE_ID[profile.id] ?? 'match-006'
    setMatchId(mid)
    setMatchedProfile(profile)
    storage.addMatch(mid, profile.user_id)
  }

  const handleLike = () => {
    if (liked) return
    setLiked(true)
    decrement()
    storage.addLikedId(profile.id)
    if (LIKED_ME_PROFILE_IDS.has(profile.id)) {
      triggerMatch()
    }
  }

  const handleSendComment = () => {
    setShowCommentModal(false)
    setComment('')
    if (!liked) {
      setLiked(true)
      decrement()
      storage.addLikedId(profile.id)
      if (LIKED_ME_PROFILE_IDS.has(profile.id)) {
        triggerMatch()
      }
    }
  }

  const FIELDS: [string, string][] = [
    ['身長', profile.height ? `${profile.height}cm` : '−'],
    ['体型', profile.bodyType || '−'],
    ['タバコ', profile.smoking || '−'],
    ['お酒', profile.drinking || '−'],
    ['休日', profile.holiday || '−'],
    ['職業', profile.occupation || '−'],
  ].filter(([, v]) => v !== '−') as [string, string][]

  return (
    <>
      <div ref={scrollRef} className="fixed inset-0 z-[100] bg-white overflow-y-auto pb-28">

        {/* Sticky header (scrolled) */}
        {showStickyHeader && (
          <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 pt-10 pb-3 flex items-center gap-3">
            <Link href="/demo/discover" className="p-1">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </Link>
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
              {profile.avatar_url
                ? <img src={profile.avatar_url} className="w-full h-full object-cover" alt="" />
                : <User className="w-5 h-5 text-gray-400" />
              }
            </div>
            <span className="font-bold text-gray-900 flex-1">{profile.name}</span>
            <button className="p-1"><MoreHorizontal className="w-5 h-5 text-gray-500" /></button>
          </div>
        )}

        {/* Hero photo */}
        <div ref={heroRef} className="relative bg-gray-200" style={{ aspectRatio: '3/4' }}>
          {profile.avatar_url
            ? <img src={profile.avatar_url} className="w-full h-full object-cover" alt="" />
            : <div className="w-full h-full flex items-center justify-center">
                <User className="w-32 h-32 text-gray-300" />
              </div>
          }
          <Link href="/demo/discover" className="absolute top-12 left-4 w-9 h-9 bg-black/30 rounded-full flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <button className="absolute top-12 right-4 w-9 h-9 bg-black/30 rounded-full flex items-center justify-center">
            <MoreHorizontal className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Name & like count */}
        <div className="px-4 pb-3 pt-4 bg-white">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
            <span className="text-lg text-gray-500">
              {profile.age}歳 / {profile.location.replace(/[都府県]$/, '')}
            </span>
            {profile.isVerified && <CheckCircle className="w-5 h-5 text-blue-500" />}
          </div>
          <p className="mt-1.5 text-sm text-gray-400">
            👍 {liked ? profile.likeCount + 1 : profile.likeCount}いいね！
          </p>
        </div>

        {/* Interest tags */}
        <div className="px-4 pb-5 bg-white flex flex-wrap gap-2">
          {profile.interests.map(tag => (
            <span key={tag} className="px-3 py-1.5 rounded-full border border-gray-300 text-sm text-gray-700">
              {tag}
            </span>
          ))}
        </div>

        {/* Bio */}
        <div className="border-t border-gray-100 mt-1">
          <div className="px-4 py-3" style={{ background: '#F9F9F9' }}>
            <h2 className="text-sm font-bold text-gray-700">自己紹介文</h2>
          </div>
          <div className="px-4 py-4 bg-white">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{profile.bio}</p>
          </div>
        </div>

        {/* Profile fields */}
        <div className="border-t border-gray-100 mt-1">
          <div className="px-4 py-3" style={{ background: '#F9F9F9' }}>
            <h2 className="text-sm font-bold text-gray-700">外見・内面</h2>
          </div>
          <div className="bg-white divide-y divide-gray-50">
            {FIELDS.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-gray-400">{label}</span>
                <span className="text-sm text-gray-800">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-[110] bg-white border-t border-gray-100 px-10 py-5 flex items-center justify-around">
        {/* Skip */}
        <div className="flex flex-col items-center gap-1">
          <Link
            href="/demo/discover"
            className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition"
          >
            <Undo2 className="w-6 h-6 text-gray-400" />
          </Link>
          <span className="text-[10px] text-gray-400">スキップ</span>
        </div>

        {/* Comment like */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => setShowCommentModal(true)}
            className="w-16 h-16 rounded-full flex items-center justify-center active:scale-95 transition shadow-md"
            style={{ background: liked ? '#5BC0C0' : '#5BC0C0' }}
          >
            <div className="relative">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path d="M4 6a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H10l-6 4V6Z" fill="white" fillOpacity="0.25" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M10 13h10M10 18h6" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <ThumbsUp className="absolute -bottom-1 -right-1.5 w-4 h-4 text-white fill-white" />
            </div>
          </button>
          <span className="text-[10px] text-gray-400">コメント付き</span>
        </div>

        {/* Like */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={handleLike}
            disabled={liked}
            className="w-16 h-16 rounded-full flex items-center justify-center active:scale-95 transition shadow-md disabled:opacity-60"
            style={{ background: liked ? '#7E2841' : '#5BC0C0' }}
          >
            <ThumbsUp className="w-7 h-7 text-white fill-white" />
          </button>
          <span className="text-[10px] text-gray-400">{liked ? 'いいね済み' : 'いいね！'}</span>
        </div>
      </div>

      {/* Comment modal */}
      {showCommentModal && (
        <div className="fixed inset-0 z-[150] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCommentModal(false)} />
          <div className="relative bg-white w-full rounded-t-3xl px-5 pt-5 pb-8 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                  {profile.avatar_url
                    ? <img src={profile.avatar_url} className="w-full h-full object-cover" alt="" />
                    : <User className="w-6 h-6 text-gray-300" />
                  }
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{profile.name}</p>
                  <p className="text-xs text-gray-400">{profile.age}歳 · {profile.location.replace(/[都府県]$/, '')}</p>
                </div>
              </div>
              <button onClick={() => setShowCommentModal(false)} className="p-1.5 rounded-full bg-gray-100">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-3 text-center">
              コメントを添えていいね！を送ると印象が高まります ✨
            </p>
            <textarea
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 resize-none focus:outline-none focus:border-[#5BC0C0]"
              rows={4}
              maxLength={200}
              placeholder={`${profile.name}さんへのメッセージを書いてください…`}
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
            <div className="flex items-center justify-between mt-1 mb-4">
              <span className="text-xs text-gray-300">{comment.length}/200</span>
            </div>
            <button
              onClick={handleSendComment}
              className="w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition"
              style={{ background: 'linear-gradient(135deg, #5BC0C0, #3AADAD)' }}
            >
              <Send className="w-4 h-4" />
              コメント付きいいね！を送る
            </button>
          </div>
        </div>
      )}

      {/* Match popup */}
      {matchedProfile && (
        <MatchPopup
          profile={matchedProfile}
          matchId={matchId}
          onClose={() => setMatchedProfile(null)}
          onChat={() => { setMatchedProfile(null); router.push(`/demo/chat/${matchId}`) }}
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
    </>
  )
}

function MatchPopup({
  profile,
  matchId,
  onClose,
  onChat,
}: {
  profile: DemoProfile
  matchId: string
  onClose: () => void
  onChat: () => void
}) {
  const pieces = Array.from({ length: 36 }, (_, i) => i)

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-black/75" />

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

      <div
        className="relative bg-white rounded-3xl px-8 py-10 mx-5 text-center shadow-2xl w-full max-w-sm"
        style={{ animation: 'matchCardIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="rounded-full bg-gray-200 overflow-hidden flex items-center justify-center shadow-md flex-shrink-0" style={{ width: 72, height: 72 }}>
            <User className="w-10 h-10 text-gray-400" />
          </div>
          <svg width="36" height="36" viewBox="0 0 36 36" style={{ animation: 'heartPulse 0.8s ease-in-out infinite', flexShrink: 0 }}>
            <path d="M18 32s-14-9-14-19a8 8 0 0 1 14-5.3A8 8 0 0 1 32 13c0 10-14 19-14 19Z" fill="#7E2841"/>
          </svg>
          <div className="rounded-full bg-gray-200 overflow-hidden flex items-center justify-center shadow-md flex-shrink-0" style={{ width: 72, height: 72 }}>
            {profile.avatar_url
              ? <img src={profile.avatar_url} className="w-full h-full object-cover" alt="" />
              : <User className="w-10 h-10 text-gray-400" />
            }
          </div>
        </div>

        <p className="text-2xl font-black text-gray-900 mb-1">マッチしました！</p>
        <p className="text-sm text-gray-500 mb-2">{profile.name}さんとマッチングが成立しました 🎉</p>
        <p className="text-xs text-gray-400 mb-8">共通の趣味や話題で盛り上がりましょう</p>

        <button
          onClick={onChat}
          className="w-full py-4 rounded-2xl text-white font-bold text-base shadow-sm mb-3"
          style={{ background: 'linear-gradient(135deg, #7E2841, #A03558)' }}
        >
          メッセージを送る
        </button>
        <button onClick={onClose} className="w-full py-2 text-sm text-gray-400">あとで</button>
      </div>
    </div>
  )
}
