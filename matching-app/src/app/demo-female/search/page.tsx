'use client'

import { Eye } from 'lucide-react'
import { MALE_CANDIDATES } from '@/lib/female-demo-data'

export default function FemaleSearchPage() {
  return (
    <div className="min-h-screen">
      <div className="bg-white px-4 pt-10 pb-4 sticky top-0 z-20 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">足あと</h1>
        <p className="text-sm mt-0.5 text-gray-400">あなたのプロフィールを見た方</p>
      </div>

      <div className="px-4 mt-4">
        <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">最近見た方</p>
        <div className="bg-white rounded-2xl divide-y divide-gray-50 shadow-sm">
          {MALE_CANDIDATES.filter(p => p.isOnline).map(profile => (
            <div key={profile.id} className="flex items-center gap-3 px-4 py-3.5">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${profile.color} flex items-center justify-center text-xl flex-shrink-0`}>
                {profile.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900">{profile.name}　<span className="font-normal text-xs text-gray-400">{profile.age}歳 {profile.location.replace(/[都府県]$/, '')}</span></p>
                <p className="text-xs text-gray-400 truncate">{profile.occupation}</p>
              </div>
              <span className="text-[11px] text-gray-400">今日</span>
            </div>
          ))}
          {MALE_CANDIDATES.filter(p => !p.isOnline).slice(0, 3).map(profile => (
            <div key={profile.id} className="flex items-center gap-3 px-4 py-3.5 opacity-60">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${profile.color} flex items-center justify-center text-xl flex-shrink-0`}>
                {profile.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900">{profile.name}　<span className="font-normal text-xs text-gray-400">{profile.age}歳 {profile.location.replace(/[都府県]$/, '')}</span></p>
                <p className="text-xs text-gray-400 truncate">{profile.occupation}</p>
              </div>
              <span className="text-[11px] text-gray-400">3日前</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center py-8 text-gray-400">
        <Eye className="w-8 h-8 mb-2 text-gray-200" />
        <p className="text-sm">足あとはここに表示されます</p>
      </div>
    </div>
  )
}
