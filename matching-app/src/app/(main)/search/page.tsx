'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Briefcase, SlidersHorizontal, X } from 'lucide-react'
import type { Profile } from '@/types/database'
import Link from 'next/link'

const INTERESTS = [
  '旅行', '料理', '音楽', '映画', 'スポーツ', 'ゲーム', '読書',
  'アート', 'ファッション', 'カフェ巡り', 'アウトドア', 'ヨガ',
  'ランニング', 'ドライブ', 'ペット', '写真',
]

export default function SearchPage() {
  const router = useRouter()
  const supabase = createClient()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  // フィルター状態
  const [keyword, setKeyword] = useState('')
  const [minAge, setMinAge] = useState(18)
  const [maxAge, setMaxAge] = useState(60)
  const [location, setLocation] = useState('')
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setCurrentUserId(user.id)
      await runSearch(user.id)
    }
    init()
  }, [])

  const runSearch = async (uid?: string) => {
    const userId = uid ?? currentUserId
    if (!userId) return
    setLoading(true)

    let query = supabase
      .from('profiles')
      .select('*')
      .neq('user_id', userId)
      .gte('age', minAge)
      .lte('age', maxAge)
      .limit(30)

    if (keyword.trim()) {
      query = query.ilike('name', `%${keyword.trim()}%`)
    }

    if (location.trim()) {
      query = query.ilike('location', `%${location.trim()}%`)
    }

    if (selectedInterests.length > 0) {
      query = query.overlaps('interests', selectedInterests)
    }

    const { data } = await query
    setProfiles(data ?? [])
    setLoading(false)
  }

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    )
  }

  const clearFilters = () => {
    setKeyword('')
    setMinAge(18)
    setMaxAge(60)
    setLocation('')
    setSelectedInterests([])
  }

  const hasFilters = location || selectedInterests.length > 0 || minAge !== 18 || maxAge !== 60

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-3 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2.5">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runSearch()}
              placeholder="名前で検索..."
              className="flex-1 bg-transparent text-sm text-gray-700 focus:outline-none"
            />
            {keyword && (
              <button onClick={() => setKeyword('')}>
                <X className="w-3.5 h-3.5 text-gray-400" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-xl transition ${
              showFilters || hasFilters ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
          <button
            onClick={() => runSearch()}
            className="px-4 py-2.5 bg-rose-500 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition"
          >
            検索
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="border-t border-gray-100 pt-3 space-y-3">
            {/* Age range */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-gray-600">年齢</label>
                <span className="text-xs text-rose-500 font-medium">{minAge}〜{maxAge}歳</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={18}
                  max={maxAge}
                  value={minAge}
                  onChange={(e) => setMinAge(parseInt(e.target.value))}
                  className="flex-1 accent-rose-500"
                />
                <input
                  type="range"
                  min={minAge}
                  max={80}
                  value={maxAge}
                  onChange={(e) => setMaxAge(parseInt(e.target.value))}
                  className="flex-1 accent-rose-500"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> 居住地
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="例: 東京都"
                className="w-full px-3 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-rose-400"
              />
            </div>

            {/* Interests */}
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">趣味・興味</label>
              <div className="flex flex-wrap gap-1.5">
                {INTERESTS.map((i) => (
                  <button
                    key={i}
                    onClick={() => toggleInterest(i)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition ${
                      selectedInterests.includes(i)
                        ? 'bg-rose-500 text-white border-rose-500'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>

            {hasFilters && (
              <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-gray-600 transition">
                フィルターをリセット
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="px-4 py-4">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500">条件に一致するユーザーが見つかりませんでした</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-3">{profiles.length}人が見つかりました</p>
            <div className="grid grid-cols-2 gap-3">
              {profiles.map((profile) => {
                const gradient = getGradient(profile.id)
                return (
                  <div
                    key={profile.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm"
                  >
                    <div className={`h-32 bg-gradient-to-br ${gradient} relative flex items-center justify-center`}>
                      {profile.avatar_url ? (
                        <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white text-3xl font-bold opacity-80">{profile.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="font-semibold text-gray-900 text-sm">{profile.name}</p>
                      <p className="text-gray-400 text-xs mb-1.5">{profile.age}歳</p>
                      <div className="flex flex-col gap-0.5">
                        {profile.location && (
                          <span className="flex items-center gap-1 text-gray-400 text-xs">
                            <MapPin className="w-3 h-3" /> {profile.location}
                          </span>
                        )}
                        {profile.occupation && (
                          <span className="flex items-center gap-1 text-gray-400 text-xs">
                            <Briefcase className="w-3 h-3" /> {profile.occupation}
                          </span>
                        )}
                      </div>
                      {profile.interests.slice(0, 2).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {profile.interests.slice(0, 2).map((i) => (
                            <span key={i} className="px-2 py-0.5 bg-rose-50 text-rose-500 rounded-full text-xs">
                              {i}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
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
  ]
  return gradients[id.charCodeAt(0) % gradients.length]
}
