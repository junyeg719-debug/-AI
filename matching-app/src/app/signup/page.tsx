'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Heart } from 'lucide-react'

const INTERESTS = [
  '旅行', '料理', '音楽', '映画', 'スポーツ', 'ゲーム', '読書',
  'アート', 'ファッション', 'カフェ巡り', 'アウトドア', 'ヨガ',
  'ランニング', 'ドライブ', 'ペット', '写真', 'DIY', 'ワイン',
]

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Step 1: アカウント情報
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Step 2: 基本プロフィール
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('female')
  const [lookingFor, setLookingFor] = useState<'male' | 'female' | 'both'>('male')

  // Step 3: 詳細プロフィール
  const [bio, setBio] = useState('')
  const [occupation, setOccupation] = useState('')
  const [location, setLocation] = useState('')
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : prev.length < 8 ? [...prev, interest] : prev
    )
  }

  const handleSubmit = async () => {
    setError(null)
    setLoading(true)

    const supabase = createClient()

    // 1. アカウント作成
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError || !authData.user) {
      setError(authError?.message ?? '登録に失敗しました')
      setLoading(false)
      return
    }

    // 2. プロフィール作成
    const { error: profileError } = await supabase.from('profiles').insert({
      user_id: authData.user.id,
      name,
      age: parseInt(age),
      gender,
      looking_for: lookingFor,
      bio: bio || null,
      occupation: occupation || null,
      location: location || null,
      interests: selectedInterests,
      photos: [],
    })

    if (profileError) {
      setError('プロフィールの作成に失敗しました: ' + profileError.message)
      setLoading(false)
      return
    }

    router.push('/discover')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-rose-100 rounded-full mb-3">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Hana</h1>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s === step ? 'w-8 bg-rose-500' : s < step ? 'w-4 bg-rose-300' : 'w-4 bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Step 1: アカウント */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 text-center">アカウント作成</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
                placeholder="example@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">パスワード（6文字以上）</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
                placeholder="••••••••"
              />
            </div>
            <button
              onClick={() => {
                if (!email || password.length < 6) {
                  setError('メールアドレスとパスワード（6文字以上）を入力してください')
                  return
                }
                setError(null)
                setStep(2)
              }}
              className="w-full py-3 bg-gradient-to-r from-rose-400 to-pink-500 text-white font-semibold rounded-xl hover:opacity-90 transition shadow-lg shadow-rose-200"
            >
              次へ
            </button>
          </div>
        )}

        {/* Step 2: 基本プロフィール */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 text-center">基本情報</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ニックネーム</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
                placeholder="表示名"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">年齢</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min={18}
                max={100}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
                placeholder="18"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">性別</label>
              <div className="flex gap-2">
                {([['female', '女性'], ['male', '男性'], ['other', 'その他']] as const).map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => setGender(val)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium border transition ${
                      gender === val
                        ? 'bg-rose-500 text-white border-rose-500'
                        : 'border-gray-200 text-gray-600 hover:border-rose-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">探している相手</label>
              <div className="flex gap-2">
                {([['male', '男性'], ['female', '女性'], ['both', '両方']] as const).map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => setLookingFor(val)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium border transition ${
                      lookingFor === val
                        ? 'bg-rose-500 text-white border-rose-500'
                        : 'border-gray-200 text-gray-600 hover:border-rose-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition"
              >
                戻る
              </button>
              <button
                onClick={() => {
                  if (!name || !age || parseInt(age) < 18) {
                    setError('名前と年齢（18歳以上）を入力してください')
                    return
                  }
                  setError(null)
                  setStep(3)
                }}
                className="flex-1 py-3 bg-gradient-to-r from-rose-400 to-pink-500 text-white font-semibold rounded-xl hover:opacity-90 transition shadow-lg shadow-rose-200"
              >
                次へ
              </button>
            </div>
          </div>
        )}

        {/* Step 3: 詳細プロフィール */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 text-center">プロフィール詳細</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">自己紹介</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
                placeholder="自分のことを書いてみましょう..."
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">職業</label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
                  placeholder="エンジニア"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">居住地</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400"
                  placeholder="東京都"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                趣味・興味（最大8つ）
              </label>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${
                      selectedInterests.includes(interest)
                        ? 'bg-rose-500 text-white border-rose-500'
                        : 'border-gray-200 text-gray-600 hover:border-rose-300'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-rose-500 text-sm bg-rose-50 px-4 py-2 rounded-lg">{error}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition"
              >
                戻る
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-3 bg-gradient-to-r from-rose-400 to-pink-500 text-white font-semibold rounded-xl hover:opacity-90 transition disabled:opacity-50 shadow-lg shadow-rose-200"
              >
                {loading ? '登録中...' : '登録完了'}
              </button>
            </div>
          </div>
        )}

        {step === 1 && error && (
          <p className="text-rose-500 text-sm bg-rose-50 px-4 py-2 rounded-lg mt-3">{error}</p>
        )}

        {step === 1 && (
          <p className="text-center text-gray-500 mt-4 text-sm">
            アカウントをお持ちの方は{' '}
            <Link href="/login" className="text-rose-500 font-semibold hover:underline">
              ログイン
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
