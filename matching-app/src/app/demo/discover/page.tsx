'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SlidersHorizontal, Camera, CheckCircle, Heart, User, X } from 'lucide-react'
import { FilterSheet } from './FilterSheet'
import {
  CANDIDATE_PROFILES,
  MATCHED_PROFILES,
  LIKED_ME_PROFILE_IDS,
  MATCH_ID_BY_PROFILE_ID,
  type DemoProfile,
} from '@/lib/demo-data'
import { useLikes } from '@/lib/likes-context'
import { storage } from '@/lib/storage'
import { channel } from '@/lib/channel'

// ── Constants ──────────────────────────────────
const SORT_TABS = [
  { label: 'いいね！が多い順', key: 'likes' },
  { label: 'ログイン順', key: 'login' },
  { label: 'おすすめ順', key: 'recommend' },
  { label: '新メンバー', key: 'new' },
  { label: 'マイQ&A', key: 'qa' },
]

const ALL_BROWSE = [...MATCHED_PROFILES, ...CANDIDATE_PROFILES]

const REGIONS = [
  { label: '北海道・東北', prefs: ['北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県'] },
  { label: '関東', prefs: ['茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県'] },
  { label: '中部', prefs: ['新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県', '静岡県', '愛知県'] },
  { label: '近畿', prefs: ['三重県', '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県'] },
  { label: '中国・四国', prefs: ['鳥取県', '島根県', '岡山県', '広島県', '山口県', '徳島県', '香川県', '愛媛県', '高知県'] },
  { label: '九州・沖縄', prefs: ['福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'] },
]

const CONFETTI_COLORS = ['#7E2841', '#F8A4C0', '#FFD700', '#FF6B6B', '#4ECDC4', '#A8E6CF', '#FFEAA7', '#DDA0DD']

// ── Types ──────────────────────────────────────
type FilterState = {
  distanceSearch: boolean
  locations: string[]
  heightMin: number; heightMax: number
  bodyTypes: string[]
  ageMin: number; ageMax: number
  jobTypes: string[]
  incomeMin: number; incomeMax: number
  holidays: string[]
  educations: string[]
  roommateTypes: string[]
  smokingTypes: string[]
  alcoholTypes: string[]
  marriageTypes: string[]
  childrenTypes: string[]
}

const DEFAULT_FILTER: FilterState = {
  distanceSearch: false, locations: [],
  heightMin: 140, heightMax: 200,
  bodyTypes: [], ageMin: 18, ageMax: 50,
  jobTypes: [], incomeMin: 0, incomeMax: 5,
  holidays: [], educations: [], roommateTypes: [],
  smokingTypes: [], alcoholTypes: [], marriageTypes: [], childrenTypes: [],
}

// ── Helpers ────────────────────────────────────
function sortProfiles(profiles: DemoProfile[], key: string): DemoProfile[] {
  switch (key) {
    case 'likes': return [...profiles].sort((a, b) => b.likeCount - a.likeCount)
    case 'login': return [...profiles].filter(p => p.isOnline).concat(profiles.filter(p => !p.isOnline))
    case 'new': return [...profiles].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    default: return profiles
  }
}

function applyFilters(profiles: DemoProfile[], f: FilterState): DemoProfile[] {
  return profiles.filter(p => {
    if (p.age < f.ageMin || p.age > f.ageMax) return false
    if (f.locations.length > 0) {
      const loc = p.location.replace(/[都府県]$/, '')
      if (!f.locations.some(l => p.location.includes(l) || loc === l.replace(/[都府県]$/, ''))) return false
    }
    if (f.heightMin > 140 || f.heightMax < 200) {
      if (!p.height || p.height < f.heightMin || p.height > f.heightMax) return false
    }
    if (f.bodyTypes.length > 0 && !f.bodyTypes.includes(p.bodyType)) return false
    if (f.smokingTypes.length > 0 && !f.smokingTypes.some(s => p.smoking === s)) return false
    if (f.alcoholTypes.length > 0 && p.drinking) {
      const map: Record<string,string> = { 'ときどき飲む': 'たまに飲む' }
      if (!f.alcoholTypes.some(a => p.drinking === a || p.drinking === map[a])) return false
    }
    if (f.holidays.length > 0 && p.holiday) {
      const map: Record<string,string[]> = { '土日': ['土日','土日休み'], '平日': ['平日','平日休み'], '不定期': ['シフト制','不定休'] }
      if (!f.holidays.some(h => (map[h] ?? [h]).some(v => p.holiday!.includes(v)))) return false
    }
    if (f.jobTypes.length > 0 && !f.jobTypes.some(j => p.occupation.includes(j) || j.includes(p.occupation))) return false
    return true
  })
}

