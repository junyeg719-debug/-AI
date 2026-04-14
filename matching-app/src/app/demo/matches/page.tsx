'use client'

import { useState } from 'react'
import { Camera, CheckCircle, Lock } from 'lucide-react'
import { LIKES_RECEIVED, type DemoProfile } from '@/lib/demo-data'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'

export default function DemoLikesPage() {
  const newLikes = LIKES_RECEIVED.filter((l) => l.isNew)
  const pastLikes = LIKES_RECEIVED.filter((l) => !l.isNew)

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
            <LikeCard key={profile.id} profile={profile} likedAt={likedAt} isBlurred={false} />
          ))}
        </div>
      </div>

      {/* Past likes (blurred) */}
      {pastLikes.length > 0 && (
        <div className="px-4 mt-6">
          <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">過去のいいね！</p>
          <div className="grid grid-cols-2 gap-3">
            {pastLikes.map(({ profile, likedAt }) => (
              <LikeCard key={profile.id} profile={profile} likedAt={likedAt} isBlurred={true} />
            ))}
          </div>
        </div>
      )}

      <div className="h-6" />
    </div>
  )
}

function LikeCard({
  profile,
  likedAt,
  isBlurred,
}: {
  profile: DemoProfile
  likedAt: string
  isBlurred: boolean
}) {
  const [liked, setLiked] = useState(false)

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      {/* Photo */}
      <div
        className={`relative bg-gradient-to-br ${profile.color} flex items-center justify-center`}
        style={{ aspectRatio: '3/4', filter: isBlurred ? 'blur(8px)' : 'none' }}
      >
        <span className="text-6xl">{profile.emoji}</span>
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

        {/* Like back / time */}
        {isBlurred ? (
          <div
            className="w-full text-center text-[11px] font-medium py-1.5 rounded-lg"
            style={{ background: '#F5E6EA', color: '#7E2841' }}
          >
            <Lock className="w-3 h-3 inline mr-1" />
            解除して見る
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <button
              onClick={() => setLiked((v) => !v)}
              className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition"
              style={{
                background: liked ? '#7E2841' : '#F5E6EA',
                color: liked ? '#fff' : '#7E2841',
              }}
            >
              👍 {liked ? 'いいね済み' : 'いいね！'}
            </button>
            <span className="text-[10px] text-gray-400">
              {formatDistanceToNow(new Date(likedAt), { addSuffix: true, locale: ja })}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
