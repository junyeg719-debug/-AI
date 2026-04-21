'use client'

import { useState } from 'react'
import { ArrowLeft, Check } from 'lucide-react'
import Link from 'next/link'

const PLANS = [
  { months: 12, savings: '34,000', originalPrice: '27,800', price: '24,800', perMonth: '2,067', recommended: false },
  { months: 6,  savings: '13,600', originalPrice: '17,800', price: '15,800', perMonth: '2,633', recommended: true },
  { months: 3,  savings: '3,900',  originalPrice: '11,800', price: '10,800', perMonth: '3,600', recommended: false },
]

const FREE_FEATURES = [
  { label: 'メッセージ開封', value: '✕', sub: '' },
  { label: 'メッセージ送信', value: '一通目まで', sub: '※お相手に対する返信はできません' },
  { label: 'いいね！数', value: '非表示', sub: '' },
  { label: '足あと閲覧', value: '3日間', sub: '' },
  { label: '検索条件', value: '基本のみ', sub: '' },
]

const PAID_FEATURES = [
  { label: 'メッセージ開封', value: '無制限', sub: '' },
  { label: 'メッセージ送信', value: '無制限', sub: 'メッセージのやりとりが何通でもできます' },
  { label: 'いいね！数', value: '表示', sub: '' },
  { label: '足あと閲覧', value: '無制限', sub: '' },
  { label: '検索条件', value: '詳細設定', sub: '' },
]

