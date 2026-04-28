'use client'

import { useState } from 'react'
import { X, ChevronRight } from 'lucide-react'

const TEAL = '#5BC0C0'

export type FilterState = {
  distanceSearch: boolean
  locations: string[]
  heightMin: number; heightMax: number
  bodyTypes: string[]
  ageMin: number; ageMax: number
  jobTypes: string[]
  incomeMin: number; incomeMax: number
  holidays: string[]
  educations: string[]
  roommateTypes: string[]
  smokingTypes: string[]
  alcoholTypes: string[]
  marriageTypes: string[]
  childrenTypes: string[]
}

export const DEFAULT_FILTER: FilterState = {
  distanceSearch: false, locations: [],
  heightMin: 140, heightMax: 200,
  bodyTypes: [], ageMin: 18, ageMax: 50,
  jobTypes: [], incomeMin: 0, incomeMax: 5,
  holidays: [], educations: [], roommateTypes: [],
  smokingTypes: [], alcoholTypes: [], marriageTypes: [], childrenTypes: [],
}

const INCOME_LABELS = ['200万円未満','200〜400万円','400〜600万円','600〜800万円','800〜1000万円','1000万円以上']
const REGIONS = [
  { label: '北海道・東北', prefs: ['北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県'] },
  { label: '関東', prefs: ['茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県'] },
  { label: '中部', prefs: ['新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県','静岡県','愛知県'] },
  { label: '近畿', prefs: ['三重県','滋賀県','京都府','大阪府','兵庫県','奈良県','和歌山県'] },
  { label: '中国・四国', prefs: ['鳥取県','島根県','岡山県','広島県','山口県','徳島県','香川県','愛媛県','高知県'] },
  { label: '九州・沖縄', prefs: ['福岡県','佐賀県','長崎県','熊本県','大分県','宮崎県','鹿児島県','沖縄県'] },
]

// ── Sub-components ─────────────────────────────

function DualRange({ label, min, max, low, high, onChange, format }: {
  label: string; min: number; max: number; low: number; high: number
  onChange: (low: number, high: number) => void
  format: (v: number) => string
}) {
  const pctL = ((low - min) / (max - min)) * 100
  const pctR = ((high - min) / (max - min)) * 100
  const isDefault = low === min && high === max
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-bold text-gray-800">{label}</span>
        <span className="text-sm text-gray-500">{isDefault ? 'こだわらない' : `${format(low)} 〜 ${format(high)}`}</span>
      </div>
      <div className="relative h-6 flex items-center">
        <div className="absolute left-0 right-0 h-1 bg-gray-200 rounded-full">
          <div className="absolute h-full rounded-full" style={{ left: `${pctL}%`, right: `${100 - pctR}%`, background: TEAL }} />
        </div>
        <input type="range" min={min} max={max} value={low} className="range-thumb"
          onChange={e => onChange(Math.min(+e.target.value, high - 1), high)} />
        <input type="range" min={min} max={max} value={high} className="range-thumb"
          onChange={e => onChange(low, Math.max(+e.target.value, low + 1))} />
      </div>
    </div>
  )
}

