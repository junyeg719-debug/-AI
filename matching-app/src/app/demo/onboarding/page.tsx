'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Camera, User, Check, Heart } from 'lucide-react'

type Step = 'welcome' | 'gender' | 'basic' | 'photo' | 'interests' | 'bio' | 'complete'
const STEPS: Step[] = ['gender', 'basic', 'photo', 'interests', 'bio']

const PREFECTURES = [
  '北海道', '東京都', '神奈川県', '大阪府', '京都府',
  '滋賀県', '奈良県', '愛知県', '福岡県', 'その他',
]

const INTEREST_OPTIONS = [
  'カフェ巡り', '旅行', 'グルメ', '映画', '音楽', '読書',
  'ヨガ', 'スポーツ', '料理', 'ショッピング', 'ドライブ', 'アウトドア',
  'ゲーム', 'アニメ', 'テーマパーク', '写真', 'ライブ', 'キャンプ', 'ペット', 'DIY',
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('welcome')
  const [gender, setGender] = useState<'male' | 'female' | null>(null)
  const [name, setName] = useState('')
  const [age, setAge] = useState(25)
  const [location, setLocation] = useState('')
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [interests, setInterests] = useState<string[]>([])
  const [bio, setBio] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const stepIndex = STEPS.indexOf(step)

  const goNext = () => {
    const idx = STEPS.indexOf(step)
    if (idx < STEPS.length - 1) {
      setStep(STEPS[idx + 1])
    } else {
      setStep('complete')
    }
  }

  const goBack = () => {
    const idx = STEPS.indexOf(step)
    if (idx > 0) setStep(STEPS[idx - 1])
    else setStep('welcome')
  }

  const toggleInterest = (tag: string) => {
    setInterests(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoUrl(URL.createObjectURL(file))
    e.target.value = ''
  }

  const isNextDisabled =
    (step === 'gender' && !gender) ||
    (step === 'basic' && (!name.trim() || !location)) ||
    (step === 'interests' && interests.length < 3)

  // ── Welcome ──
  if (step === 'welcome') {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center px-8">
        <div className="text-center mb-12">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #7E2841, #A03558)' }}
          >
            <Heart className="w-12 h-12 text-white fill-white" />
          </div>
          <h1 className="text-3xl font-black mb-1" style={{ color: '#7E2841' }}>魅力マッチ</h1>
          <p className="text-sm text-gray-400 mb-6">by 魅力大学</p>
          <p className="text-base text-gray-600 leading-relaxed">
            あなたの魅力で<br />素敵な出会いを見つけよう
          </p>
        </div>
        <button
          onClick={() => setStep('gender')}
          className="w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg mb-4"
          style={{ background: 'linear-gradient(135deg, #7E2841, #A03558)' }}
        >
          無料で始める
        </button>
        <Link href="/demo/discover" className="text-sm text-gray-400 underline underline-offset-2">
          すでに登録済みの方はこちら
        </Link>
      </div>
    )
  }

  // ── Complete ──
  if (step === 'complete') {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center px-8">
        <div className="text-center mb-10">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #7E2841, #A03558)' }}
          >
            <Check className="w-12 h-12 text-white" strokeWidth={3} />
          </div>
          <h1 className="text-2xl font-black mb-3 text-gray-900">登録完了！</h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            {name || 'あなた'}さん、ようこそ！<br />
            素敵な出会いが待っています ✨
          </p>
        </div>
        <button
          onClick={() => router.push('/demo/discover')}
          className="w-full py-4 rounded-2xl text-white font-bold text-lg shadow-lg"
          style={{ background: 'linear-gradient(135deg, #7E2841, #A03558)' }}
        >
          さっそく探す
        </button>
      </div>
    )
  }

  // ── Step screens ──
  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col">
      {/* Progress header */}
      <div className="px-4 pt-12 pb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          {step !== 'gender' ? (
            <button onClick={goBack} className="p-1 flex-shrink-0">
              <ChevronLeft className="w-6 h-6 text-gray-500" />
            </button>
          ) : (
            <div className="w-8 flex-shrink-0" />
          )}
          <div className="flex-1 flex gap-1.5">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className="h-1 rounded-full flex-1 transition-all duration-300"
                style={{ background: i <= stepIndex ? '#7E2841' : '#E5E7EB' }}
              />
            ))}
          </div>
          <div className="w-8 flex-shrink-0" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 overflow-y-auto">

        {/* Gender */}
        {step === 'gender' && (
          <div className="pt-4">
            <h2 className="text-2xl font-black text-gray-900 mb-2">あなたの性別を<br />教えてください</h2>
            <p className="text-sm text-gray-400 mb-8">後から変更することはできません</p>
            <div className="grid grid-cols-2 gap-4">
              {(['male', 'female'] as const).map(g => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className="rounded-2xl p-8 border-2 transition-all flex flex-col items-center gap-3"
                  style={{
                    borderColor: gender === g ? '#7E2841' : '#E5E7EB',
                    background: gender === g ? '#FDF0F3' : 'white',
                  }}
                >
                  <span className="text-5xl">{g === 'male' ? '👨' : '👩'}</span>
                  <span className="font-bold text-gray-800 text-lg">{g === 'male' ? '男性' : '女性'}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Basic info */}
        {step === 'basic' && (
          <div className="pt-4">
            <h2 className="text-2xl font-black text-gray-900 mb-8">基本情報を<br />入力してください</h2>

            <div className="mb-8">
              <label className="text-sm font-semibold text-gray-600 block mb-2">ニックネーム</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="例：たかし"
                className="w-full border-b-2 border-gray-200 py-3 text-lg outline-none transition-colors"
                style={{ background: 'transparent', caretColor: '#7E2841' }}
                onFocus={e => (e.target.style.borderColor = '#7E2841')}
                onBlur={e => (e.target.style.borderColor = name ? '#7E2841' : '#E5E7EB')}
              />
            </div>

            <div className="mb-8">
              <label className="text-sm font-semibold text-gray-600 block mb-3">
                年齢：<span style={{ color: '#7E2841' }}>{age}歳</span>
              </label>
              <input
                type="range"
                min={18}
                max={55}
                value={age}
                onChange={e => setAge(Number(e.target.value))}
                className="w-full"
                style={{ accentColor: '#7E2841' }}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>18歳</span>
                <span>55歳</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600 block mb-3">お住まいの都道府県</label>
              <div className="flex flex-wrap gap-2">
                {PREFECTURES.map(pref => (
                  <button
                    key={pref}
                    onClick={() => setLocation(pref)}
                    className="px-4 py-2 rounded-full text-sm border-2 transition-all font-medium"
                    style={{
                      borderColor: location === pref ? '#7E2841' : '#E5E7EB',
                      background: location === pref ? '#7E2841' : 'white',
                      color: location === pref ? 'white' : '#374151',
                    }}
                  >
                    {pref}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Photo */}
        {step === 'photo' && (
          <div className="pt-4">
            <h2 className="text-2xl font-black text-gray-900 mb-2">プロフィール写真を<br />追加しましょう</h2>
            <p className="text-sm text-gray-400 mb-8">写真があるとマッチ率が3倍UP！</p>

            <div className="flex justify-center mb-6">
              <button
                onClick={() => fileRef.current?.click()}
                className="relative w-52 h-52 rounded-full overflow-hidden shadow-inner"
                style={{ background: '#F3F4F6' }}
              >
                {photoUrl
                  ? <img src={photoUrl} className="w-full h-full object-cover" alt="" />
                  : <User className="absolute inset-0 m-auto w-28 h-28 text-gray-300" />
                }
                <div
                  className="absolute bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                  style={{ background: '#7E2841' }}
                >
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </button>
            </div>
            <p className="text-center text-xs text-gray-400">タップして写真を選択</p>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </div>
        )}

        {/* Interests */}
        {step === 'interests' && (
          <div className="pt-4">
            <h2 className="text-2xl font-black text-gray-900 mb-2">趣味・興味を<br />選んでください</h2>
            <p className="text-sm mb-6" style={{ color: interests.length >= 3 ? '#7E2841' : '#9CA3AF' }}>
              {interests.length >= 3
                ? `${interests.length}個選択中 ✓`
                : `3つ以上選ぶとマッチ率UP（${interests.length}/3）`}
            </p>
            <div className="flex flex-wrap gap-2 pb-4">
              {INTEREST_OPTIONS.map(tag => {
                const selected = interests.includes(tag)
                return (
                  <button
                    key={tag}
                    onClick={() => toggleInterest(tag)}
                    className="px-4 py-2 rounded-full text-sm border-2 transition-all font-medium"
                    style={{
                      borderColor: selected ? '#7E2841' : '#E5E7EB',
                      background: selected ? '#7E2841' : 'white',
                      color: selected ? 'white' : '#374151',
                    }}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Bio */}
        {step === 'bio' && (
          <div className="pt-4">
            <h2 className="text-2xl font-black text-gray-900 mb-2">自己紹介文を<br />書きましょう</h2>
            <p className="text-sm text-gray-400 mb-6">あなたの魅力を自由に伝えてください</p>
            <div className="relative">
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="趣味や好きなこと、どんな人と出会いたいかなど、自由に書いてみてください😊"
                className="w-full h-48 border-2 border-gray-200 rounded-2xl p-4 text-sm outline-none resize-none transition-colors leading-relaxed"
                maxLength={300}
                style={{ caretColor: '#7E2841' }}
                onFocus={e => (e.target.style.borderColor = '#7E2841')}
                onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
              />
              <span className="absolute bottom-3 right-3 text-xs text-gray-400">{bio.length}/300</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="px-6 pb-10 pt-4 flex-shrink-0">
        <button
          onClick={goNext}
          disabled={isNextDisabled}
          className="w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 transition-opacity disabled:opacity-40 shadow-sm"
          style={{ background: 'linear-gradient(135deg, #7E2841, #A03558)' }}
        >
          {step === 'bio' ? '登録する' : '次へ'}
          {step !== 'bio' && <ChevronRight className="w-5 h-5" />}
        </button>
        {(step === 'photo' || step === 'bio') && (
          <button onClick={goNext} className="w-full py-3 text-sm text-gray-400 mt-1">
            スキップ
          </button>
        )}
      </div>
    </div>
  )
}
