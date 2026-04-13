'use client'

import { useState, useMemo } from 'react'
import { Search, MapPin, Briefcase, SlidersHorizontal, X } from 'lucide-react'
import { ALL_PROFILES, type DemoProfile } from '@/lib/demo-data'

export default function DemoSearchPage() {
  const [keyword, setKeyword] = useState('')
  const [minAge, setMinAge] = useState(18)
  const [maxAge, setMaxAge] = useState(60)
  const [location, setLocation] = useState('')
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  const ALL_INTERESTS = Array.from(new Set(ALL_PROFILES.flatMap((p) => p.interests)))

  const filtered = useMemo(() => {
    return ALL_PROFILES.filter((p) => {
      if (keyword && !p.name.includes(keyword)) return false
      if (p.age < minAge || p.age > maxAge) return false
      if (location && !p.location.includes(location)) return false
      if (selectedInterests.length > 0 && !selectedInterests.some((i) => p.interests.includes(i))) return false
      return true
    })
  }, [keyword, minAge, maxAge, location, selectedInterests])

  const hasFilters = location || selectedInterests.length > 0 || minAge !== 18 || maxAge !== 60

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white px-4 pt-10 pb-3 shadow-sm sticky top-6 z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2.5">
            <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
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
            className={`p-2.5 rounded-xl transition ${showFilters || hasFilters ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {showFilters && (
          <div className="border-t border-gray-100 pt-3 space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-gray-600">年齢</label>
                <span className="text-xs text-rose-500 font-medium">{minAge}〜{maxAge}歳</span>
              </div>
              <div className="flex items-center gap-3">
                <input type="range" min={18} max={maxAge} value={minAge} onChange={(e) => setMinAge(+e.target.value)} className="flex-1 accent-rose-500" />
                <input type="range" min={minAge} max={80} value={maxAge} onChange={(e) => setMaxAge(+e.target.value)} className="flex-1 accent-rose-500" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> 居住地
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="例: 東京都"
                className="w-full px-3 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-2 block">趣味・興味</label>
              <div className="flex flex-wrap gap-1.5">
                {ALL_INTERESTS.map((i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedInterests((prev) =>
                      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
                    )}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition ${
                      selectedInterests.includes(i) ? 'bg-rose-500 text-white border-rose-500' : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>
            {hasFilters && (
              <button
                onClick={() => { setMinAge(18); setMaxAge(60); setLocation(''); setSelectedInterests([]) }}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                フィルターをリセット
              </button>
            )}
          </div>
        )}
      </div>

      <div className="px-4 py-4">
        <p className="text-xs text-gray-400 mb-3">{filtered.length}人が見つかりました</p>
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500">条件に一致するユーザーが見つかりませんでした</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ProfileCard({ profile }: { profile: DemoProfile }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
      <div className={`h-32 bg-gradient-to-br ${profile.color} flex items-center justify-center`}>
        <span className="text-5xl">{profile.emoji}</span>
      </div>
      <div className="p-3">
        <p className="font-semibold text-gray-900 text-sm">{profile.name}</p>
        <p className="text-gray-400 text-xs mb-1.5">{profile.age}歳</p>
        <div className="flex flex-col gap-0.5">
          <span className="flex items-center gap-1 text-gray-400 text-xs">
            <MapPin className="w-3 h-3" /> {profile.location}
          </span>
          <span className="flex items-center gap-1 text-gray-400 text-xs">
            <Briefcase className="w-3 h-3" /> {profile.occupation}
          </span>
        </div>
        {profile.interests.slice(0, 2).length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {profile.interests.slice(0, 2).map((i) => (
              <span key={i} className="px-2 py-0.5 bg-rose-50 text-rose-500 rounded-full text-xs">{i}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