function Chips({ label, icon, options, selected, onChange }: {
  label: string; icon?: string; options: string[]; selected: string[]
  onChange: (v: string[]) => void
}) {
  const toggle = (opt: string) =>
    onChange(selected.includes(opt) ? selected.filter(x => x !== opt) : [...selected, opt])
  return (
    <div className="mb-6">
      <p className="text-sm font-bold text-gray-800 mb-3">{icon && <span className="mr-1">{icon}</span>}{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => {
          const on = selected.includes(opt)
          return (
            <button key={opt} onClick={() => toggle(opt)}
              className="px-3 py-1.5 rounded-full text-sm border transition-all"
              style={{ background: on ? TEAL : 'white', color: on ? 'white' : '#374151', borderColor: on ? TEAL : '#E5E7EB' }}>
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function NavRow({ label, icon, value, onTap }: { label: string; icon?: string; value: string; onTap: () => void }) {
  return (
    <button onClick={onTap} className="w-full flex items-center justify-between py-4 border-b border-gray-100 active:bg-gray-50 transition">
      <span className="text-sm text-gray-800">{icon && <span className="mr-2">{icon}</span>}{label}</span>
      <div className="flex items-center gap-1">
        <span className="text-sm text-gray-400">{value}</span>
        <ChevronRight className="w-4 h-4 text-gray-300" />
      </div>
    </button>
  )
}

function LocationPicker({ selected, onChange, onClose }: {
  selected: string[]; onChange: (v: string[]) => void; onClose: () => void
}) {
  const [draft, setDraft] = useState(selected)
  const toggle = (p: string) => setDraft(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])
  return (
    <div className="fixed inset-0 z-[210] flex flex-col bg-white">
      <div className="flex items-center justify-between px-4 pt-10 pb-3 border-b border-gray-100 shadow-sm">
        <button onClick={onClose}><X className="w-5 h-5 text-gray-500" /></button>
        <p className="font-bold text-base">居住地を選択</p>
        <button onClick={() => { onChange(draft); onClose() }} className="text-sm font-bold" style={{ color: TEAL }}>完了</button>
      </div>
      <div className="overflow-y-auto flex-1 px-4 py-3">
        <button onClick={() => setDraft([])} className="mb-4 text-sm px-4 py-1.5 rounded-full border"
          style={{ borderColor: draft.length === 0 ? TEAL : '#E5E7EB', background: draft.length === 0 ? TEAL : 'white', color: draft.length === 0 ? 'white' : '#374151' }}>
          こだわらない
        </button>
        {REGIONS.map(r => (
          <div key={r.label} className="mb-4">
            <p className="text-xs font-bold text-gray-400 mb-2">{r.label}</p>
            <div className="flex flex-wrap gap-2">
              {r.prefs.map(p => {
                const on = draft.includes(p)
                return (
                  <button key={p} onClick={() => toggle(p)}
                    className="px-3 py-1.5 rounded-full text-sm border transition-all"
                    style={{ background: on ? TEAL : 'white', color: on ? 'white' : '#374151', borderColor: on ? TEAL : '#E5E7EB' }}>
                    {p.replace(/[都府県]$/, '')}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main FilterSheet ────────────────────────────

export function FilterSheet({ filters, onApply, onClose }: {
  filters: FilterState; onApply: (f: FilterState) => void; onClose: () => void
}) {
  const [f, setF] = useState<FilterState>(filters)
  const [showLocation, setShowLocation] = useState(false)
  const [showMoreJobs, setShowMoreJobs] = useState(false)

  const set = <K extends keyof FilterState>(k: K, v: FilterState[K]) => setF(prev => ({ ...prev, [k]: v }))

  const JOB_SHORT = ['大手企業','公務員','受付','事務員','看護師','保育士','客室乗務員']
  const JOB_ALL = [...JOB_SHORT, '医師・歯科医','薬剤師','美容師','教師','エンジニア','デザイナー','その他']
  const jobOptions = showMoreJobs ? JOB_ALL : JOB_SHORT

  return (
    <>
      <div className="fixed inset-0 z-[200] flex flex-col bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-10 pb-3 border-b border-gray-100 shadow-sm flex-shrink-0">
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100">
            <X className="w-4 h-4 text-gray-600" />
          </button>
          <p className="font-bold text-base text-gray-900">絞り込み</p>
          <button onClick={() => setF(DEFAULT_FILTER)} className="text-sm text-gray-500 font-medium">条件をリセット</button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {/* Saved conditions placeholder */}
          <div className="bg-gray-50 rounded-2xl px-4 py-5 mb-6 text-center">
            <p className="text-xs text-gray-400 leading-relaxed">ここには前回の検索条件や<br />保存した検索条件が表示されます</p>
          </div>

          {/* エリア */}
          <p className="text-base font-black text-gray-900 mb-4">エリア</p>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-800">📍 距離で検索</span>
            <button onClick={() => set('distanceSearch', !f.distanceSearch)}
              className="w-12 h-6 rounded-full transition-colors relative"
              style={{ background: f.distanceSearch ? TEAL : '#D1D5DB' }}>
              <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
                style={{ left: f.distanceSearch ? '26px' : '2px' }} />
            </button>
          </div>
          <NavRow label="居住地" icon="📍"
            value={f.locations.length === 0 ? 'こだわらない' : f.locations.map(l => l.replace(/[都府県]$/, '')).join('・')}
            onTap={() => setShowLocation(true)} />

          {/* 基本プロフィール */}
          <p className="text-base font-black text-gray-900 mt-6 mb-4">基本プロフィール</p>

          <DualRange label="📏 身長" min={140} max={200} low={f.heightMin} high={f.heightMax}
            onChange={(l, h) => setF(p => ({ ...p, heightMin: l, heightMax: h }))}
            format={v => `${v}cm`} />

          <Chips label="👕 体型" options={['スリム','やや細め','普通','グラマー','筋肉質','ややぽっちゃり','ぽっちゃり']}
            selected={f.bodyTypes} onChange={v => set('bodyTypes', v)} />

          <DualRange label="🎂 年齢" min={18} max={50} low={f.ageMin} high={f.ageMax}
            onChange={(l, h) => setF(p => ({ ...p, ageMin: l, ageMax: h }))}
            format={v => `${v}歳`} />

          <div className="mb-6">
            <p className="text-sm font-bold text-gray-800 mb-3">💼 職種</p>
            <div className="flex flex-wrap gap-2">
              {jobOptions.map(opt => {
                const on = f.jobTypes.includes(opt)
                return (
                  <button key={opt} onClick={() => set('jobTypes', on ? f.jobTypes.filter(x => x !== opt) : [...f.jobTypes, opt])}
                    className="px-3 py-1.5 rounded-full text-sm border transition-all"
                    style={{ background: on ? TEAL : 'white', color: on ? 'white' : '#374151', borderColor: on ? TEAL : '#E5E7EB' }}>
                    {opt}
                  </button>
                )
              })}
            </div>
            {!showMoreJobs && (
              <button onClick={() => setShowMoreJobs(true)} className="mt-2 text-sm font-bold" style={{ color: TEAL }}>
                さらに表示
              </button>
            )}
          </div>

          <DualRange label="💰 年収" min={0} max={5} low={f.incomeMin} high={f.incomeMax}
            onChange={(l, h) => setF(p => ({ ...p, incomeMin: l, incomeMax: h }))}
            format={v => INCOME_LABELS[v]} />

          <Chips label="📅 休日" options={['土日','平日','不定期','その他']}
            selected={f.holidays} onChange={v => set('holidays', v)} />

          <Chips label="🎓 学歴" options={['短大/専門学校卒','高校卒','大学卒','大学院卒','その他']}
            selected={f.educations} onChange={v => set('educations', v)} />

          <NavRow label="出身地" icon="🏠" value="こだわらない" onTap={() => {}} />

          <Chips label="👥 同居人" options={['一人暮らし','友達と一緒','ペットと一緒','実家暮らし','その他']}
            selected={f.roommateTypes} onChange={v => set('roommateTypes', v)} />

          <NavRow label="飼っているペット" icon="🐾" value="こだわらない" onTap={() => {}} />
          <NavRow label="話せる言語" icon="🌐" value="こだわらない" onTap={() => {}} />

          <Chips label="🚬 タバコ" options={['吸わない','吸う','吸う（電子タバコ）','非喫煙者の前では吸わない','相手が嫌ならやめる','ときどき吸う']}
            selected={f.smokingTypes} onChange={v => set('smokingTypes', v)} />

          <Chips label="🍷 お酒" options={['飲まない','飲む','ときどき飲む']}
            selected={f.alcoholTypes} onChange={v => set('alcoholTypes', v)} />

          <Chips label="💍 結婚歴" options={['独身（未婚）','独身（離婚）','独身（死別）']}
            selected={f.marriageTypes} onChange={v => set('marriageTypes', v)} />

          <Chips label="👶 子供の有無" options={['なし','同居中','別居中']}
            selected={f.childrenTypes} onChange={v => set('childrenTypes', v)} />

          <div className="h-24" />
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-white shadow-lg">
          <button className="text-sm font-bold" style={{ color: TEAL }}>この条件を保存</button>
          <button onClick={() => { onApply(f); onClose() }}
            className="px-8 py-3 rounded-full text-white font-bold text-sm"
            style={{ background: TEAL }}>
            お相手を検索
          </button>
        </div>
      </div>

      {showLocation && (
        <LocationPicker selected={f.locations}
          onChange={v => set('locations', v)}
          onClose={() => setShowLocation(false)} />
      )}

      <style>{`
        .range-thumb {
          -webkit-appearance: none;
          appearance: none;
          position: absolute;
          width: 100%;
          height: 4px;
          background: transparent;
          pointer-events: none;
        }
        .range-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 22px; height: 22px;
          background: white;
          border: 2.5px solid ${TEAL};
          border-radius: 50%;
          pointer-events: all;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }
        .range-thumb::-moz-range-thumb {
          width: 22px; height: 22px;
          background: white;
          border: 2.5px solid ${TEAL};
          border-radius: 50%;
          pointer-events: all;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }
      `}</style>
    </>
  )
}
