'use client'

import Link from 'next/link'
import { X, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function MembershipStatusPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 pt-12 pb-4 flex items-center border-b border-gray-100">
        <button onClick={() => router.back()} className="p-1 mr-3">
          <X className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-base font-bold text-gray-900 flex-1 text-center pr-8">会員ステータス</h1>
      </div>

      {/* 会員ステータス section */}
      <Section
        title="会員ステータス"
        content={<p className="text-sm text-gray-700 text-center py-1">無料会員<br />（本人確認済）</p>}
        footer={<HistoryLink />}
      />
      <PinkButton href="/demo/membership/plan" label="有料プラン購入に進む" />

      {/* プレミアムパック section */}
      <Section
        title="プレミアムパック"
        content={<p className="text-sm text-gray-700 text-center py-1">利用していません</p>}
        footer={<HistoryLink />}
      />
      <PinkButton label="プレミアムパック購入に進む" />

      {/* 残いいね！数 section */}
      <Section
        title="残いいね！数"
        content={
          <div className="text-center py-1">
            <p className="text-base font-bold text-gray-800">236いいね！</p>
            <p className="text-xs text-gray-400 mt-1">2026/05/14に月々の「いいね！」が回復します</p>
          </div>
        }
      />

      {/* Omiaiポイント section */}
      <Section
        title="Omiaiポイント"
        content={<p className="text-sm text-gray-700 text-center py-1">0 P</p>}
        footer={<PointHistoryLink />}
      />

      {/* PCで購入したポイント section */}
      <Section
        title="PCで購入したポイント"
        content={<p className="text-sm text-gray-700 text-center py-1">0 P</p>}
        footer={<PointHistoryLink />}
      />
      <PinkButton label="ポイント購入に進む" />

      {/* Bottom comparison link */}
      <div className="mt-5 mb-8 px-4">
        <button className="flex items-center gap-1 text-xs text-gray-500">
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <span>会員ステータスごとに使える機能の比較はこちらから</span>
        </button>
      </div>
    </div>
  )
}

function Section({
  title,
  content,
  footer,
}: {
  title: string
  content: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <div className="mt-3">
      <div className="px-4 py-2.5 text-center" style={{ background: '#EBF5FB' }}>
        <p className="text-sm font-bold" style={{ color: '#1A73C6' }}>{title}</p>
      </div>
      <div className="bg-white px-4 py-3">{content}</div>
      {footer && <div className="bg-white px-4 pb-2">{footer}</div>}
    </div>
  )
}

function HistoryLink() {
  return (
    <div className="flex justify-end">
      <button className="text-xs" style={{ color: '#1A73C6' }}>ご利用履歴</button>
    </div>
  )
}

function PointHistoryLink() {
  return (
    <div className="flex justify-end">
      <button className="text-xs" style={{ color: '#1A73C6' }}>ポイント残高内訳/ご利用履歴</button>
    </div>
  )
}

function PinkButton({ label, href }: { label: string; href?: string }) {
  const cls = "mx-4 mt-2 mb-1 block py-3.5 rounded-xl text-center text-white font-bold text-sm active:opacity-80 transition"
  const style = { background: 'linear-gradient(135deg, #F4849A, #EF6B8A)' }
  if (href) {
    return <Link href={href} className={cls} style={style}>{label}</Link>
  }
  return <button className={cls} style={style}>{label}</button>
}
