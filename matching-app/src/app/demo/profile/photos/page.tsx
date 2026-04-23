'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Camera, Plus } from 'lucide-react'
import Link from 'next/link'
import { storage, fileToBase64 } from '@/lib/storage'

const LABELS = ['メイン写真', '笑顔', '全身', '趣味', '食べ物', '旅行']

export default function ProfilePhotosPage() {
  const [photos, setPhotos] = useState<(string | null)[]>(Array(6).fill(null))
  const [activeIdx, setActiveIdx] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const saved = storage.getUserPhotos()
    if (saved.some(Boolean)) setPhotos(saved)
  }, [])

  const openPicker = (idx: number) => {
    setActiveIdx(idx)
    fileRef.current?.click()
  }

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    const base64 = await fileToBase64(file)
    setPhotos(prev => {
      const next = prev.map((p, i) => i === activeIdx ? base64 : p)
      storage.setUserPhotos(next)
      // sync main avatar from index 0
      if (activeIdx === 0) storage.setUserAvatar(base64)
      return next
    })
  }

  const removePhoto = (idx: number) => {
    setPhotos(prev => {
      const next = prev.map((p, i) => i === idx ? null : p)
      storage.setUserPhotos(next)
      if (idx === 0) storage.setUserAvatar('')
      return next
    })
  }

  const mainPhoto = photos[0]
  const subPhotos = photos.slice(1)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 pt-10 pb-3 sticky top-0 z-20 shadow-sm flex items-center gap-3">
        <Link href="/demo/profile" className="p-2 rounded-full hover:bg-gray-100 transition">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </Link>
        <h1 className="flex-1 text-base font-bold text-gray-900 text-center">プロフィール写真</h1>
        <p className="text-sm font-medium" style={{ color: '#7E2841' }}>
          {photos.filter(Boolean).length}/6枚
        </p>
      </div>

      {/* Main photo */}
      <div className="px-4 pt-5 pb-4">
        <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">メイン写真</p>
        <button
          onClick={() => openPicker(0)}
          className="relative w-full rounded-3xl overflow-hidden bg-gray-200 shadow-sm active:opacity-90 transition"
          style={{ aspectRatio: '3/4', maxHeight: 380 }}
        >
          {mainPhoto
            ? <img src={mainPhoto} alt="メイン" className="w-full h-full object-cover" />
            : <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-400">
                <Camera className="w-12 h-12" />
                <span className="text-sm">タップして追加</span>
              </div>
          }
          {/* Overlay badge */}
          <div
            className="absolute bottom-3 right-3 w-11 h-11 rounded-full flex items-center justify-center shadow-lg"
            style={{ background: '#7E2841' }}
          >
            {mainPhoto
              ? <Camera className="w-5 h-5 text-white" />
              : <Plus className="w-6 h-6 text-white" />
            }
          </div>
          {/* Remove button */}
          {mainPhoto && (
            <button
              onClick={e => { e.stopPropagation(); removePhoto(0) }}
              className="absolute top-3 right-3 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center"
            >
              <span className="text-white text-lg leading-none">×</span>
            </button>
          )}
        </button>
        <p className="text-[11px] text-gray-400 text-center mt-2">
          メイン写真はプロフィール一覧に表示されます
        </p>
      </div>

      {/* Sub photos */}
      <div className="px-4 pb-10">
        <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">サブ写真</p>
        <div className="grid grid-cols-3 gap-2.5">
          {subPhotos.map((photo, i) => {
            const idx = i + 1
            return (
              <button
                key={idx}
                onClick={() => openPicker(idx)}
                className="relative rounded-2xl overflow-hidden bg-gray-200 active:opacity-80 transition"
                style={{ aspectRatio: '1' }}
              >
                {photo
                  ? <img src={photo} alt={LABELS[idx]} className="w-full h-full object-cover" />
                  : <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-gray-400">
                      <Plus className="w-7 h-7" />
                      <span className="text-[11px]">{LABELS[idx]}</span>
                    </div>
                }
                {photo && (
                  <>
                    <div className="absolute bottom-0 left-0 right-0 px-1.5 py-1 bg-gradient-to-t from-black/50 to-transparent">
                      <span className="text-[10px] text-white font-medium">{LABELS[idx]}</span>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); removePhoto(idx) }}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center"
                    >
                      <span className="text-white text-sm leading-none">×</span>
                    </button>
                  </>
                )}
              </button>
            )
          })}
        </div>

        <p className="text-[11px] text-gray-400 text-center mt-4 leading-relaxed">
          写真を複数枚登録するとマッチング率が上がります 📸
        </p>
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  )
}
