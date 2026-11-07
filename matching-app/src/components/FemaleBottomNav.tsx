'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, ThumbsUp, Eye, MessageCircle, User } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/demo-female/discover', icon: Search, label: '探す' },
  { href: '/demo-female/matches', icon: ThumbsUp, label: 'いいね！' },
  { href: '/demo-female/search', icon: Eye, label: '足あと' },
  { href: '/demo-female/chat', icon: MessageCircle, label: 'メッセージ' },
  { href: '/demo-female/profile', icon: User, label: 'プロフィール' },
]

const BADGES: Record<string, number> = {
  '/demo-female/matches': 2,
  '/demo-female/chat': 1,
}

export default function FemaleBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50">
      <div className="max-w-md mx-auto flex items-center justify-around py-1.5">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          const badge = BADGES[href]
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 min-w-[56px]"
            >
              <div className="relative">
                <Icon
                  className="w-6 h-6 transition-colors"
                  style={{ color: isActive ? '#A84060' : '#9CA3AF' }}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {badge && !isActive && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-[#A84060] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {badge}
                  </span>
                )}
              </div>
              <span
                className="text-[10px] font-medium transition-colors"
                style={{ color: isActive ? '#A84060' : '#9CA3AF' }}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