function hasActiveFilter(f: FilterState): boolean {
  return f.locations.length > 0 || f.bodyTypes.length > 0 || f.smokingTypes.length > 0 ||
    f.alcoholTypes.length > 0 || f.holidays.length > 0 || f.jobTypes.length > 0 ||
    f.educations.length > 0 || f.roommateTypes.length > 0 || f.marriageTypes.length > 0 ||
    f.childrenTypes.length > 0 || f.ageMin !== 18 || f.ageMax !== 50 ||
    f.heightMin !== 140 || f.heightMax !== 200
}

// ── Main page ──────────────────────────────────
export default function DemoDiscoverPage() {
  const router = useRouter()
  const { decrement } = useLikes()
  const [activeTab, setActiveTab] = useState('recommend')
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    setLikedIds(new Set(storage.getLikedIds()))
  }, [])

  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTER)
  const [pendingLike, setPendingLike] = useState<DemoProfile | null>(null)
  const [matchedProfile, setMatchedProfile] = useState<DemoProfile | null>(null)
  const [matchId, setMatchId] = useState('')

  const handleLikeClick = (profile: DemoProfile) => {
    if (likedIds.has(profile.id)) {
      setLikedIds(prev => { const n = new Set(prev); n.delete(profile.id); return n })
    } else {
      setPendingLike(profile)
    }
  }

  const confirmLike = (profile: DemoProfile) => {
    setLikedIds(prev => {
      const next = new Set([...prev, profile.id])
      storage.setLikedIds([...next])
      return next
    })
    setPendingLike(null)
    decrement()
    channel.send({ type: 'like_sent', profileId: profile.id })
    if (LIKED_ME_PROFILE_IDS.has(profile.id)) {
      const mid = MATCH_ID_BY_PROFILE_ID[profile.id]
      setMatchId(mid)
      setMatchedProfile(profile)
      storage.addMatch(mid, profile.user_id)
    }
  }

  const profiles = applyFilters(sortProfiles(ALL_BROWSE, activeTab), filters)
  const isFiltered = hasActiveFilter(filters)

  return (
    <div className="min-h-screen">
      {/* ── Header ── */}
      <div className="bg-white px-4 pt-10 pb-0 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-baseline gap-1">
            <h1 className="text-2xl font-bold" style={{ color: '#7E2841' }}>魅力マッチ</h1>
            <span className="text-xs text-gray-400 font-normal">by 魅力大学</span>
          </div>
          <button
            onClick={() => setFilterOpen(true)}
            className="p-2 rounded-full hover:bg-gray-100 transition relative"
          >
            <SlidersHorizontal className="w-5 h-5 text-gray-500" />
            {isFiltered && (
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ background: '#7E2841' }}
              />
            )}
          </button>
        </div>

        {/* Sort tabs */}
        <div className="flex overflow-x-auto gap-0 -mx-4 px-4 pb-0 no-scrollbar">
          {SORT_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex-shrink-0 px-3 py-2.5 text-sm font-medium transition-colors relative whitespace-nowrap"
              style={{ color: activeTab === tab.key ? '#7E2841' : '#9CA3AF' }}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ background: '#7E2841' }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Story circles ── */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          <div className="flex-shrink-0 flex flex-col items-center gap-1">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-sm"
              style={{ background: 'linear-gradient(135deg, #7E2841, #A03558)' }}
            >
              <div className="text-center leading-tight">
                <div className="text-[9px]">本日の</div>
                <div className="text-[9px]">Pickup</div>
              </div>
            </div>
            <span className="text-[10px] text-gray-500 text-center w-14 truncate">Pickup</span>
          </div>
          {profiles.slice(0, 6).map(p => (
            <div key={p.id} className="flex-shrink-0 flex flex-col items-center gap-1">
              <div
                className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center relative shadow-sm overflow-hidden"
                style={{ border: p.isOnline ? '2px solid #22c55e' : '2px solid #E8E0E2' }}
              >
                {p.avatar_url
                  ? <img src={p.avatar_url} className="w-full h-full object-cover" alt={p.name} />
                  : <User className="w-8 h-8 text-gray-400" />
                }
                {p.isOnline && (
                  <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              <span className="text-[10px] text-gray-500 text-center w-14 truncate">{p.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Promotional banner ── */}
      <div className="px-4 py-3">
        <div
          className="rounded-2xl p-4 text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #7E2841 0%, #A03558 60%, #C0476E 100%)' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-lg">🪙</span>
                <span className="text-xs font-medium opacity-90">期間限定</span>
              </div>
              <p className="text-lg font-bold leading-tight">ポイント増量</p>
              <p className="text-xs opacity-80 mt-0.5">キャンペーン開催中！</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black opacity-20 absolute right-4 top-2">✦</div>
              <button className="bg-white text-[#7E2841] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                詳細を見る
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter badge ── */}
      {isFiltered && (
        <div className="px-4 pb-2">
          <div className="flex items-center gap-2 flex-wrap">
            {(filters.ageMin !== 18 || filters.ageMax !== 50) && (
              <span className="text-xs px-3 py-1 rounded-full border" style={{ borderColor: '#5BC0C0', color: '#5BC0C0', background: '#E8F8F8' }}>
                {filters.ageMin}〜{filters.ageMax}歳
              </span>
            )}
            {filters.locations.map(loc => (
              <span key={loc} className="text-xs px-3 py-1 rounded-full border" style={{ borderColor: '#5BC0C0', color: '#5BC0C0', background: '#E8F8F8' }}>
                {loc.replace(/[都府県]$/, '')}
              </span>
            ))}
            {filters.bodyTypes.map(b => (
              <span key={b} className="text-xs px-3 py-1 rounded-full border" style={{ borderColor: '#5BC0C0', color: '#5BC0C0', background: '#E8F8F8' }}>{b}</span>
            ))}
            {filters.smokingTypes.map(s => (
              <span key={s} className="text-xs px-3 py-1 rounded-full border" style={{ borderColor: '#5BC0C0', color: '#5BC0C0', background: '#E8F8F8' }}>{s}</span>
            ))}
            <button
              onClick={() => setFilters(DEFAULT_FILTER)}
              className="text-xs text-gray-400 underline"
            >
              リセット
            </button>
            <span className="text-xs text-gray-400">{profiles.length}件</span>
          </div>
        </div>
      )}

      {/* ── Profile grid ── */}
      <div className="px-4 pb-4">
        {profiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <p className="text-gray-400 text-sm">条件に合うメンバーが見つかりませんでした</p>
            <button
              onClick={() => setFilters(DEFAULT_FILTER)}
              className="text-sm font-medium px-4 py-2 rounded-full"
              style={{ background: '#F5E6EA', color: '#7E2841' }}
            >
              絞り込みをリセット
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {profiles.map(profile => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                liked={likedIds.has(profile.id)}
                onLikeClick={handleLikeClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Overlays ── */}
      {filterOpen && (
        <FilterSheet
          filters={filters}
          onApply={f => setFilters(f)}
          onClose={() => setFilterOpen(false)}
        />
      )}
      {pendingLike && (
        <LikeModal
          profile={pendingLike}
          onConfirm={() => confirmLike(pendingLike)}
          onCancel={() => setPendingLike(null)}
        />
      )}
      {matchedProfile && (
        <MatchPopup
          profile={matchedProfile}
          matchId={matchId}
          onClose={() => setMatchedProfile(null)}
          onMessage={() => {
            setMatchedProfile(null)
            router.push(`/demo/chat/${matchId}`)
          }}
        />
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
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

// ── Like Modal ─────────────────────────────────
function LikeModal({
  profile,
  onConfirm,
  onCancel,
}: {
  profile: DemoProfile
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-[150] flex items-end justify-center" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative bg-white rounded-t-3xl w-full max-w-md px-6 pt-6 pb-10"
        onClick={e => e.stopPropagation()}
        style={{ animation: 'matchCardIn 0.2s ease-out' }}
      >
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />

        {/* Profile preview */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-3 shadow-sm">
            {profile.avatar_url
              ? <img src={profile.avatar_url} className="w-full h-full object-cover" alt="" />
              : <User className="w-12 h-12 text-gray-400" />
            }
          </div>
          <p className="text-lg font-bold text-gray-900">{profile.name}さん</p>
          <p className="text-sm text-gray-400 mt-0.5">
            {profile.age}歳 · {profile.location.replace(/[都府県]$/, '')}
          </p>
          {LIKED_ME_PROFILE_IDS.has(profile.id) && (
            <span
              className="mt-2 text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: '#FDF0F3', color: '#7E2841' }}
            >
              ❤️ あなたのことが気になっています
            </span>
          )}
        </div>

        <button
          onClick={onConfirm}
          className="w-full py-4 rounded-2xl text-white font-bold text-base shadow-sm flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #7E2841, #A03558)' }}
        >
          <Heart className="w-5 h-5 fill-white text-white" />
          いいね！を送る
        </button>
        <button onClick={onCancel} className="w-full py-3 text-sm text-gray-400 mt-1">
          キャンセル
        </button>
      </div>
    </div>
  )
}

// ── Match Popup ────────────────────────────────
function MatchPopup({
  profile,
  onClose,
  onMessage,
}: {
  profile: DemoProfile
  matchId: string
  onClose: () => void
  onMessage: () => void
}) {
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
          <div className="w-18 h-18 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center shadow-md" style={{ width: 72, height: 72 }}>
            <User className="w-10 h-10 text-gray-400" />
          </div>
          <Heart
            className="w-9 h-9 fill-[#7E2841] flex-shrink-0"
            style={{ color: '#7E2841', animation: 'heartPulse 0.8s ease-in-out infinite' }}
          />
          <div className="w-18 h-18 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center shadow-md" style={{ width: 72, height: 72 }}>
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
          onClick={onMessage}
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

// ── Profile Card ───────────────────────────────
function ProfileCard({
  profile,
  liked,
  onLikeClick,
}: {
  profile: DemoProfile
  liked: boolean
  onLikeClick: (profile: DemoProfile) => void
}) {
  return (
    <Link
      href={`/demo/profile/${profile.id}`}
      className="bg-white rounded-2xl overflow-hidden shadow-sm active:scale-[0.98] transition-transform block"
    >
      {/* Photo area */}
      <div
        className="relative bg-gray-200 flex items-center justify-center overflow-hidden"
        style={{ aspectRatio: '3/4' }}
      >
        {profile.avatar_url
          ? <img src={profile.avatar_url} className="w-full h-full object-cover absolute inset-0" alt={profile.name} />
          : <User className="w-20 h-20 text-gray-400" />
        }

        {/* Photo count */}
        <div className="absolute bottom-2 right-2 bg-black/40 text-white text-[11px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
          <Camera className="w-3 h-3" />
          <span>{profile.photoCount}</span>
        </div>

        {/* NEW badge */}
        {new Date(profile.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
          <div
            className="absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: '#7E2841' }}
          >
            NEW
          </div>
        )}

        {/* Liked-me badge */}
        {LIKED_ME_PROFILE_IDS.has(profile.id) && !liked && (
          <div
            className="absolute top-2 right-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: 'linear-gradient(90deg, #F47C9E, #E85D87)' }}
          >
            ❤️ 気になってる
          </div>
        )}

        {/* Like button */}
        <button
          onClick={e => { e.preventDefault(); e.stopPropagation(); onLikeClick(profile) }}
          className="absolute bottom-2 left-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm transition-transform active:scale-90"
        >
          <Heart
            className="w-4 h-4 transition-colors"
            style={{ color: liked ? '#7E2841' : '#D1D5DB', fill: liked ? '#7E2841' : 'none' }}
          />
        </button>
      </div>

      {/* Info */}
      <div className="px-2.5 py-2">
        <div className="flex items-center gap-1 mb-0.5">
          {profile.isOnline && (
            <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
          )}
          <span className="text-[13px] font-semibold text-gray-800 truncate">
            {profile.age}歳 {profile.location.replace(/[都府県]$/, '')}
          </span>
          {profile.isVerified && (
            <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#3B82F6' }} />
          )}
        </div>
        <div className="flex items-center gap-2 text-[11px]" style={{ color: '#9CA3AF' }}>
          <span className="flex items-center gap-0.5">
            <span>👍</span>
            <span>{profile.likeCount}</span>
          </span>
          <span className="flex items-center gap-0.5">
            <Camera className="w-3 h-3" />
            <span>{profile.photoCount}</span>
          </span>
          <span style={{ color: '#7E2841' }} className="font-medium">
            ♥{profile.matchPercent}%
          </span>
        </div>
      </div>
    </Link>
  )
}
