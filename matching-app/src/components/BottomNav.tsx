'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Flame, MessageCircle, Heart, Search, User } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/discover', icon: Flame, label: '探す' },
  { href: '/search', icon: Search, label: '検索' },
  { href: '/matches', icon: Heart, label: 'マッチ' },
  { href: '/chat', icon: MessageCircle, label: 'チャット' },
  { href: '/profile', icon: User, label: 'プロフィール' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 safe-area-pb z-50">
      <div className="max-w-md mx-auto flex items-center justify-around py-2">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-0.5 px-4 py-1 group"
            >
              <div
                className={`p-2 rounded-xl transition-all ${
                  isActive ? 'bg-rose-50' : 'group-hover:bg-gray-50'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive
                      ? 'text-rose-500'
                      : 'text-gray-400 group-hover:text-gray-600'
                  } ${href === '/discover' && isActive ? 'fill-rose-500' : ''}`}
                />
              </div>
              <span
                className={`text-xs font-medium transition-colors ${
                  isActive ? 'text-rose-500' : 'text-gray-400'
                }`}
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
