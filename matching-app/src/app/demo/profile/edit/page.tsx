'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronRight, X, Check, Plus, Pencil, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { storage, fileToBase64 } from '@/lib/storage'

type FieldType = 'select' | 'multiselect' | 'text' | 'number'
type AnyField = {
  key: string; label: string; type: FieldType
  options?: string[]; placeholder?: string; min?: number; max?: number; unit?: string
}

const PREFS = ['北海道','青森','岩手','宮城','秋田','山形','福島','茨城','栃木','群馬','埼玉','千葉','東京','神奈川','新潟','富山','石川','福井','山梨','長野','岐阜','静岡','愛知','三重','滋賀','京都','大阪','兵庫','奈良','和歌山','鳥取','島根','岡山','広島','山口','徳島','香川','愛媛','高知','福岡','佐賀','長崎','熊本','大分','宮崎','鹿児島','沖縄']

const BASIC_FIELDS: AnyField[] = [
  { key: 'height',    label: '身長',   type: 'number', unit: 'cm', min: 140, max: 200 },
  { key: 'bodyType',  label: '体型',   type: 'select', options: ['スリム','普通','がっしり','ぽっちゃり','グラマー'] },
  { key: 'bloodType', label: '血液型', type: 'select', options: ['A','B','O','AB','わからない'] },
  { key: 'location',  label: '居住地', type: 'select', options: PREFS },
  { key: 'birthplace',label: '出身地', type: 'select', options: PREFS },
  { key: 'jobType',   label: '職種',   type: 'select', options: ['会社員（上場企業）','会社員（非上場）','公務員','自営業','フリーランス','医療・福祉','教育','IT・エンジニア','クリエイティブ','金融・保険','不動産','サービス業','その他'] },
  { key: 'education', label: '学歴',   type: 'select', options: ['中卒','高卒','専門学校卒','短大卒','大学卒','大学院卒'] },
  { key: 'income',    label: '年収',   type: 'select', options: ['200万円未満','200〜400万円未満','400〜600万円未満','600万円以上〜800万円未満','800〜1000万円未満','1000万円以上','答えたくない'] },
  { key: 'smoking',   label: 'タバコ', type: 'select', options: ['吸わない','吸う','電子タバコのみ','やめた'] },
]

const DETAIL_FIELDS: AnyField[] = [
  { key: 'nickname',      label: 'ニックネーム',      type: 'text',        placeholder: '例：たくや' },
  { key: 'siblings',      label: '兄弟姉妹',          type: 'select',      options: ['一人っ子','長男','次男','三男以上','長女','次女','三女以上'] },
  { key: 'language',      label: '話せる言語',        type: 'multiselect', options: ['日本語','英語','中国語','韓国語','フランス語','スペイン語','その他'] },
  { key: 'school',        label: '学校名',            type: 'text',        placeholder: '例：○○大学' },
  { key: 'jobName',       label: '職業名',            type: 'text',        placeholder: '例：ソフトウェアエンジニア' },
  { key: 'marriage',      label: '結婚歴',            type: 'select',      options: ['独身（未婚）','離婚歴あり（子なし）','離婚歴あり（子あり）'] },
  { key: 'children',      label: '子供の有無',        type: 'select',      options: ['なし','あり（同居）','あり（別居）'] },
  { key: 'marriageIntent',label: '結婚に対する意思',  type: 'select',      options: ['できれば1年以内','2〜3年のうちに','いつかはしたい','結婚は考えていない','相手による'] },
  { key: 'wantChildren',  label: '子供が欲しいか',    type: 'select',      options: ['子供は欲しい','どちらでもいい','欲しくない','相手による'] },
  { key: 'housework',     label: '家事・育児',        type: 'select',      options: ['積極的に参加したい','協力したい','相手に任せたい','状況による'] },
  { key: 'meetingHope',   label: '出会うまでの希望',  type: 'select',      options: ['気が合えば会いたい','まずは友達から','ゆっくり仲良くなりたい','すぐにでも会いたい'] },
  { key: 'dateCost',      label: 'デート費用',        type: 'select',      options: ['ワリカン','多めに出す','相手に出してほしい','状況による'] },
  { key: 'mbti',          label: '16タイプ診断',      type: 'select',      options: ['INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP','ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP'] },
  { key: 'personality',   label: '性格・タイプ',      type: 'multiselect', options: ['真面目','誠実','優しい','明るい','おっとり','活発','寛容','気前がいい','決断力がある','思いやりがある','ロマンチスト','負けず嫌い'] },
  { key: 'sociability',   label: '社交性',            type: 'select',      options: ['すぐ打ち解ける','徐々に仲良くなる','人見知り'] },
  { key: 'roommate',      label: '同居人',            type: 'select',      options: ['一人暮らし','家族と同居','ルームシェア','その他'] },
  { key: 'pet',           label: '飼っているペット',  type: 'multiselect', options: ['なし','犬','猫','鳥','魚','うさぎ','ハムスター','爬虫類','その他'] },
  { key: 'holiday',       label: '休日',              type: 'select',      options: ['土日','日曜のみ','月火','水木','不定休','その他'] },
  { key: 'alcohol',       label: 'お酒',              type: 'select',      options: ['飲まない','ときどき飲む','よく飲む','毎日飲む'] },
  { key: 'hobbies',       label: '好きなこと・趣味',  type: 'multiselect', options: ['スポーツ','映画・ドラマ','音楽','読書','旅行','グルメ','カフェ巡り','アウトドア','ゲーム','料理','写真','アート','ファッション','ヨガ・ジム','その他'] },
]

