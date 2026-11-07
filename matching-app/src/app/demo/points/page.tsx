'use client'

import { useState } from 'react'
import { X, ChevronDown, ChevronUp } from 'lucide-react'
import { useRouter } from 'next/navigation'

const FIRST_PLANS = [
  { points: 120, originalPrice: '12,800', price: '7,000', perPoint: 58, badge: 'お得NO.1', color: '#FF9A00' },
  { points: 60,  originalPrice: '7,800',  price: '4,400', perPoint: 73, badge: null, color: '#FFBB00' },
  { points: 21,  originalPrice: '2,900',  price: '1,800', perPoint: 86, badge: null, color: '#FFCC33' },
]

const REGULAR_PLANS = [
  { points: 500, price: '36,800' },
  { points: 350, price: '29,800' },
  { points: 200, price: '19,800' },
]

const EXTRA_PLANS = [
  { points: 100, price: '9,800' },
  { points: 50,  price: '4,900' },
  { points: 10,  price: '1,200' },
]

const POINT_USES = [
  {
    num: 1,
    title: 'いいね！が送れます',
    desc: '残いいね！数がなくても、1ポイント＝1いいね！として利用できます。',
    cost: '1P',
    badge: { label: '👍 いいね！', bg: '#F4849A', text: 'white' },
  },
  {
    num: 2,
    title: 'スペシャルいいね！が送れます',
    desc: '5ポイント利用で、いいね！にメッセージを添えて送ることができます。',
    note: '※別途お相手へのいいね！数が必要です',
    cost: '5P',
    badge: { label: '✉️ スペシャル', bg: '#A0C878', text: 'white' },
  },
  {
    num: 3,
    title: 'みてね！が送れます',
    desc: '3ポイント利用で、いいね！を送ったお相手のおすすめ相手を閲覧することができます。',
    cost: '3P',
    badge: { label: '∞ みてね！', bg: '#FFB800', text: 'white' },
  },
  {
    num: 4,
    title: 'ハイライト表示が利用できます',
    desc: '2〜8ポイント利用で、あなたとマッチングしやすいお相手のおすすめ枠に優先的に載せることができます。',
    note: '※現在、ブラウザ版ではご利用いただけません。アプリ版のみのご提供となります。',
    cost: '2〜8P',
    badge: null,
  },
  {
    num: 5,
    title: 'いいね！が多い順・ログイン順のお相手が閲覧できます',
    desc: '9ポイント利用で、15分間いいね！が多い順・ログイン順のユーザーを閲覧することができます。',
    cost: '9P',
    badge: null,
  },
  {
    num: 6,
    title: '既読機能が利用できます',
    desc: 'ポイントを使ってメッセージの既読状況を確認することができます。',
    cost: '1P',
    badge: null,
  },
]

