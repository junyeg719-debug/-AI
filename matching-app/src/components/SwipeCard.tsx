'use client'

import { useState, useRef } from 'react'
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { MapPin, Briefcase, X, Heart, Info } from 'lucide-react'
import type { Profile } from '@/types/database'

interface SwipeCardProps {
  profile: Profile
  onSwipe: (direction: 'like' | 'pass') => void
  isTop: boolean
}

export default function SwipeCard({ profile, onSwipe, isTop }: SwipeCardProps) {
  const [showInfo, setShowInfo] = useState(false)
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-25, 25])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])
  const likeOpacity = useTransform(x, [0, 50, 150], [0, 1, 1])
  const passOpacity = useTransform(x, [-150, -50, 0], [1, 1, 0])

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 100) {
      onSwipe('like')
    } else if (info.offset.x < -100) {
      onSwipe('pass')
    }
  }

  const avatarInitial = profile.name.charAt(0)
  const gradient = getGradient(profile.id)

  return (
    <motion.div
      style={{ x, rotate, opacity }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className={`absolute inset-0 cursor-grab active:cursor-grabbing select-none ${
        isTop ? 'z-10' : 'z-0'
      }`}
      whileTap={{ scale: 1.02 }}
    >
      <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-white">
        {/* Photo / Avatar */}
        <div className={`relative w-full bg-gradient-to-br ${gradient}`} style={{ height: showInfo ? '35%' : '65%' }}>
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.name}
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-white text-8xl font-bold opacity-80">
                {avatarInitial}
              </span>
            </div>
          )}

          {/* Like / Pass indicators */}
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute top-6 left-6 bg-rose-500 text-white px-4 py-2 rounded-xl font-bold text-xl rotate-[-15deg] border-2 border-white shadow"
          >
            LIKE
          </motion.div>
          <motion.div
            style={{ opacity: passOpacity }}
            className="absolute top-6 right-6 bg-gray-600 text-white px-4 py-2 rounded-xl font-bold text-xl rotate-[15deg] border-2 border-white shadow"
          >
            PASS
          </motion.div>

          {/* Info toggle */}
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); setShowInfo(!showInfo) }}
            className="absolute bottom-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow"
          >
            <Info className="w-4 h-4 text-gray-700" />
          </button>
        </div>

        {/* Info Panel */}
        <div className="p-5 flex flex-col gap-2">
          <div className="flex items-end gap-2">
            <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
            <span className="text-lg text-gray-500 font-medium">{profile.age}歳</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-500">
            {profile.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {profile.location}
              </span>
            )}
            {profile.occupation && (
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5" /> {profile.occupation}
              </span>
            )}
          </div>

          {showInfo && (
            <div className="mt-1 space-y-2">
              {profile.bio && (
                <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">{profile.bio}</p>
              )}
              {profile.interests.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {profile.interests.slice(0, 6).map((i) => (
                    <span key={i} className="px-2 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-medium">
                      {i}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export function SwipeButtons({
  onPass,
  onLike,
}: {
  onPass: () => void
  onLike: () => void
}) {
  return (
    <div className="flex items-center justify-center gap-8">
      <button
        onClick={onPass}
        className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition border border-gray-100"
      >
        <X className="w-7 h-7 text-gray-400" />
      </button>
      <button
        onClick={onLike}
        className="w-20 h-20 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center shadow-xl shadow-rose-200 hover:scale-110 active:scale-95 transition"
      >
        <Heart className="w-9 h-9 text-white fill-white" />
      </button>
    </div>
  )
}

function getGradient(id: string) {
  const gradients = [
    'from-rose-400 to-pink-500',
    'from-violet-400 to-purple-500',
    'from-sky-400 to-blue-500',
    'from-emerald-400 to-teal-500',
    'from-amber-400 to-orange-500',
    'from-fuchsia-400 to-pink-500',
  ]
  const index = id.charCodeAt(0) % gradients.length
  return gradients[index]
}
