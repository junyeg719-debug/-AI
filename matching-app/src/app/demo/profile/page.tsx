'use client'

import { useState } from 'react'
import { ChevronRight, Camera, Heart, Eye, MessageCircle, CheckCircle } from 'lucide-react'
import { DEMO_USER } from '@/lib/demo-data'

const BASIC_ITEMS = [
  { label: '身長', value: '173cm', set: true },
  { label: '体型', value: '普通', set: true },
  { label: '血液型', value: '選択する', set: false },
  { label: '居住地', value: '日本 滋賀', set: true, chevron: true },
  { label: '出身地', value: '設定する', set: false, chevron: true },
  { label: '職種', value: 'エンジニア', set: true },
  { label: '学歴', value: '大学卒', set: true },
  { label: '年収', value: '400万円以上〜600万円未満', set: true },
  { label: 'タバコ', value: '吸わない', set: true },
]

const DETAIL_ITEMS = [
  { label: 'ニックネーム', value: '俊也', set: true, chevron: true },
  { label: '兄弟姉妹', value: '長男', set: true },
  { label: '話せる言語', value: '日本語', set: true, chevron: true },
  { label: '学校名', value: '入力する', set: false, chevron: true },
  { label: '職業名', value: '入力する', set: false, chevron: true },
  { label: '結婚歴', value: '独身（未婚）', set: true },
  { label: '子供の有無', value: 'なし', set: true },
  { label: '結婚に対する意思', value: '2〜3年のうちに', set: true },
  { label: '子供が欲しいか', value: '子供は欲しい', set: true },
  { label: '家事・育児', value: '積極的に参加したい', set: true },
  { label: '出会うまでの希望', value: '気が合えば会いたい', set: true },
  { label: 'デート費用', value: '選択する', set: false },
  { label: '16タイプ診断', value: '選択する', set: false },
  { label: '性格・タイプ', value: '真面目, 誠実, 優しい', set: true, chevron: true },
  { label: '社交性', value: '徐々に仲良くなる', set: true },
  { label: '同居人', value: '一人暮らし', set: true },
  { label: '飼っているペット', value: '設定する', set: false, chevron: true },
  { label: '休日', value: '土日', set: true },
  { label: 'お酒', value: 'ときどき飲む', set: true },
  { label: '好きなこと・趣味', value: '設定する', set: false, chevron: true },
]

const STATS = [
  { label: 'いいね！', value: '130', icon: Heart },
  { label: '足あと', value: '28', icon: Eye },
  { label: 'マッチ', value: '3', icon: MessageCircle },
]

function ProfileRow({ label, value, set, chevron }: { label: string; value: string; set: boolean; chevron?: boolean }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 active:bg-gray-50 transition">
      <span className="text-sm text-gray-700">{label}</span>
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium" style={{ color: set ? '#7E2841' : '#DC2626' }}>{value}</span>
        {chevron && <ChevronRight className="w-4 h-4 text-gray-300" />}
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white mb-3">
      <div className="px-4 py-3 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-800">{title}</h3>
      </div>
      <div className="px-4">{children}</div>
    </div>
  )
}