const INITIAL_VALUES: Record<string, string | string[]> = {
  height: '173', bodyType: '普通', bloodType: '', location: '滋賀', birthplace: '',
  jobType: 'IT・エンジニア', education: '大学卒', income: '400〜600万円未満', smoking: '吸わない',
  nickname: '', siblings: '長男', language: ['日本語'], school: '', jobName: '',
  marriage: '独身（未婚）', children: 'なし', marriageIntent: '2〜3年のうちに',
  wantChildren: '子供は欲しい', housework: '積極的に参加したい', meetingHope: '気が合えば会いたい',
  dateCost: '', mbti: '', personality: ['誠実', '優しい'], sociability: '徐々に仲良くなる',
  roommate: '一人暮らし', pet: [], holiday: '土日', alcohol: 'ときどき飲む', hobbies: [],
}

const DEFAULT_BIO = 'はじめまして！\nプロフィールを見ていただき、ありがとうございます😊\n\n普段は上場企業で働いています。\n土日休みの仕事です。\n\n休みの日は、散歩や食べ歩きに行くことが多いです！\n\nさっぱりとした性格で物怖じはしません。給料日にはちょっと良いごはんを食べに行きたいです😊\n\nよろしくお願いします！'

const PHOTO_LABELS = ['メイン写真', '笑顔', '全身', '趣味', '食べ物', '旅行']

function hasArrow(field: AnyField) {
  return field.type === 'text' || field.type === 'multiselect' || field.key === 'location' || field.key === 'birthplace'
}

function displayValue(key: string, val: string | string[]): { text: string; isSet: boolean } {
  if (Array.isArray(val)) {
    if (val.length === 0) return { text: '設定する', isSet: false }
    return { text: val.join(', '), isSet: true }
  }
  if (!val) {
    const placeholder = (key === 'nickname' || key === 'school' || key === 'jobName') ? '入力する' : '選択する'
    return { text: placeholder, isSet: false }
  }
  if (key === 'height') return { text: `${val}cm`, isSet: true }
  if (key === 'location') return { text: `日本 ${val}`, isSet: true }
  return { text: val, isSet: true }
}

