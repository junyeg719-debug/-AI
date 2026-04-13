'use client'

import { useState, useCallback } from 'react'
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { Heart, X, Info, MapPin, Briefcase } from 'lucide-react'
import { CANDIDATE_PROFILES, type DemoProfile } from '@/lib/demo-data'

export default function DemoDiscoverPage() {
  const [profiles, setProfiles] = useState<DemoProfile[]>(CANDIDATE_PROFILES)
  const [matchedProfile, setMatchedProfile] = useState<DemoProfile | null>(null)
  const [passedCount, setPassedCount] = useState(0)
  const [likedCount, setLikedCount] = useState(0)

  const handleSwipe = useCallback((direction: 'like' | 'pass') => {
    if (profiles.length === 0) return
    const target = profiles[0]

    if (direction === 'like') {
      setLikedCount((c) => c + 1)
      // 3人目にLikeしたときマッチ演出
      if (likedCount === 1) {
        setMatchedProfile(target)
        setTimeout(() => setMatchedProfile(null), 2500)
      }
    } else {
      setPassedCount((c) => c + 1)
    }

    setProfiles((prev) => prev.slice(1))
  }, [profiles, likedCount])

  const refillProfiles = () => {
    setProfiles(CANDIDATE_PROFILES)
    setLikedCount(0)
    setPassedCount(0)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 pt-10 pb-4 shadow-sm flex items-center justify-center gap-2">
        <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
        <h1 className="text-xl font-bold text-gray-900">Hana</h1>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-center gap-6 py-2 text-sm">
        <span className="text-gray-400">❤️ {likedCount}件いいね</span>
        <span className="text-gray-400">✕ {passedCount}件スキップ</span>
      </div>

      {/* Card Stack */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-2">
        {profiles.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">全員チェックしました！</h3>
            <p className="text-gray-400 text-sm mb-6">いいねした{likedCount}人からの返事を待ちましょう</p>
            <button
              onClick={refillProfiles}
              className="px-6 py-2.5 bg-gradient-to-r from-rose-400 to-pink-500 text-white font-semibold rounded-xl hover:opacity-90 transition shadow-lg shadow-rose-200"
            >
              もう一度見る（デモ）
            </button>
          </div>
        ) : (
          <div
            className="relative w-full"
            style={{ height: 'calc(100vh - 280px)', maxHeight: '500px' }}
          >
            {profiles.slice(0, 3).map((profile, index) => (
              <div
                key={profile.id}
                className="absolute inset-0 transition-transform"
                style={{
                  transform: `scale(${1 - index * 0.03}) translateY(${index * 8}px)`,
                  zIndex: 10 - index,
                }}
              >
                <SwipeCard profile={profile} onSwipe={handleSwipe} isTop={index === 0} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Buttons */}
      {profiles.length > 0 && (
        <div className="pb-24 pt-2 flex items-center justify-center gap-8">
          <button
            onClick={() => handleSwipe('pass')}
            className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition border border-gray-100"
          >
            <X className="w-7 h-7 text-gray-400" />
          </button>
          <button
            onClick={() => handleSwipe('like')}
            className="w-20 h-20 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center shadow-xl shadow-rose-200 hover:scale-110 active:scale-95 transition"
          >
            <Heart className="w-9 h-9 text-white fill-white" />
          </button>
        </div>
      )}

      {/* Match animation */}
      {matchedProfile && (
        <div className="fixed inset-0 bg-gradient-to-br from-rose-400/90 to-pink-600/90 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="text-center">
            <div className="text-8xl mb-4 animate-bounce">{matchedProfile.emoji}</div>
            <div className="text-6xl mb-4">💕</div>
            <h2 className="text-4xl font-bold text-white mb-2">マッチ成立!</h2>
            <p className="text-white/90 text-xl font-medium">{matchedProfile.name}さんと</p>
            <p className="text-white/70 mt-2">メッセージを送ってみよう</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================
// SwipeCard (デモ内蔵版)
// ============================
function SwipeCard({
  profile,
  onSwipe,
  isTop,
}: {
  profile: DemoProfile
  onSwipe: (d: 'like' | 'pass') => void
  isTop: boolean
}) {
  const [showInfo, setShowInfo] = useState(false)
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-20, 20])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])
  const likeOp = useTransform(x, [0, 50, 130], [0, 1, 1])
  const passOp = useTransform(x, [-130, -50, 0], [1, 1, 0])

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 100) onSwipe('like')
    else if (info.offset.x < -100) onSwipe('pass')
  }

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className={`absolute inset-0 cursor-grab active:cursor-grabbing select-none ${isTop ? 'z-10' : 'z-0'}`}
      whileTap={{ scale: 1.02 }}
    >
      <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-white">
        {/* Photo area */}
        <div
          className={`relative w-full bg-gradient-to-br ${profile.color} flex items-center justify-center`}
          style={{ height: showInfo ? '40%' : '62%' }}
        >
          <span className="text-8xl">{profile.emoji}</span>

          <motion.div style={{ opacity: likeOp }} className="absolute top-5 left-5 bg-rose-500 text-white px-4 py-2 rounded-xl font-bold text-xl rotate-[-15deg] border-2 border-white shadow">
            LIKE
          </motion.div>
          <motion.div style={{ opacity: passOp }} className="absolute top-5 right-5 bg-gray-600 text-white px-4 py-2 rounded-xl font-bold text-xl rotate-[15deg] border-2 border-white shadow">
            PASS
          </motion.div>

          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); setShowInfo(!showInfo) }}
            className="absolute bottom-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow"
          >
            <Info className="w-4 h-4 text-gray-700" />
          </button>
        </div>

        {/* Info */}
        <div className="p-5">
          <div className="flex items-end gap-2 mb-1">
            <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
            <span className="text-lg text-gray-500 font-medium">{profile.age}歳</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{profile.location}</span>
            <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{profile.occupation}</span>
          </div>

          {showInfo && (
            <div className="mt-3 space-y-2">
              <p className="text-gray-700 text-sm leading-relaxed">{profile.bio}</p>
              <div className="flex flex-wrap gap-1.5">
                {profile.interests.slice(0, 5).map((i) => (
                  <span key={i} className="px-2 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-medium">{i}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