export default function DemoProfilePage() {
  const [mode, setMode] = useState<'view' | 'edit'>('view')
  const [bio, setBio] = useState('はじめまして！\nプロフィールを見ていただき、ありがとうございます😊\n\n普段はエンジニアとして働いています。\n土日休みの仕事です。\n\n休みの日は、散歩や食べ歩きに行くことが多いです！\n\nさっぱりとした性格で物惜しみはしません。\nよろしくお願いします！')

  const completedBasic = BASIC_ITEMS.filter(i => i.set).length
  const completedDetail = DETAIL_ITEMS.filter(i => i.set).length
  const totalItems = BASIC_ITEMS.length + DETAIL_ITEMS.length
  const completedItems = completedBasic + completedDetail
  const completionPct = Math.round((completedItems / totalItems) * 100)

  if (mode === 'edit') {
    return (
      <div className="min-h-screen" style={{ background: '#F8F5F6' }}>
        {/* Edit header */}
        <div className="bg-white px-4 pt-10 pb-3 sticky top-0 z-20 shadow-sm flex items-center justify-between">
          <button onClick={() => setMode('view')} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
            <span className="text-gray-600 text-lg">×</span>
          </button>
          <h1 className="text-base font-bold text-gray-900">プロフィール編集</h1>
          <button onClick={() => setMode('view')} className="text-sm font-medium" style={{ color: '#7E2841' }}>
            プレビュー
          </button>
        </div>

        {/* Photo */}
        <div className="bg-white py-5 mb-3 flex flex-col items-center gap-2">
          <div className="relative">
            <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${DEMO_USER.color} flex items-center justify-center text-5xl shadow-md`}>
              {DEMO_USER.emoji}
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center shadow" style={{ background: '#7E2841' }}>
              <Camera className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
          <p className="text-xs text-gray-400">写真を変更</p>
        </div>

        {/* 自己紹介文 */}
        <Section title="自己紹介文">
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={7}
            className="w-full text-sm text-gray-800 leading-relaxed focus:outline-none resize-none py-3"
            placeholder="自己紹介文を入力してください"
            style={{ caretColor: '#7E2841' }}
          />
        </Section>

        {/* 基本情報 */}
        <Section title="基本プロフ">
          {BASIC_ITEMS.map(item => <ProfileRow key={item.label} {...item} />)}
        </Section>

        {/* 詳細プロフィール */}
        <Section title="詳細プロフィール">
          {DETAIL_ITEMS.map(item => <ProfileRow key={item.label} {...item} />)}
        </Section>

        <div className="h-20" />
      </div>
    )
  }

  // View mode
  return (
    <div className="min-h-screen" style={{ background: '#F8F5F6' }}>
      {/* Header */}
      <div className="bg-white px-4 pt-10 pb-4 sticky top-0 z-20 shadow-sm flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">マイプロフィール</h1>
        <button
          onClick={() => setMode('edit')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition"
          style={{ background: '#F5E6EA', color: '#7E2841' }}
        >
          編集
        </button>
      </div>

      {/* Profile hero */}
      <div className="bg-white px-4 py-6 mb-3">
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${DEMO_USER.color} flex items-center justify-center text-4xl shadow-md`}>
              {DEMO_USER.emoji}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <h2 className="text-xl font-bold text-gray-900">{DEMO_USER.name}</h2>
              <CheckCircle className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-gray-500 text-sm">{DEMO_USER.age}歳 ・{DEMO_USER.location}</p>
            <p className="text-gray-400 text-xs mt-0.5">{DEMO_USER.occupation}</p>
          </div>
        </div>
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

      {/* Profile completion */}
      <div className="bg-white px-4 py-4 mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">プロフィール完成度</span>
          <span className="text-sm font-bold" style={{ color: '#7E2841' }}>{completionPct}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{ width: `${completionPct}%`, background: 'linear-gradient(90deg, #7E2841, #A03558)' }} />
        </div>
        <p className="text-xs text-gray-400 mt-1.5">プロフィールを充実させるといいね！が増えます</p>
      </div>

      {/* Bio */}
      <div className="bg-white px-4 py-4 mb-3">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">自己紹介</h3>
        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{bio}</p>
      </div>

      {/* Interests */}
      <div className="bg-white px-4 py-4 mb-3">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">趣味・興味</h3>
        <div className="flex flex-wrap gap-2">
          {DEMO_USER.interests.map(i => (
            <span key={i} className="px-3 py-1.5 rounded-full text-sm font-medium" style={{ background: '#F5E6EA', color: '#7E2841' }}>{i}</span>
          ))}
        </div>
      </div>

      {/* Basic info summary */}
      <div className="bg-white px-4 py-4 mb-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">基本プロフ</h3>
          <button onClick={() => setMode('edit')} className="text-xs" style={{ color: '#7E2841' }}>編集 ›</button>
        </div>
        <div className="divide-y divide-gray-50">
          {BASIC_ITEMS.map(item => (
            <div key={item.label} className="flex items-center justify-between py-2.5">
              <span className="text-sm text-gray-500">{item.label}</span>
              <span className="text-sm font-medium" style={{ color: item.set ? '#374151' : '#9CA3AF' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-4" />
    </div>
  )
}
