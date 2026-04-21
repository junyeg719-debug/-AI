'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, MoreHorizontal, Heart, User, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { type DemoProfile } from '@/lib/demo-data'

export default function ProfileDetailClient({ profile }: { profile: DemoProfile }) {
  const [liked, setLiked] = useState(false)
  const [showStickyHeader, setShowStickyHeader] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      const heroBottom = heroRef.current?.getBoundingClientRect().bottom ?? 0
      setShowStickyHeader(heroBottom < 50)
    }
    el.addEventListener('scroll', onScroll)
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  const FIELDS: [string, string][] = [
    ['身長', profile.height ? `${profile.height}cm` : '−'],
    ['体型', profile.bodyType || '−'],
    ['タバコ', profile.smoking || '−'],
    ['お酒', profile.drinking || '−'],
    ['休日', profile.holiday || '−'],
    ['職業', profile.occupation || '−'],
  ].filter(([, v]) => v !== '−') as [string, string][]

  return (
    <div ref={scrollRef} className="fixed inset-0 z-[100] bg-white overflow-y-auto">

      {/* Sticky header (scrolled) */}
      {showStickyHeader && (
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 pt-10 pb-3 flex items-center gap-3">
          <Link href="/demo/discover" className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
            {profile.avatar_url
              ? <img src={profile.avatar_url} className="w-full h-full object-cover" alt="" />
              : <User className="w-5 h-5 text-gray-400" />
            }
          </div>
          <span className="font-bold text-gray-900 flex-1">{profile.name}</span>
          <button className="p-1"><MoreHorizontal className="w-5 h-5 text-gray-500" /></button>
        </div>
      )}

      {/* Hero photo */}
      <div ref={heroRef} className="relative bg-gray-200" style={{ aspectRatio: '3/4' }}>
        {profile.avatar_url
          ? <img src={profile.avatar_url} className="w-full h-full object-cover" alt="" />
          : <div className="w-full h-full flex items-center justify-center">
              <User className="w-32 h-32 text-gray-300" />
            </div>
        }
        <Link href="/demo/discover" className="absolute top-12 left-4 w-9 h-9 bg-black/30 rounded-full flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <button className="absolute top-12 right-4 w-9 h-9 bg-black/30 rounded-full flex items-center justify-center">
          <MoreHorizontal className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Name & like */}
      <div className="px-4 pb-3 pt-4 bg-white">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
          <span className="text-lg text-gray-500">
            {profile.age}歳 / {profile.location.replace('県','').replace('府','').replace('都','')}
          </span>
          {profile.isVerified && <CheckCircle className="w-5 h-5 text-blue-500" />}
        </div>
        <button
          onClick={() => setLiked(v => !v)}
          className="mt-2 flex items-center gap-1.5 text-sm font-medium transition"
          style={{ color: liked ? '#7E2841' : '#9CA3AF' }}
        >
          <Heart className="w-4 h-4" fill={liked ? '#7E2841' : 'none'} style={{ color: liked ? '#7E2841' : '#9CA3AF' }} />
          <span>いいね！：{liked ? profile.likeCount + 1 : profile.likeCount}</span>
        </button>
      </div>

      {/* Interest tags */}
      <div className="px-4 pb-5 bg-white flex flex-wrap gap-2">
        {profile.interests.map(tag => (
          <span key={tag} className="px-3 py-1.5 rounded-full border border-gray-300 text-sm text-gray-700">
            {tag}
          </span>
        ))}
      </div>

      {/* Bio */}
      <div className="border-t border-gray-100 mt-1">
        <div className="px-4 py-3" style={{ background: '#F9F9F9' }}>
          <h2 className="text-sm font-bold text-gray-700">自己紹介文</h2>
        </div>
        <div className="px-4 py-4 bg-white">
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{profile.bio}</p>
        </div>
      </div>

      {/* Profile fields */}
      <div className="border-t border-gray-100 mt-1">
        <div className="px-4 py-3" style={{ background: '#F9F9F9' }}>
          <h2 className="text-sm font-bold text-gray-700">外見・内面</h2>
        </div>
        <div className="bg-white divide-y divide-gray-50">
          {FIELDS.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-gray-400">{label}</span>
              <span className="text-sm text-gray-800">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-12" />
    </div>
  )
}
