'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronRight, Camera, X, Check, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { DEMO_USER } from '@/lib/demo-data'
import { storage, fileToBase64 } from '@/lib/storage'

type FieldType = 'select' | 'multiselect' | 'text' | 'number'
type AnyField = { key: string; label: string; type: FieldType; options?: string[]; placeholder?: string; min?: number; max?: number; unit?: string }

const PREFS = ['北海道','青森','岩手','宮城','秋田','山形','福島','茨城','栃木','群馬','埼玉','千葉','東京','神奈川','新潟','富山','石川','福井','山梨','長野','岐阜','静岡','愛知','三重','滋賀','京都','大阪','兵庫','奈良','和歌山','鳥取','島根','岡山','広島','山口','徳島','香川','愛媛','高知','福岡','佐賀','長崎','熊本','大分','宮崎','鹿児島','沖縄']

const BASIC_FIELDS: AnyField[] = [
  { key: 'height', label: '身長', type: 'number', unit: 'cm', min: 140, max: 200 },
  { key: 'bodyType', label: '体型', type: 'select', options: ['スリム', '普通', 'がっしり', 'ぽっちゃり', 'グラマー'] },
  { key: 'bloodType', label: '血液型', type: 'select', options: ['A', 'B', 'O', 'AB', 'わからない'] },
  { key: 'location', label: '居住地', type: 'select', options: PREFS },
  { key: 'birthplace', label: '出身地', type: 'select', options: PREFS },
  { key: 'jobType', label: '職種', type: 'select', options: ['会社員（上場企業）','会社員（非上場）','公務員','自営業','フリーランス','医療・福祉','教育','IT・エンジニア','クリエイティブ','金融・保険','不動産','サービス業','その他'] },
  { key: 'education', label: '学歴', type: 'select', options: ['中卒','高卒','専門学校卒','短大卒','大学卒','大学院卒'] },
  { key: 'income', label: '年収', type: 'select', options: ['200万円未満','200〜400万円未満','400〜600万円未満','600〜800万円未満','800〜1000万円未満','1000万円以上','答えたくない'] },
  { key: 'smoking', label: 'タバコ', type: 'select', options: ['吸わない','吸う','電子タバコのみ','やめた'] },
]