export default function MembershipPlanPage() {
  const [activeTab, setActiveTab] = useState<'free' | 'paid'>('paid')

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 flex items-center border-b border-gray-100 sticky top-0 z-10">
        <Link href="/demo/membership/status" className="p-1 mr-3">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </Link>
        <h1 className="text-base font-bold text-gray-900 flex-1 text-center pr-8">有料会員</h1>
      </div>

      {/* Sale banner */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1A8FE3 0%, #0D6BB5 100%)', minHeight: 160 }}>
        {/* Pennant flags */}
        <div className="flex justify-center gap-0 pt-3 px-4">
          {['#FF4444', '#FF9500', '#FFD700', '#4CAF50', '#2196F3', '#9C27B0', '#FF4444', '#FF9500', '#FFD700', '#4CAF50'].map((c, i) => (
            <div key={i} style={{
              width: 0, height: 0,
              borderLeft: '16px solid transparent',
              borderRight: '16px solid transparent',
              borderTop: `26px solid ${c}`,
              margin: '0 1px',
              opacity: 0.9,
            }} />
          ))}
        </div>

        {/* Badge */}
        <div className="absolute top-4 left-4 w-[72px] h-[72px] rounded-full flex flex-col items-center justify-center" style={{ background: '#FFD700' }}>
          <span className="text-[9px] font-bold text-gray-800 leading-tight">最安</span>
          <span className="text-lg font-black text-gray-800 leading-tight">2,067</span>
          <span className="text-[9px] font-bold text-gray-800 leading-tight">円/月</span>
          <span className="text-[8px] text-gray-600 leading-tight text-center">※12ヶ月</span>
          <span className="text-[8px] text-gray-600 leading-tight">プランの場合</span>
        </div>

        {/* Main text */}
        <div className="pt-2 pb-6 text-center">
          <p className="font-black text-xl leading-tight" style={{ color: '#FFD700' }}>最大3,000円OFF</p>
          <p className="font-black text-3xl text-white leading-tight mt-0.5">リスタート応援</p>
          <p className="font-black text-4xl text-white leading-none">SALE</p>
        </div>
      </div>

      {/* Campaign period */}
      <div className="px-4 pt-5 pb-4 bg-white">
        <p className="text-sm font-bold text-gray-800 mb-2">＜キャンペーン期間＞</p>
        <p className="text-xs text-gray-600">2026年04月19日00時00分 〜 2026年04月26日00時00分</p>

        <p className="text-sm font-bold text-gray-800 mt-4 mb-2">＜注意事項＞</p>
        <p className="text-xs text-gray-500 leading-relaxed">
          ・本キャンペーンはAppleID決済でのみ有効です。{'\n\n'}
          ・契約期間の自動更新が設定されます。契約期間満了後、お申し込み時と同じプラン・金額・期間で自動的に更新されます。{'\n\n'}
          ・本キャンペーンと他のキャンペーンが同時に実施されている場合があります。
        </p>
      </div>

      {/* Stats */}
      <div className="mx-4 mb-4 px-4 py-4 rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            <div className="w-full h-full bg-gradient-to-br from-pink-200 to-pink-300" />
          </div>
          <p className="text-sm text-gray-700 flex-1">
            Omiaiでお付き合いに発展した方は
            <span className="font-black text-base" style={{ color: '#E8348B' }}>4〜5ヶ月間</span>
            利用しています
          </p>
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-300" />
          </div>
        </div>
        <p className="text-center text-sm text-gray-700">
          はじめての方は
          <span className="font-black text-lg" style={{ color: '#E8348B' }}>6ヶ月プラン</span>
          がおすすめ
          <span className="inline-block ml-1 px-2 py-0.5 rounded text-[10px] font-bold" style={{ background: '#FFF4B0', color: '#B8860B' }}>おすすめ</span>
        </p>
        <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">
          ※2023年6月〜2023年11月までにOmiaiを退会した男性ユーザーを対象としたアンケート
        </p>
      </div>

      {/* Plan link */}
      <div className="px-4 mb-3">
        <button className="text-sm flex items-center gap-1" style={{ color: '#E8348B' }}>
          <span>▶</span>
          <span>有料会員プランの購入について</span>
        </button>
      </div>

      {/* Plan cards */}
      {PLANS.map(plan => (
        <div key={plan.months} className="mx-4 mb-3 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <div className="flex">
            {/* Left: orange gradient */}
            <div
              className="w-32 flex flex-col items-center justify-center py-5 px-3 flex-shrink-0"
              style={{ background: 'linear-gradient(160deg, #FFA53A 0%, #FF4B34 100%)' }}
            >
              <div className="flex items-baseline gap-0.5">
                <span className="text-white font-black" style={{ fontSize: 40, lineHeight: 1 }}>{plan.months}</span>
                <span className="text-white text-base font-bold">ヶ月</span>
              </div>
              <span className="text-white text-sm font-bold">プラン</span>
              <div className="mt-2 border border-white/60 rounded-full px-2 py-0.5">
                <span className="text-white text-[10px] font-medium">{plan.savings}円おトク</span>
              </div>
            </div>

            {/* Right: price */}
            <div className="flex-1 bg-white flex flex-col justify-center px-4 py-4">
              <p className="text-gray-400 text-xs">
                通常価格{' '}
                <span className="line-through">{plan.originalPrice}円</span>
                <span className="text-[9px]">（税込）</span>
              </p>
              <p className="font-black text-gray-900 mt-0.5" style={{ fontSize: 28, lineHeight: 1.1 }}>
                {plan.price}
                <span className="text-sm font-bold">円</span>
              </p>
              <p className="text-[10px] text-gray-400 mb-2">（税込）</p>
              <div
                className="rounded-full py-1.5 px-3 text-center text-white text-xs font-bold"
                style={{ background: '#FF8C3A' }}
              >
                {plan.perMonth}円/月
              </div>
            </div>
          </div>

          {plan.recommended && (
            <div className="py-2 text-center text-sm font-bold" style={{ background: '#FFFBE6', color: '#D4970A' }}>
              はじめての方におすすめ！
            </div>
          )}
        </div>
      ))}

      {/* 1-month plan (outside sale) */}
      <div className="mx-4 mb-4 flex items-center gap-3">
        <span className="text-xs text-gray-400 border border-gray-300 rounded px-1.5 py-0.5 flex-shrink-0">SALE対象外</span>
        <p className="text-sm font-bold text-gray-700">
          1ヶ月プラン{' '}
          <span className="font-black text-base" style={{ color: '#E8348B' }}>4,900円</span>
          <span className="text-xs text-gray-500">（税込）</span>
        </p>
      </div>

      {/* Mission banner */}
      <div className="mx-4 mb-6 rounded-2xl overflow-hidden" style={{ background: '#FFFDE7', border: '1px solid #FFE082' }}>
        <div className="px-4 py-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2 py-0.5 rounded-full border border-gray-300 text-gray-500 flex-shrink-0">ミッションクリアで</span>
            <p className="font-black text-base text-gray-800">メッセージし放題をGET</p>
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-gray-500 leading-relaxed flex-1">
              無料サービス会員登録などのミッションを達成すると、メッセージし放題が利用できます
            </p>
            <button
              className="flex-shrink-0 px-3 py-2 rounded-full text-xs font-bold text-white"
              style={{ background: '#E8348B' }}
            >
              詳しくはこちら
            </button>
          </div>
        </div>
      </div>

      {/* Features comparison */}
      <div className="mx-4 mb-8">
        <h2 className="text-base font-black text-gray-900 mb-4">有料会員でできること</h2>

        {/* Tab bar */}
        <div className="flex rounded-none overflow-hidden mb-4 border-b-2 border-gray-200">
          <button
            className="flex-1 py-2.5 text-sm font-bold transition"
            style={{ color: activeTab === 'free' ? '#E8348B' : '#9CA3AF', borderBottom: activeTab === 'free' ? '2px solid #E8348B' : '2px solid transparent' }}
            onClick={() => setActiveTab('free')}
          >
            無料会員
          </button>
          <button
            className="flex-1 py-2.5 text-sm font-bold transition"
            style={{ color: activeTab === 'paid' ? '#E8348B' : '#9CA3AF', borderBottom: activeTab === 'paid' ? '2px solid #E8348B' : '2px solid transparent' }}
            onClick={() => setActiveTab('paid')}
          >
            有料会員
          </button>
        </div>

        {/* Feature rows */}
        <div className="border border-gray-100 rounded-2xl overflow-hidden">
          {FREE_FEATURES.map((feat, i) => {
            const paidFeat = PAID_FEATURES[i]
            return (
              <div key={feat.label} className={`flex border-b border-gray-50 last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                <div className="w-32 px-3 py-3 flex-shrink-0 flex items-center">
                  <span className="text-xs text-gray-500 font-medium">{feat.label}</span>
                </div>
                <div className="flex-1 px-3 py-3 flex flex-col justify-center">
                  {activeTab === 'free' ? (
                    <>
                      <p className="text-sm font-bold text-gray-400">{feat.value}</p>
                      {feat.sub && <p className="text-[10px] text-gray-400 mt-0.5">{feat.sub}</p>}
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-bold" style={{ color: '#E8348B' }}>{paidFeat.value}</p>
                      {paidFeat.sub && (
                        <div className="mt-1 px-2 py-1 rounded-lg text-[10px] font-medium" style={{ background: '#FFFDE7', color: '#B8860B' }}>
                          {paidFeat.sub}
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className="w-8 flex items-center justify-center">
                  {activeTab === 'paid'
                    ? <Check className="w-4 h-4" style={{ color: '#E8348B' }} />
                    : <span className="text-gray-300 text-sm">✕</span>
                  }
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <Link
          href="/demo/membership/plan"
          className="mt-6 block py-4 rounded-2xl text-center text-white font-black text-base shadow-md active:scale-[0.98] transition"
          style={{ background: 'linear-gradient(135deg, #E8348B, #C0256E)' }}
        >
          有料プランに登録する
        </Link>
      </div>
    </div>
  )
}
