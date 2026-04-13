'use client'

import { useState } from 'react'
import { MapPin, Briefcase, Edit2 } from 'lucide-react'
import { DEMO_USER } from '@/lib/demo-data'

export default function DemoProfilePage() {
  const [editing, setEditing] = useState(false)
  const [bio, setBio] = useState(DEMO_USER.bio)
  const [name, setName] = useState(DEMO_USER.name)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setEditing(false)
    setTimeout(() => setSaved(false), 2000)
  }

  const profile = DEMO_USER

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white px-4 pt-10 pb-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">マイプロフィール</h1>
          <button
            onClick={() => setEditing(!editing)}
            className={`p-2 rounded-full transition ${editing ? 'bg-rose-500' : 'hover:bg-gray-100'}`}
          >
            <Edit2 className={`w-5 h-5 ${editing ? 'text-white' : 'text-gray-600'}`} />
          </button>
        </div>

        <div className="flex items-center gap-5">
          <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${profile.color} flex items-center justify-center text-4xl shadow-lg`}>
            {profile.emoji}
          </div>
          <div>
            {editing ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-2xl font-bold text-gray-900 border-b-2 border-rose-400 focus:outline-none bg-transparent w-32"
              />
            ) : (
              <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
            )}
            <p className="text-gray-500 text-sm">{profile.age}歳</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-gray-500 text-xs">
                <MapPin className="w-3 h-3" /> {profile.location}
              </span>
              <span className="flex items-center gap-1 text-gray-500 text-xs">
                <Briefcase className="w-3 h-3" /> {profile.occupation}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {saved && (
          <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl text-sm font-medium text-center">
            ✓ 保存しました（デモ）
          </div>
        )}

        {/* Bio */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">自己紹介</h3>
          {editing ? (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full text-gray-800 text-sm leading-relaxed focus:outline-none resize-none border border-rose-200 rounded-xl p-2"
            />
          ) : (
            <p className="text-gray-800 text-sm leading-relaxed">{bio}</p>
          )}
        </div>

        {/* Interests */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 mb-3">趣味・興味</h3>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest) => (
              <span key={interest} className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-full text-sm font-medium">
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 mb-3">基本情報</h3>
          <div className="space-y-2">
            {[
              { label: '性別', value: '女性' },
              { label: '探している相手', value: '男性' },
              { label: '居住地', value: profile.location },
              { label: '職業', value: profile.occupation },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                <span className="text-gray-500 text-sm">{label}</span>
                <span className="text-gray-800 text-sm font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {editing ? (
          <div className="flex gap-3">
            <button
              onClick={() => setEditing(false)}
              className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-2xl"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 bg-gradient-to-r from-rose-400 to-pink-500 text-white font-semibold rounded-2xl shadow-lg shadow-rose-200"
            >
              保存する
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-rose-400 to-pink-500 text-white font-semibold rounded-2xl hover:opacity-90 transition shadow-lg shadow-rose-200"
          >
            <Edit2 className="w-4 h-4" />
            プロフィールを編集
          </button>
        )}
      </div>
    </div>
  )
}
