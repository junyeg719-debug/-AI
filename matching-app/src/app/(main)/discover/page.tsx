'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import SwipeCard, { SwipeButtons } from '@/components/SwipeCard'
import type { Profile } from '@/types/database'
import { Heart, Loader2 } from 'lucide-react'

export default function DiscoverPage() {
  const router = useRouter()
  const supabase = createClient()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [matchAnimation, setMatchAnimation] = useState(false)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: myProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!myProfile) { router.push('/signup'); return }

      setCurrentUserId(user.id)
      await fetchCandidates(user.id, myProfile.looking_for, myProfile.gender)
    }
    init()
  }, [])

  const fetchCandidates = async (
    userId: string,
    lookingFor: 'male' | 'female' | 'both',
    myGender: 'male' | 'female' | 'other'
  ) => {
    // すでにスワイプした相手を除外
    const { data: swiped } = await supabase
      .from('swipes')
      .select('swiped_id')
      .eq('swiper_id', userId)

    const swipedIds = (swiped ?? []).map((s) => s.swiped_id)
    swipedIds.push(userId) // 自分も除外

    let query = supabase
      .from('profiles')
      .select('*')
      .neq('user_id', userId)
      .limit(20)

    // 性別フィルター
    if (lookingFor !== 'both') {
      query = query.eq('gender', lookingFor)
    }

    // 自分の性別を好む相手に絞る（任意）
    const lookingForFilter: ('male' | 'female' | 'both')[] =
      myGender === 'other' ? ['both'] : [myGender, 'both']
    query = query.in('looking_for', lookingForFilter)

    if (swipedIds.length > 0) {
      query = query.not('user_id', 'in', `(${swipedIds.join(',')})`)
    }

    const { data } = await query
    setProfiles(data ?? [])
    setLoading(false)
  }

  const handleSwipe = useCallback(
    async (direction: 'like' | 'pass') => {
      if (!currentUserId || profiles.length === 0) return

      const target = profiles[0]
      setProfiles((prev) => prev.slice(1))

      const { error } = await supabase.from('swipes').insert({
        swiper_id: currentUserId,
        swiped_id: target.user_id,
        direction,
      })

      if (error) return

      // マッチチェック
      if (direction === 'like') {
        const { data: matchData } = await supabase
          .from('matches')
          .select('id')
          .or(
            `and(user1_id.eq.${currentUserId},user2_id.eq.${target.user_id}),and(user1_id.eq.${target.user_id},user2_id.eq.${currentUserId})`
          )
          .maybeSingle()

        if (matchData) {
          setMatchAnimation(true)
          setTimeout(() => setMatchAnimation(false), 2500)
        }
      }
    },
    [currentUserId, profiles]
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-rose-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 shadow-sm">
        <div className="flex items-center justify-center gap-2">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          <h1 className="text-xl font-bold text-gray-900">Hana</h1>
        </div>
      </div>

      {/* Card Stack */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-4">
        {profiles.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-rose-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              今日の候補は以上です
            </h3>
            <p className="text-gray-400 text-sm">また明日チェックしてみましょう</p>
          </div>
        ) : (
          <div
            className="relative w-full"
            style={{ height: 'calc(100vh - 260px)', maxHeight: '520px' }}
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
                <SwipeCard
                  profile={profile}
                  onSwipe={handleSwipe}
                  isTop={index === 0}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Buttons */}
      {profiles.length > 0 && (
        <div className="pb-24 pt-2">
          <SwipeButtons
            onPass={() => handleSwipe('pass')}
            onLike={() => handleSwipe('like')}
          />
        </div>
      )}

      {/* Match Animation */}
      {matchAnimation && (
        <div className="fixed inset-0 bg-gradient-to-br from-rose-400/90 to-pink-600/90 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="text-center animate-bounce-in">
            <div className="text-8xl mb-4">💕</div>
            <h2 className="text-4xl font-bold text-white mb-2">マッチ成立!</h2>
            <p className="text-white/80 text-lg">メッセージを送ってみよう</p>
          </div>
        </div>
      )}
    </div>
  )
}
