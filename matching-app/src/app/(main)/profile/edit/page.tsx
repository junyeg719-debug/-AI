'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import type { Profile } from '@/types/database'

const INTERESTS = [
  '旅行', '料理', '音楽', '映画', 'スポーツ', 'ゲーム', '読書',
  'アート', 'ファッション', 'カフェ巡り', 'アウトドア', 'ヨガ',
  'ランニング', 'ドライブ', 'ペット', '写真', 'DIY', 'ワイン',
]

export default function ProfileEditPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [profile, setProfile] = useState<Partial<Profile>>({})

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (data) setProfile(data)
      setLoading(false)
    }
    fetchProfile()
  }, [])

  const toggleInterest = (interest: string) => {
    const current = profile.interests ?? []
    setProfile({
      ...profile,
      interests: current.includes(interest)
        ? current.filter((i) => i !== interest)
        : current.length < 8 ? [...current, interest] : current,
    })
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)

    const { error } = await supabase
      .from('profiles')
      .update({
        name: profile.name,
        age: profile.age,
        bio: profile.bio,
        occupation: profile.occupation,
        location: profile.location,
        height: profile.height,
        interests: profile.interests ?? [],
        looking_for: profile.looking_for,
      })
      .eq('id', profile.id!)

    if (error) {
      setError('保存に失敗しました')
      setSaving(false)
      return
    }

    router.push('/profile')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 shadow-sm sticky top-0 z-10 flex items-center gap-3">
        <Link href="/profile" className="p-2 hover:bg-gray-100 rounded-full transition">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <h1 className="text-lg font-bold text-gray-900 flex-1">プロフィール編集</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 bg-rose-500 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? '保存中...' : '保存'}
        </button>
      </div>

      <div className="px-4 py-4 space-y-4">
        {error && (
          <p className="text-rose-500 text-sm bg-rose-50 px-4 py-2 rounded-lg">{error}</p>
        )}

        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-700">基本情報</h3>
          <Field label="ニックネーム">
            <input
              type="text"
              value={profile.name ?? ''}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </Field>
          <Field label="年齢">
            <input
              type="number"
              value={profile.age ?? ''}
              onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) })}
              min={18}
              max={100}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </Field>
          <Field label="探している相手">
            <div className="flex gap-2">
              {([['male', '男性'], ['female', '女性'], ['both', '両方']] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setProfile({ ...profile, looking_for: val })}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium border transition ${
                    profile.looking_for === val
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </Field>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-700">詳細情報</h3>
          <Field label="自己紹介">
            <textarea
              value={profile.bio ?? ''}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
            />
          </Field>
          <Field label="職業">
            <input
              type="text"
              value={profile.occupation ?? ''}
              onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </Field>
          <Field label="居住地">
            <input
              type="text"
              value={profile.location ?? ''}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </Field>
          <Field label="身長 (cm)">
            <input
              type="number"
              value={profile.height ?? ''}
              onChange={(e) => setProfile({ ...profile, height: parseInt(e.target.value) || undefined })}
              min={100}
              max={250}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </Field>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-3">趣味・興味（最大8つ）</h3>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((interest) => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${
                  (profile.interests ?? []).includes(interest)
                    ? 'bg-rose-500 text-white border-rose-500'
                    : 'border-gray-200 text-gray-600 hover:border-rose-300'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  )
}