export default function PointsPage() {
  const router = useRouter()
  const [showExtra, setShowExtra] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 flex items-center border-b border-gray-100 sticky top-0 z-10">
        <button onClick={() => router.back()} className="p-1 mr-3">
          <X className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-base font-bold text-gray-900 flex-1 text-center pr-8">魅力マッチポイント</h1>
      </div>

      {/* Remaining points */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <span className="text-sm text-gray-600">残魅力マッチポイント数</span>
        <span className="text-base font-bold text-gray-800 flex items-center gap-1">
          <span className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center text-white text-[10px] font-black">P</span>
          0
        </span>
      </div>

      {/* Sale banner */}
      <div className="mx-0" style={{ background: 'linear-gradient(135deg, #2BBFAA, #1DA896)' }}>
        <div className="px-6 py-8 text-center">
          <p className="text-white font-black text-2xl leading-tight">魅力マッチポイント</p>
          <p className="text-white font-black leading-none" style={{ fontSize: 48 }}>初回最大<span style={{ fontSize: 56 }}>45</span>%</p>
          <p className="text-white font-black text-3xl leading-tight -mt-1">OFF</p>
          <div className="mt-3 border-2 border-white rounded px-3 py-1.5 inline-block">
            <p className="text-white font-bold text-sm">ポイント購入したことのない会員様限定</p>
          </div>
          <p className="text-white/70 text-xs mt-2">※対象プランに限る</p>
        </div>
      </div>

      {/* First-time discount plans */}
      <div className="px-4 pt-5 pb-2">
        <h2 className="text-sm font-bold text-gray-800 mb-3">初回割引対象プラン</h2>

        <div className="flex flex-col gap-3">
          {FIRST_PLANS.map(plan => (
            <button
              key={plan.points}
              className="relative flex rounded-2xl overflow-hidden border border-gray-100 shadow-sm active:scale-[0.98] transition text-left"
            >
              {plan.badge && (
                <div
                  className="absolute -top-px -left-px px-2.5 py-0.5 rounded-br-xl text-white text-[10px] font-bold z-10"
                  style={{ background: plan.color }}
                >
                  {plan.badge}
                </div>
              )}
              {/* Left: points */}
              <div
                className="w-28 flex flex-col items-center justify-center py-5 flex-shrink-0"
                style={{ background: plan.color }}
              >
                <span className="text-white font-black text-3xl leading-none">{plan.points}</span>
                <span className="text-white text-sm font-bold mt-0.5">ポイント</span>
              </div>
              {/* Right: price */}
              <div className="flex-1 bg-white flex flex-col justify-center px-4 py-3">
                <p className="text-gray-400 text-xs">
                  通常価格{' '}
                  <span className="line-through">{plan.originalPrice}円</span>
                  {' '}▶
                  {' '}
                  <span className="font-black text-lg" style={{ color: '#E8348B' }}>{plan.price}円</span>
                  <span className="text-[10px] text-gray-400">（税込）</span>
                </p>
                <div
                  className="mt-2 rounded-full py-1 px-3 text-xs font-bold text-center"
                  style={{ background: '#FFF0F5', color: '#E8348B' }}
                >
                  1ポイントあたり{plan.perPoint}円
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Regular plans */}
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-sm font-bold text-gray-800 mb-3">その他の通常プラン</h2>
        <div className="flex flex-col gap-3">
          {REGULAR_PLANS.map(plan => (
            <button
              key={plan.points}
              className="flex rounded-2xl overflow-hidden border border-gray-100 shadow-sm active:scale-[0.98] transition text-left"
            >
              <div className="w-28 flex flex-col items-center justify-center py-5 flex-shrink-0" style={{ background: 'linear-gradient(135deg, #B0B0B0, #888888)' }}>
                <span className="text-white font-black text-3xl leading-none">{plan.points}</span>
                <span className="text-white text-sm font-bold mt-0.5">ポイント</span>
              </div>
              <div className="flex-1 bg-white flex items-center px-4">
                <span className="font-black text-gray-900 text-2xl">{plan.price}</span>
                <span className="text-xs text-gray-400 ml-1">（税込）</span>
              </div>
            </button>
          ))}
        </div>

        {/* Show more toggle */}
        <button
          onClick={() => setShowExtra(v => !v)}
          className="mt-3 w-full py-3 rounded-full border border-gray-300 flex items-center justify-center gap-2 text-sm text-gray-600 font-medium active:bg-gray-50 transition"
        >
          <span>その他のポイントを見る</span>
          {showExtra ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showExtra && (
          <div className="flex flex-col gap-3 mt-3">
            {EXTRA_PLANS.map(plan => (
              <button
                key={plan.points}
                className="flex rounded-2xl overflow-hidden border border-gray-100 shadow-sm active:scale-[0.98] transition text-left"
              >
                <div className="w-28 flex flex-col items-center justify-center py-5 flex-shrink-0" style={{ background: 'linear-gradient(135deg, #B0B0B0, #888888)' }}>
                  <span className="text-white font-black text-3xl leading-none">{plan.points}</span>
                  <span className="text-white text-sm font-bold mt-0.5">ポイント</span>
                </div>
                <div className="flex-1 bg-white flex items-center px-4">
                  <span className="font-black text-gray-900 text-2xl">{plan.price}</span>
                  <span className="text-xs text-gray-400 ml-1">（税込）</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Notes */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-xs text-gray-400 leading-relaxed">
          ※初回割引対象は21ポイント、60ポイント、120ポイントのプランのみとなります。
        </p>
        <p className="text-xs text-gray-400 leading-relaxed mt-2">
          ※初回割引対象プランご購入対象者様は、プレミアムパックご購入特典の魅力マッチポイント1.5倍増量は適用対象外となります。
        </p>
      </div>

      {/* Mission banner */}
      <div className="mx-4 mt-4 mb-6 rounded-2xl overflow-hidden" style={{ background: '#FFFDE7', border: '1px solid #FFE082' }}>
        <div className="px-4 py-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2 py-0.5 rounded-full border border-gray-300 text-gray-500 flex-shrink-0">ミッションクリアで</span>
            <p className="font-black text-base text-gray-800">無料でいいね！をGET</p>
          </div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-gray-500 leading-relaxed flex-1">
              無料サービス会員登録などのミッションを達成するだけで、いいね！が獲得できます
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

      {/* Point uses */}
      <div className="px-4 pb-8">
        <h2 className="text-base font-black text-gray-900 mb-4">魅力マッチポイントでできること</h2>

        <div className="flex flex-col gap-3">
          {POINT_USES.map(item => (
            <div key={item.num} className="rounded-2xl overflow-hidden border border-pink-100" style={{ background: '#FFF5F8' }}>
              {/* Header */}
              <div className="px-4 py-3 flex items-center gap-2" style={{ background: '#FFE8EF' }}>
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                  style={{ background: '#E8348B' }}
                >
                  {item.num}
                </span>
                <span className="text-sm font-bold text-gray-800">{item.title}</span>
              </div>

              {/* Body */}
              <div className="px-4 py-4">
                {/* Coin icon + badge illustration */}
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="flex items-end">
                    {Array.from({ length: Math.min(item.num, 3) }).map((_, i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-base shadow-sm"
                        style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500)', marginLeft: i > 0 ? -8 : 0 }}
                      >
                        P
                      </div>
                    ))}
                  </div>
                  <span className="text-2xl text-gray-300 font-bold">=</span>
                  {/* Profile placeholder */}
                  <div className="relative">
                    <div className="w-14 h-16 rounded-lg bg-gray-200 flex items-center justify-center border border-gray-200">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="8" r="4" fill="#9CA3AF"/>
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="#9CA3AF"/>
                      </svg>
                    </div>
                    {item.badge && (
                      <div
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap"
                        style={{ background: item.badge.bg, color: item.badge.text }}
                      >
                        {item.badge.label}
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                {item.note && (
                  <p className="text-[11px] text-gray-400 mt-1">{item.note}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
