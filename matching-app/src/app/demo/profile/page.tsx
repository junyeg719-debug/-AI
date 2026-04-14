'use client'

import { useState } from 'react'
import {
  Edit2,
  CheckCircle,
  Camera,
  ChevronRight,
  Heart,
  Eye,
  MessageCircle,
} from 'lucide-react'
import { DEMO_USER } from '@/lib/demo-data'

const STATS = [
  { label: 'いいね！', value: '130', icon: Heart },
  { label: '足あと', value: '28', icon: Eye },
  { label: 'マッチ', value: '3', icon: MessageCircle },
]

const PROFILE_ITEMS = [
  { label: '年齢', value: `${DEMO_USER.age}歳` },
  { label: '居住地', value: DEMO_USER.location },
  { label: '職業', value: DEMO_USER.occupation },
  { label: '身長', value: `${DEMO_USER.height}cm` },
  { label: '体型', value: DEMO_USER.bodyType },
  { label: 'タバコ', value: DEMO_USER.smoking },
]

const MENU_ITEMS = [
  '基本プロフィール編集',
  '写真・動画設定',
  '検索条件設定',
  'プレミアムプラン',
  'プッシュ通知設定',
  'ヘルプ・お問い合わせ',
]

export default function DemoProfilePage() {
  const [bio, setBio] = useState(DEMO_USER.bio)
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setEditing(false)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen" style={{ background: '#F8F5F6' }}>
      {/* Header */}
      <div className="bg-white px-4 pt-10 pb-4 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">マイプロフィール</h1>
          <button
            onClick={() => setEditing((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition"
            style={{
              background: editing ? '#7E2841' : '#F5E6EA',
              color: editing ? '#fff' : '#7E2841',
            }}
          >
            <Edit2 className="w-3.5 h-3.5" />
            {editing ? '編集中' : '編集'}
          </button>
        </div>
      </div>

      {/* Profile hero */}
      <div className="bg-white px-4 py-6 mb-3">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div
              className={`w-20 h-20 rounded-full bg-gradient-to-br ${DEMO_USER.color} flex items-center justify-center text-4xl shadow-md`}
            >
              {DEMO_USER.emoji}
            </div>
            <button
              className="absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center shadow-sm"
              style={{ background: '#7E2841' }}
            >
              <Camera className="w-3 h-3 text-white" />
            </button>
          </div>

          {/* Name & status */}
          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <h2 className="text-xl font-bold text-gray-900">{DEMO_USER.name}</h2>
              <CheckCircle className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-gray-500 text-sm">{DEMO_USER.age}歳 ・{DEMO_USER.location}</p>
            <p className="text-gray-400 text-xs mt-0.5">{DEMO_USER.occupation}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex mt-5 divide-x divide-gray-100">
          {STATS.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex-1 flex flex-col items-center gap-0.5">
              <Icon className="w-4 h-4 text-gray-400" />
              <span className="text-lg font-bold text-gray-900">{value}</span>
              <span className="text-xs text-gray-400">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bio */}
      <div className="bg-white px-4 py-4 mb-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-700">自己紹介</h3>
        </div>
        {editing ? (
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full text-sm text-gray-800 leading-relaxed focus:outline-none resize-none rounded-xl border p-3"
            style={{ borderColor: '#7E2841' }}
          />
        ) : (
          <p className="text-gray-700 text-sm leading-relaxed">{bio}</p>
        )}
      </div>

      {/* Interests */}
      <div className="bg-white px-4 py-4 mb-3">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">趣味・興味</h3>
        <div className="flex flex-wrap gap-2">
          {DEMO_USER.interests.map((interest) => (
            <span
              key={interest}
              className="px-3 py-1.5 rounded-full text-sm font-medium"
              style={{ background: '#F5E6EA', color: '#7E2841' }}
            >
              {interest}
            </span>
          ))}
        </div>
      </div>

      {/* Basic info */}
      <div className="bg-white px-4 py-4 mb-3">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">基本情報</h3>
        <div className="space-y-0 divide-y divide-gray-50">
          {PROFILE_ITEMS.map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2.5">
              <span className="text-sm text-gray-500">{label}</span>
              <span className="text-sm font-medium text-gray-800">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div className="bg-white px-4 py-2 mb-3">
        {MENU_ITEMS.map((item) => (
          <button
            key={item}
            className="w-full flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0 active:bg-gray-50 transition text-left"
          >
            <span className="text-sm text-gray-800">{item}</span>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>
        ))}
      </div>

      {/* Save button */}
      {editing && (
        <div className="px-4 pb-6">
          {saved && (
            <div
              className="text-center text-sm font-medium py-2 mb-2 rounded-xl"
              style={{ background: '#F0FDF4', color: '#16A34A' }}
            >
              ✓ 保存しました
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={() => setEditing(false)}
              className="flex-1 py-3.5 border border-gray-200 text-gray-600 font-semibold rounded-2xl"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3.5 text-white font-bold rounded-2xl shadow-lg transition active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #7E2841, #A03558)' }}
            >
              保存する
            </button>
          </div>
        </div>
      )}

      <div className="h-4" />
    </div>
  )
}
