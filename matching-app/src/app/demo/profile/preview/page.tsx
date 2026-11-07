'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, User, CheckCircle } from 'lucide-react'
import { storage } from '@/lib/storage'

export default function ProfilePreviewPage() {
  const router = useRouter()
  const [photo, setPhoto] = useState<string | null>(null)
  const [photos, setPhotos] = useState<(string | null)[]>(Array(6).fill(null))
  const [bio, setBio] = useState('')
  const [profile, setProfile] = useState<Record<string, string | string[]>>({})

  useEffect(() => {
    setPhoto(storage.getUserAvatar())
    setPhotos(storage.getUserPhotos())
    setBio(storage.getUserBio(''))
    const p = storage.getUserProfile()
    if (p) setProfile(p)
  }, [])

  const nickname = (profile.nickname as string) || 'ニックネーム未設定'
  const height = profile.height ? `${profile.height}cm` : null
  const bodyType = profile.bodyType as string | undefined
  const smoking = profile.smoking as string | undefined
  const alcohol = profile.alcohol as string | undefined
  const holiday = profile.holiday as string | undefined
  const jobType = profile.jobType as string | undefined
  const education = profile.education as string | undefined
  const location = profile.location as string | undefined
  const personality = profile.personality as string[] | undefined
  const hobbies = profile.hobbies as string[] | undefined

  const fields: [string, string][] = [
    ['身長', height ?? ''],
    ['体型', bodyType ?? ''],
    ['タバコ', smoking ?? ''],
    ['お酒', alcohol ?? ''],
    ['休日', holiday ?? ''],
    ['職種', jobType ?? ''],
    ['学歴', education ?? ''],
  ].filter(([, v]) => !!v) as [string, string][]

  const subPhotos = photos.slice(1).filter(Boolean) as string[]

  return (
    <div className="min-h-screen bg-white pb-28">
      {/* Preview banner */}
      <div className="sticky top-0 z-20 text-center py-2 text-xs font-bold text-white" style={{ background: '#5BC0C0' }}>
        プレビュー — 相手にはこのように表示されます
      </div>

      {/* Back button overlay */}
      <div className="relative">
        {/* Hero photo */}
        <div className="relative bg-gray-200" style={{ aspectRatio: '3/4' }}>
          {photo
            ? <img src={photo} className="w-full h-full object-cover" alt="プロフィール" />
            : <div className="w-full h-full flex items-center justify-center">
                <User className="w-32 h-32 text-gray-300" />
              </div>
          }
          <button
            onClick={() => router.back()}
            className="absolute top-4 left-4 w-9 h-9 bg-black/30 rounded-full flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Name & basic info */}
      <div className="px-4 pt-4 pb-3 bg-white">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl font-bold text-gray-900">{nickname}</h1>
          {location && (
            <span className="text-lg text-gray-500">{(location as string).replace(/[都府県]$/, '')}</span>
          )}
          <CheckCircle className="w-5 h-5 text-blue-500" />
        </div>
        <p className="mt-1.5 text-sm text-gray-400">👍 0 いいね！</p>
      </div>

      {/* Personality / hobby tags */}
      {((personality?.length ?? 0) > 0 || (hobbies?.length ?? 0) > 0) && (
        <div className="px-4 pb-4 bg-white flex flex-wrap gap-2">
          {personality?.map(tag => (
            <span key={tag} className="px-3 py-1.5 rounded-full border border-gray-300 text-sm text-gray-700">{tag}</span>
          ))}
          {hobbies?.map(tag => (
            <span key={tag} className="px-3 py-1.5 rounded-full border border-gray-300 text-sm text-gray-700">{tag}</span>
          ))}
        </div>
      )}

      {/* Bio */}
      {bio && (
        <div className="border-t border-gray-100 mt-1">
          <div className="px-4 py-3" style={{ background: '#F9F9F9' }}>
            <h2 className="text-sm font-bold text-gray-700">自己紹介文</h2>
          </div>
          <div className="px-4 py-4 bg-white">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{bio}</p>
          </div>
        </div>
      )}

      {/* Profile fields */}
      {fields.length > 0 && (
        <div className="border-t border-gray-100 mt-1">
          <div className="px-4 py-3" style={{ background: '#F9F9F9' }}>
            <h2 className="text-sm font-bold text-gray-700">外見・内面</h2>
          </div>
          <div className="bg-white divide-y divide-gray-50">
            {fields.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-gray-400">{label}</span>
                <span className="text-sm text-gray-800">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub photos */}
      {subPhotos.length > 0 && (
        <div className="border-t border-gray-100 mt-1">
          <div className="px-4 py-3" style={{ background: '#F9F9F9' }}>
            <h2 className="text-sm font-bold text-gray-700">写真</h2>
          </div>
          <div className="px-4 py-4 grid grid-cols-3 gap-2">
            {subPhotos.map((p, i) => (
              <div key={i} className="rounded-xl overflow-hidden" style={{ aspectRatio: '1' }}>
                <img src={p} className="w-full h-full object-cover" alt="" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom: edit button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4">
        <button
          onClick={() => router.back()}
          className="w-full py-3.5 rounded-2xl font-bold text-white text-base"
          style={{ background: 'linear-gradient(135deg, #5BC0C0, #3AADAD)' }}
        >
          編集に戻る
        </button>
      </div>
    </div>
  )
}