const DETAIL_FIELDS: AnyField[] = [
  { key: 'nickname', label: 'ニックネーム', type: 'text', placeholder: '例：たくや' },
  { key: 'siblings', label: '兄弟姉妹', type: 'select', options: ['一人っ子','長男','次男','三男以上','長女','次女','三女以上'] },
  { key: 'language', label: '話せる言語', type: 'multiselect', options: ['日本語','英語','中国語','韓国語','フランス語','スペイン語','その他'] },
  { key: 'school', label: '学校名', type: 'text', placeholder: '例：○○大学' },
  { key: 'jobName', label: '職業名', type: 'text', placeholder: '例：ソフトウェアエンジニア' },
  { key: 'marriage', label: '結婚歴', type: 'select', options: ['独身（未婚）','離婚歴あり（子なし）','離婚歴あり（子あり）'] },
  { key: 'children', label: '子供の有無', type: 'select', options: ['なし','あり（同居）','あり（別居）'] },
  { key: 'marriageIntent', label: '結婚に対する意思', type: 'select', options: ['できれば1年以内','2〜3年のうちに','いつかはしたい','結婚は考えていない','相手による'] },
  { key: 'wantChildren', label: '子供が欲しいか', type: 'select', options: ['子供は欲しい','どちらでもいい','欲しくない','相手による'] },
  { key: 'housework', label: '家事・育児', type: 'select', options: ['積極的に参加したい','協力したい','相手に任せたい','状況による'] },
  { key: 'meetingHope', label: '出会うまでの希望', type: 'select', options: ['気が合えば会いたい','まずは友達から','ゆっくり仲良くなりたい','すぐにでも会いたい'] },
  { key: 'dateCost', label: 'デート費用', type: 'select', options: ['ワリカン','多めに出す','相手に出してほしい','状況による'] },
  { key: 'mbti', label: '16タイプ診断', type: 'select', options: ['INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP','ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP'] },
  { key: 'personality', label: '性格・タイプ', type: 'multiselect', options: ['真面目','誠実','優しい','明るい','おっとり','活発','寛容','気前がいい','決断力がある','思いやりがある','ロマンチスト','負けず嫌い'] },
  { key: 'sociability', label: '社交性', type: 'select', options: ['すぐ打ち解ける','徐々に仲良くなる','人見知り'] },
  { key: 'roommate', label: '同居人', type: 'select', options: ['一人暮らし','家族と同居','ルームシェア','その他'] },
  { key: 'pet', label: '飼っているペット', type: 'multiselect', options: ['なし','犬','猫','鳥','魚','うさぎ','ハムスター','爬虫類','その他'] },
  { key: 'holiday', label: '休日', type: 'select', options: ['土日','日曜のみ','月火','水木','不定休','その他'] },
  { key: 'alcohol', label: 'お酒', type: 'select', options: ['飲まない','ときどき飲む','よく飲む','毎日飲む'] },
  { key: 'hobbies', label: '好きなこと・趣味', type: 'multiselect', options: ['スポーツ','映画・ドラマ','音楽','読書','旅行','グルメ','カフェ巡り','アウトドア','ゲーム','料理','写真','アート','ファッション','ヨガ・ジム','その他'] },
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

function displayValue(key: string, val: string | string[]): { text: string; isSet: boolean } {
  if (Array.isArray(val)) {
    if (val.length === 0) return { text: '設定する', isSet: false }
    return { text: val.join(', '), isSet: true }
  }
  if (!val) return { text: key === 'nickname' || key === 'school' || key === 'jobName' ? '入力する' : '選択する', isSet: false }
  if (key === 'height') return { text: `${val}cm`, isSet: true }
  return { text: val, isSet: true }
}

function PickerSheet({ field, value, onClose, onSave }: { field: AnyField; value: string | string[]; onClose: () => void; onSave: (val: string | string[]) => void }) {
  const [draft, setDraft] = useState<string | string[]>(value)
  const toggleMulti = (opt: string) => {
    const arr = Array.isArray(draft) ? draft : []
    setDraft(arr.includes(opt) ? arr.filter(x => x !== opt) : [...arr, opt])
  }
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={onClose}>
      <div className="bg-white rounded-t-3xl max-h-[75vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <button onClick={onClose} className="text-gray-400"><X className="w-5 h-5" /></button>
          <p className="font-bold text-gray-900 text-base">{field.label}</p>
          <button onClick={() => { onSave(draft); onClose() }} className="font-bold text-sm" style={{ color: '#7E2841' }}>完了</button>
        </div>
        <div className="overflow-y-auto flex-1 px-4 py-3">
          {field.type === 'text' && (
            <input autoFocus className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none mt-2" style={{ borderColor: '#7E2841' }}
              placeholder={field.placeholder ?? ''} value={typeof draft === 'string' ? draft : ''}
              onChange={e => setDraft(e.target.value)} />
          )}
          {field.type === 'number' && (
            <div className="space-y-1 py-2">
              {Array.from({ length: (field.max ?? 200) - (field.min ?? 140) + 1 }, (_, i) => String((field.min ?? 140) + i)).map(opt => (
                <button key={opt} onClick={() => setDraft(opt)} className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition" style={{ background: draft === opt ? '#F5E6EA' : 'transparent' }}>
                  <span className="text-sm">{opt}cm</span>
                  {draft === opt && <Check className="w-4 h-4" style={{ color: '#7E2841' }} />}
                </button>
              ))}
            </div>
          )}
          {(field.type === 'select' || field.type === 'multiselect') && field.options && (
            <div className="space-y-1 py-2">
              {field.options.map(opt => {
                const selected = field.type === 'multiselect' ? (Array.isArray(draft) && draft.includes(opt)) : draft === opt
                return (
                  <button key={opt} onClick={() => field.type === 'multiselect' ? toggleMulti(opt) : setDraft(opt)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition"
                    style={{ background: selected ? '#F5E6EA' : 'transparent' }}>
                    <span className="text-sm text-gray-800">{opt}</span>
                    {selected && <Check className="w-4 h-4" style={{ color: '#7E2841' }} />}
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

function ProfileRow({ field, value, onTap }: { field: AnyField; value: string | string[]; onTap: () => void }) {
  const { text, isSet } = displayValue(field.key, value)
  return (
    <button onClick={onTap} className="w-full flex items-center justify-between py-3 border-b border-gray-100 last:border-0 active:bg-gray-50 transition text-left">
      <span className="text-sm text-gray-700">{field.label}</span>
      <div className="flex items-center gap-1 max-w-[55%]">
        <span className="text-sm font-medium text-right truncate" style={{ color: isSet ? '#7E2841' : '#DC2626' }}>{text}</span>
        <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
      </div>
    </button>
  )
}

const DEFAULT_BIO = 'はじめまして！\nプロフィールを見ていただき、ありがとうございます😊\n\n普段はエンジニアとして働いています。\n土日休みの仕事です。\n\n休みの日は、散歩や食べ歩きに行くことが多いです！\n\nよろしくお願いします！'

export default function ProfileEditPage() {
  const [tab, setTab] = useState<'basic' | 'detail'>('basic')
  const [values, setValues] = useState<Record<string, string | string[]>>(INITIAL_VALUES)
  const [activeField, setActiveField] = useState<AnyField | null>(null)
  const [photos, setPhotos] = useState<(string | null)[]>(Array(6).fill(null))
  const [activePhotoIdx, setActivePhotoIdx] = useState(0)
  const [saved, setSaved] = useState(false)
  const [bio, setBio] = useState(DEFAULT_BIO)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const savedProfile = storage.getUserProfile()
    if (savedProfile) setValues(prev => ({ ...prev, ...savedProfile }))
    const savedBio = storage.getUserBio('')
    if (savedBio) setBio(savedBio)
    const savedPhotos = storage.getUserPhotos()
    if (savedPhotos.some(Boolean)) setPhotos(savedPhotos)
  }, [])

  const openPhotoPicker = (idx: number) => { setActivePhotoIdx(idx); fileRef.current?.click() }
  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    const base64 = await fileToBase64(file)
    setPhotos(prev => {
      const next = prev.map((p, i) => i === activePhotoIdx ? base64 : p)
      storage.setUserPhotos(next)
      return next
    })
  }
  const handleSave = () => {
    storage.setUserProfile(values)
    storage.setUserBio(bio)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const completedBasic = BASIC_FIELDS.filter(f => { const v = values[f.key]; return Array.isArray(v) ? v.length > 0 : !!v }).length
  const completedDetail = DETAIL_FIELDS.filter(f => { const v = values[f.key]; return Array.isArray(v) ? v.length > 0 : !!v }).length
  const fields = tab === 'basic' ? BASIC_FIELDS : DETAIL_FIELDS
  const SUB_LABELS = ['笑顔', '全身', '趣味', '食べ物', '旅行']

  return (
    <div className="min-h-screen" style={{ background: '#F8F5F6' }}>
      {/* Header */}
      <div className="bg-white px-4 pt-10 pb-3 sticky top-0 z-20 shadow-sm flex items-center gap-3">
        <Link href="/demo/profile" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <h1 className="flex-1 text-base font-bold text-gray-900 text-center">プロフィール編集</h1>
        <div className="w-8" />
      </div>

      {/* Photo upload */}
      <div className="bg-white py-5 mb-3">
        <div className="flex items-center justify-between px-4 mb-3">
          <h3 className="font-bold text-sm text-gray-800">プロフィール写真</h3>
          <span className="text-xs text-gray-400">{photos.filter(Boolean).length}/6枚</span>
        </div>
        <div className="px-4 flex gap-2">
          <button onClick={() => openPhotoPicker(0)} className="relative rounded-2xl overflow-hidden flex-shrink-0" style={{ width: '52%', aspectRatio: '3/4', background: '#EFF6FF' }}>
            {photos[0]
              ? <img src={photos[0]} alt="main" className="w-full h-full object-cover" />
              : <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400">
                  <Camera className="w-8 h-8" /><span className="text-xs">メイン写真</span>
                </div>
            }
            <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 flex items-center justify-center shadow">
              <Camera className="w-3.5 h-3.5 text-gray-600" />
            </div>
          </button>
          <div className="flex flex-col gap-2 flex-1">
            {[1, 2].map(idx => (
              <button key={idx} onClick={() => openPhotoPicker(idx)} className="rounded-2xl border-2 border-dashed overflow-hidden flex-1 relative"
                style={{ minHeight: 80, borderColor: photos[idx] ? 'transparent' : '#E5E7EB', background: photos[idx] ? 'transparent' : 'white' }}>
                {photos[idx]
                  ? <img src={photos[idx]!} alt="" className="w-full h-full object-cover absolute inset-0" />
                  : <div className="flex flex-col items-center justify-center gap-1 h-full py-3">
                      <span className="text-xs text-gray-400">{SUB_LABELS[idx - 1]}</span>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-lg font-bold" style={{ background: '#7E2841' }}>+</div>
                    </div>
                }
              </button>
            ))}
          </div>
        </div>
        <div className="px-4 mt-2 grid grid-cols-3 gap-2">
          {[3, 4, 5].map(idx => (
            <button key={idx} onClick={() => openPhotoPicker(idx)} className="rounded-2xl border-2 border-dashed overflow-hidden relative"
              style={{ aspectRatio: '1', borderColor: photos[idx] ? 'transparent' : '#E5E7EB', background: photos[idx] ? 'transparent' : 'white' }}>
              {photos[idx]
                ? <img src={photos[idx]!} alt="" className="w-full h-full object-cover absolute inset-0" />
                : <div className="flex flex-col items-center justify-center gap-1 h-full py-3">
                    <span className="text-xs text-gray-400">{SUB_LABELS[idx - 1]}</span>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-lg font-bold" style={{ background: '#7E2841' }}>+</div>
                  </div>
              }
            </button>
          ))}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
      </div>

      {/* Self intro */}
      <div className="bg-white px-4 py-4 mb-3">
        <h3 className="text-sm font-bold text-gray-800 mb-2">自己紹介文</h3>
        <textarea value={bio} onChange={e => setBio(e.target.value)} rows={6}
          className="w-full text-sm text-gray-800 leading-relaxed focus:outline-none resize-none"
          style={{ caretColor: '#7E2841' }} placeholder="自己紹介文を入力してください" />
      </div>

      {/* Tabs + fields */}
      <div className="bg-white mb-3">
        <div className="flex border-b border-gray-100">
          {(['basic', 'detail'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className="flex-1 py-3 text-sm font-bold transition"
              style={{ color: tab === t ? '#7E2841' : '#9CA3AF', borderBottom: tab === t ? '2px solid #7E2841' : '2px solid transparent' }}>
              {t === 'basic' ? `基本プロフ（${completedBasic}/${BASIC_FIELDS.length}）` : `詳細プロフィール（${completedDetail}/${DETAIL_FIELDS.length}）`}
            </button>
          ))}
        </div>
        <div className="px-4">
          {fields.map(f => (
            <ProfileRow key={f.key} field={f} value={values[f.key] ?? ''} onTap={() => setActiveField(f)} />
          ))}
        </div>
      </div>

      {/* Save */}
      <div className="px-4 pb-8">
        {saved && (
          <div className="text-center text-sm font-medium py-2 mb-2 rounded-xl" style={{ background: '#F0FDF4', color: '#16A34A' }}>
            ✓ 保存しました
          </div>
        )}
        <button onClick={handleSave} className="w-full py-4 text-white font-bold rounded-2xl shadow-lg text-base active:scale-[0.98] transition"
          style={{ background: 'linear-gradient(135deg, #7E2841, #A03558)' }}>
          保存する
        </button>
      </div>
      <div className="h-4" />

      {activeField && (
        <PickerSheet field={activeField} value={values[activeField.key] ?? (activeField.type === 'multiselect' ? [] : '')}
          onClose={() => setActiveField(null)} onSave={val => setValues(prev => ({ ...prev, [activeField.key]: val }))} />
      )}
    </div>
  )
}