function PickerSheet({ field, value, onClose, onSave }: {
  field: AnyField; value: string | string[]; onClose: () => void; onSave: (val: string | string[]) => void
}) {
  const [draft, setDraft] = useState<string | string[]>(value)
  const toggle = (opt: string) => {
    const arr = Array.isArray(draft) ? draft : []
    setDraft(arr.includes(opt) ? arr.filter(x => x !== opt) : [...arr, opt])
  }
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={onClose}>
      <div className="bg-white rounded-t-3xl max-h-[75vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
          <p className="font-bold text-gray-900 text-base">{field.label}</p>
          <button onClick={() => { onSave(draft); onClose() }} className="font-bold text-sm" style={{ color: '#A84060' }}>完了</button>
        </div>
        <div className="overflow-y-auto flex-1 px-4 py-3">
          {field.type === 'text' && (
            <input autoFocus className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none mt-2"
              style={{ borderColor: '#A84060' }} placeholder={field.placeholder ?? ''}
              value={typeof draft === 'string' ? draft : ''}
              onChange={e => setDraft(e.target.value)} />
          )}
          {field.type === 'number' && (
            <div className="space-y-0.5 py-2">
              {Array.from({ length: (field.max ?? 200) - (field.min ?? 140) + 1 }, (_, i) => String((field.min ?? 140) + i)).map(opt => (
                <button key={opt} onClick={() => setDraft(opt)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition"
                  style={{ background: draft === opt ? '#F9EEF2' : 'transparent' }}>
                  <span className="text-sm">{opt}cm</span>
                  {draft === opt && <Check className="w-4 h-4" style={{ color: '#A84060' }} />}
                </button>
              ))}
            </div>
          )}
          {(field.type === 'select' || field.type === 'multiselect') && field.options && (
            <div className="space-y-0.5 py-2">
              {field.options.map(opt => {
                const selected = field.type === 'multiselect' ? (Array.isArray(draft) && draft.includes(opt)) : draft === opt
                return (
                  <button key={opt}
                    onClick={() => field.type === 'multiselect' ? toggle(opt) : setDraft(opt)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition"
                    style={{ background: selected ? '#F9EEF2' : 'transparent' }}>
                    <span className="text-sm text-gray-800">{opt}</span>
                    {selected && <Check className="w-4 h-4" style={{ color: '#A84060' }} />}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function BioSheet({ bio, onSave, onClose }: { bio: string; onSave: (b: string) => void; onClose: () => void }) {
  const [draft, setDraft] = useState(bio)
  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="bg-white flex-1 flex flex-col mt-16 rounded-t-3xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
          <p className="font-bold text-gray-900 text-base">自己紹介文</p>
          <button onClick={() => { onSave(draft); onClose() }} className="font-bold text-sm" style={{ color: '#A84060' }}>完了</button>
        </div>
        <textarea
          autoFocus
          className="flex-1 w-full px-5 py-4 text-sm leading-relaxed text-gray-800 focus:outline-none resize-none"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder="自己紹介文を入力してください"
        />
        <p className="text-right px-5 pb-4 text-xs text-gray-400">{draft.length}/1000</p>
      </div>
    </div>
  )
}

function ProfileRow({ field, value, onTap }: { field: AnyField; value: string | string[]; onTap: () => void }) {
  const { text, isSet } = displayValue(field.key, value)
  const arrow = hasArrow(field)
  return (
    <button onClick={onTap}
      className="w-full flex items-center justify-between py-3.5 border-b border-gray-100 last:border-0 active:bg-gray-50 transition text-left">
      <span className="text-sm text-gray-700">{field.label}</span>
      <div className="flex items-center gap-0.5 max-w-[60%]">
        <span className="text-sm font-medium text-right truncate"
          style={{ color: isSet ? '#A84060' : '#F97316' }}>{text}</span>
        {arrow && <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />}
      </div>
    </button>
  )
}

export default function ProfileEditPage() {
  const router = useRouter()
  const [values, setValues] = useState<Record<string, string | string[]>>(INITIAL_VALUES)
  const [bio, setBio] = useState(DEFAULT_BIO)
  const [photos, setPhotos] = useState<(string | null)[]>(Array(6).fill(null))
  const [activePhotoIdx, setActivePhotoIdx] = useState(0)
  const [activeField, setActiveField] = useState<AnyField | null>(null)
  const [showBioSheet, setShowBioSheet] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const savedProfile = storage.getUserProfile()
    if (savedProfile) setValues(prev => ({ ...prev, ...savedProfile }))
    const savedBio = storage.getUserBio('')
    if (savedBio) setBio(savedBio)
    const savedPhotos = storage.getUserPhotos()
    if (savedPhotos.some(Boolean)) setPhotos(savedPhotos)
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (!isLoaded) return
    storage.setUserPhotos(photos)
  }, [photos, isLoaded])

  const openPhotoPicker = (idx: number) => { setActivePhotoIdx(idx); fileRef.current?.click() }

  const compressImage = (base64: string, maxPx = 800, quality = 0.72): Promise<string> =>
    new Promise(resolve => {
      const img = new Image()
      img.onload = () => {
        let { width, height } = img
        if (width > maxPx || height > maxPx) {
          if (width > height) { height = Math.round(height * maxPx / width); width = maxPx }
          else { width = Math.round(width * maxPx / height); height = maxPx }
        }
        const canvas = document.createElement('canvas')
        canvas.width = width; canvas.height = height
        canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = base64
    })

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    const raw = await fileToBase64(file)
    const base64 = await compressImage(raw)
    setPhotos(prev => prev.map((p, i) => i === activePhotoIdx ? base64 : p))
  }

  const addNextPhoto = () => {
    const idx = photos.findIndex(p => !p)
    openPhotoPicker(idx === -1 ? 0 : idx)
  }

  const saveField = (key: string, val: string | string[]) => {
    setValues(prev => {
      const next = { ...prev, [key]: val }
      storage.setUserProfile(next)
      return next
    })
  }

  const saveBio = (b: string) => {
    setBio(b)
    storage.setUserBio(b)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <div className="bg-white px-4 pt-10 pb-3 sticky top-0 z-20 shadow-sm flex items-center justify-between">
        <button onClick={() => router.push('/demo/profile')}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 active:bg-gray-200 transition">
          <X className="w-4 h-4 text-gray-600" />
        </button>
        <h1 className="text-base font-bold text-gray-900">プロフィール編集</h1>
        <button onClick={() => setShowPreview(true)} className="px-3 py-1.5 rounded-full text-sm font-bold" style={{ background: '#F9EEF2', color: '#A84060' }}>
          プレビュー
        </button>
      </div>

      {/* ── Photos ── */}
      <div className="bg-white px-4 pt-5 pb-5 mb-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-base text-gray-900">プロフィール写真</h3>
          <Link href="/demo/profile/photos" className="text-sm font-medium" style={{ color: '#A84060' }}>
            すべて見る
          </Link>
        </div>

        {/* Main + sub 1 & 2 row */}
        <div className="flex gap-2 mb-2">
          {/* Main photo */}
          <button onClick={() => openPhotoPicker(0)}
            className="relative rounded-2xl overflow-hidden flex-shrink-0 active:opacity-90 transition"
            style={{ width: '57%', aspectRatio: '4/5', background: '#E8EBF0' }}>
            {photos[0]
              ? <img src={photos[0]} alt="メイン" className="w-full h-full object-cover" />
              : null
            }
            <div className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center">
              <Pencil className="w-3.5 h-3.5 text-gray-600" />
            </div>
          </button>

          {/* Sub photos 1 & 2 */}
          <div className="flex-1 flex flex-col gap-2">
            {[1, 2].map(idx => (
              <button key={idx} onClick={() => openPhotoPicker(idx)}
                className="flex-1 rounded-2xl overflow-hidden relative active:opacity-90 transition"
                style={{ background: '#E8EBF0', minHeight: 90 }}>
                {photos[idx]
                  ? <img src={photos[idx]!} alt={PHOTO_LABELS[idx]} className="w-full h-full object-cover absolute inset-0" />
                  : null
                }
                <div className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center">
                  <Pencil className="w-3.5 h-3.5 text-gray-600" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sub photos 3, 4, 5 */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[3, 4, 5].map(idx => (
            <button key={idx} onClick={() => openPhotoPicker(idx)}
              className="rounded-2xl overflow-hidden relative active:opacity-90 transition"
              style={{ aspectRatio: '1', background: '#E8EBF0' }}>
              {photos[idx]
                ? <img src={photos[idx]!} alt={PHOTO_LABELS[idx]} className="w-full h-full object-cover absolute inset-0" />
                : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
                    <span className="text-xs text-gray-500">{PHOTO_LABELS[idx]}</span>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: '#A84060' }}>
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )
              }
            </button>
          ))}
        </div>

        {/* 写真を追加 button */}
        <button onClick={addNextPhoto}
          className="w-full py-3 rounded-full text-white font-bold text-sm active:opacity-80 transition"
          style={{ background: '#A84060' }}>
          写真を追加
        </button>
      </div>

      {/* ── 自己紹介文 ── */}
      <div className="bg-white px-4 pt-4 pb-1 mb-3">
        <h3 className="font-bold text-base text-gray-900 mb-3">自己紹介文</h3>
        <button onClick={() => setShowBioSheet(true)}
          className="w-full text-left flex items-start gap-2 pb-4 active:opacity-70 transition">
          <p className="flex-1 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap line-clamp-6">{bio}</p>
          <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />
        </button>
      </div>

      {/* ── Pairs プロフ ── */}
      <div className="bg-white px-4 pt-4 pb-1 mb-3">
        <h3 className="font-bold text-base text-gray-900 mb-1">Pairs プロフ</h3>
        {BASIC_FIELDS.map(f => (
          <ProfileRow key={f.key} field={f} value={values[f.key] ?? ''} onTap={() => setActiveField(f)} />
        ))}
      </div>

      {/* ── 詳細プロフィール ── */}
      <div className="bg-white px-4 pt-4 pb-1 mb-8">
        <h3 className="font-bold text-base text-gray-900 mb-1">詳細プロフィール</h3>
        {DETAIL_FIELDS.map(f => (
          <ProfileRow key={f.key} field={f} value={values[f.key] ?? ''} onTap={() => setActiveField(f)} />
        ))}
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />

      {/* Bio sheet */}
      {showBioSheet && (
        <BioSheet bio={bio} onSave={saveBio} onClose={() => setShowBioSheet(false)} />
      )}

      {/* Field picker sheet */}
      {activeField && (
        <PickerSheet
          field={activeField}
          value={values[activeField.key] ?? (activeField.type === 'multiselect' ? [] : '')}
          onClose={() => setActiveField(null)}
          onSave={val => { saveField(activeField.key, val); setActiveField(null) }}
        />
      )}

      {/* ── Preview modal ── */}
      {showPreview && (
        <div className="fixed inset-0 z-[200] bg-white overflow-y-auto pb-24">
          {/* Banner */}
          <div className="sticky top-0 z-10 text-center py-2 text-xs font-bold text-white" style={{ background: '#A84060' }}>
            プレビュー — 相手にはこのように表示されます
          </div>

          {/* Hero photo */}
          <div className="relative bg-gray-200" style={{ aspectRatio: '3/4' }}>
            {photos[0]
              ? <img src={photos[0]} className="w-full h-full object-cover" alt="" />
              : <div className="w-full h-full flex items-center justify-center"><User className="w-32 h-32 text-gray-300" /></div>
            }
          </div>

          {/* Name & info */}
          <div className="px-4 pt-4 pb-3 bg-white">
            <h1 className="text-2xl font-bold text-gray-900">
              {(values.nickname as string) || 'ニックネーム未設定'}
            </h1>
            <p className="mt-1 text-sm text-gray-400">👍 0 いいね！</p>
          </div>

          {/* Hobby/personality tags */}
          {((values.personality as string[])?.length > 0 || (values.hobbies as string[])?.length > 0) && (
            <div className="px-4 pb-4 bg-white flex flex-wrap gap-2">
              {(values.personality as string[] ?? []).map(t => (
                <span key={t} className="px-3 py-1.5 rounded-full border border-gray-300 text-sm text-gray-700">{t}</span>
              ))}
              {(values.hobbies as string[] ?? []).map(t => (
                <span key={t} className="px-3 py-1.5 rounded-full border border-gray-300 text-sm text-gray-700">{t}</span>
              ))}
            </div>
          )}

          {/* Bio */}
          {bio && (
            <div className="border-t border-gray-100">
              <div className="px-4 py-3" style={{ background: '#F9F9F9' }}>
                <h2 className="text-sm font-bold text-gray-700">自己紹介文</h2>
              </div>
              <div className="px-4 py-4 bg-white">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{bio}</p>
              </div>
            </div>
          )}

          {/* Profile fields */}
          {(() => {
            const fields: [string, string][] = [
              ['身長', values.height ? `${values.height}cm` : ''],
              ['体型', values.bodyType as string ?? ''],
              ['タバコ', values.smoking as string ?? ''],
              ['お酒', values.alcohol as string ?? ''],
              ['休日', values.holiday as string ?? ''],
              ['職種', values.jobType as string ?? ''],
              ['学歴', values.education as string ?? ''],
            ].filter(([, v]) => !!v) as [string, string][]
            return fields.length > 0 ? (
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
            ) : null
          })()}

          {/* Sub photos */}
          {photos.slice(1).some(Boolean) && (
            <div className="border-t border-gray-100 mt-1">
              <div className="px-4 py-3" style={{ background: '#F9F9F9' }}>
                <h2 className="text-sm font-bold text-gray-700">写真</h2>
              </div>
              <div className="px-4 py-4 grid grid-cols-3 gap-2">
                {photos.slice(1).filter(Boolean).map((p, i) => (
                  <div key={i} className="rounded-xl overflow-hidden" style={{ aspectRatio: '1' }}>
                    <img src={p!} className="w-full h-full object-cover" alt="" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Close button */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 max-w-md mx-auto">
            <button onClick={() => setShowPreview(false)}
              className="w-full py-3.5 rounded-2xl font-bold text-white text-base"
              style={{ background: 'linear-gradient(135deg, #A84060, #8A3050)' }}>
              編集に戻る
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
