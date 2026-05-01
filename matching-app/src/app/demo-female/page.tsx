'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, MessageCircle, User, Sparkles } from 'lucide-react'
import { storage } from '@/lib/storage'
import { channel } from '@/lib/channel'
import { DEMO_USER, CANDIDATE_PROFILES } from '@/lib/demo-data'

const FEMALE = CANDIDATE_PROFILES.find(p => p.id === 'profile-001')!
const MALE = DEMO_USER
export const DEMO_MATCH_ID = 'match-demo-pair'

export default function FemalePage() {
  const [maleLikedMe, setMaleLikedMe] = useState(false)
  const [matched, setMatched] = useState(false)
  const [showAnim, setShowAnim] = useState(false)

  useEffect(() => {
    setMaleLikedMe(storage.getLikedIds().includes('profile-001'))
    setMatched(storage.getMatches().some(m => m.matchId === DEMO_MATCH_ID))
  }, [])

  useEffect(() => {
    return channel.on(ev => {
      if (ev.type === 'like_sent' && ev.profileId === 'profile-001') {
        setMaleLikedMe(true)
      }
    })
  }, [])

  const handleLikeBack = () => {
    storage.addMatch(DEMO_MATCH_ID, MALE.user_id)
    setMatched(true)
    setShowAnim(true)
    channel.send({ type: 'matched', matchId: DEMO_MATCH_ID })
    setTimeout(() => setShowAnim(false), 2500)
  }

  return (
    <div className="min-h-screen" style={{ background: '#F8F5F6' }}>
      {/* Header */}
      <div className="bg-white px-4 pt-10 pb-4 shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ background: '#F9EEF2' }}>
          {FEMALE.emoji}
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm text-gray-900">{FEMALE.name} {FEMALE.age}歳</p>
          <p className="text-xs text-gray-400">{FEMALE.occupation} · {FEMALE.location}</p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full font-bold text-white" style={{ background: '#A84060' }}>
          女性ビュー
        </span>
      </div>

      <div className="px-4 pt-5 space-y-5 pb-10">
        {/* Received likes */}
        <section>
          <h2 className="text-sm font-bold text-gray-600 mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4 fill-current" style={{ color: '#A84060' }} />
            届いたいいね！
          </h2>

          {maleLikedMe ? (
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <User className="w-8 h-8 text-gray-300" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{MALE.name} {MALE.age}歳</p>
                  <p className="text-xs text-gray-500">{MALE.occupation} · {MALE.location}</p>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{MALE.bio}</p>
                </div>
              </div>

              {matched ? (
                <div className="py-2 rounded-xl text-center text-sm font-bold" style={{ background: '#F9EEF2', color: '#A84060' }}>
                  ✓ マッチング済み
                </div>
              ) : (
                <button
                  onClick={handleLikeBack}
                  className="w-full py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2 active:opacity-90 transition"
                  style={{ background: 'linear-gradient(135deg, #A84060, #7E2841)' }}
                >
                  <Heart className="w-4 h-4 fill-white" />
                  いいね！を返す
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
              <p className="text-2xl mb-2">💌</p>
              <p className="text-sm text-gray-400">まだいいね！がありません</p>
              <p className="text-xs text-gray-300 mt-1">男性タブでいいね！すると届きます</p>
            </div>
          )}
        </section>

        {/* Match / chat */}
        {matched && (
          <section>
            <h2 className="text-sm font-bold text-gray-600 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" style={{ color: '#A84060' }} />
              マッチング中
            </h2>
            <Link
              href="/demo-female/chat"
              className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 active:opacity-80 transition"
            >
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 text-gray-300" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900">{MALE.name}さん</p>
                <p className="text-xs text-gray-400">タップしてチャットを開く</p>
              </div>
              <MessageCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#A84060' }} />
            </Link>
          </section>
        )}

        {/* How to use */}
        {!maleLikedMe && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs font-bold text-gray-500 mb-2">📱 デモの使い方</p>
            <ol className="text-xs text-gray-400 space-y-1.5 list-decimal list-inside leading-relaxed">
              <li>別タブで男性ビュー（/demo）を開く</li>
              <li>探す画面で「まい」のカードをいいね！する</li>
              <li>このページにいいね！が届く</li>
              <li>「いいね！を返す」を押してマッチング</li>
              <li>チャット開始！</li>
            </ol>
          </div>
        )}
      </div>

      {/* Match animation */}
      {showAnim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.55)' }}>
          <div className="bg-white rounded-3xl px-10 py-8 text-center mx-6 shadow-2xl">
            <p className="text-5xl mb-3">🎉</p>
            <p className="text-xl font-bold mb-1" style={{ color: '#A84060' }}>マッチング！</p>
            <p className="text-sm text-gray-500">{MALE.name}さんとマッチしました</p>
          </div>
        </div>
      )}
    </div>
  )
}
