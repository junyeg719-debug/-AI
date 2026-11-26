import type { DemoProfile, DemoMessage, DemoMatch } from './demo-data'
import { CANDIDATE_PROFILES, DEMO_USER, DEMO_USER_ID } from './demo-data'

export const FEMALE_DEMO_USER = CANDIDATE_PROFILES.find(p => p.id === 'profile-001')!
export const FEMALE_USER_ID = 'user-001'

export const MALE_CANDIDATES: DemoProfile[] = [
  {
    id: 'male-001', user_id: 'male-user-001',
    name: 'りく', age: 30, gender: 'male', looking_for: 'female',
    bio: '大阪でデザイナーをしています。休日はカフェ巡りや旅行が好きです。笑顔が素敵な方と出会いたいです！',
    avatar_url: null, photos: [], interests: ['デザイン', 'カフェ', '旅行', '映画', 'スポーツ'],
    location: '大阪府', occupation: 'デザイナー', height: 178, bodyType: '普通', smoking: '吸わない',
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
    emoji: '🌊', color: 'from-blue-300 to-cyan-400',
    likeCount: 45, photoCount: 3, matchPercent: 85, isOnline: true, isVerified: true,
  },
  {
    id: 'male-002', user_id: 'male-user-002',
    name: 'しょう', age: 32, gender: 'male', looking_for: 'female',
    bio: '京都で会社員をしています。歴史や文化が好きで、休日は寺社巡りをよくしています。落ち着いた雰囲気の方が好みです。',
    avatar_url: null, photos: [], interests: ['歴史', '旅行', '読書', 'カフェ', '料理'],
    location: '京都府', occupation: '会社員', height: 174, bodyType: '普通', smoking: '吸わない',
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
    emoji: '⛩️', color: 'from-orange-300 to-amber-400',
    likeCount: 88, photoCount: 4, matchPercent: 79, isOnline: false, isVerified: true,
  },
  {
    id: 'male-003', user_id: 'male-user-003',
    name: 'ゆうき', age: 27, gender: 'male', looking_for: 'female',
    bio: '兵庫でエンジニアをしています。音楽とライブが大好き！一緒にフェスに行ける方を探しています🎵',
    avatar_url: null, photos: [], interests: ['音楽', 'ライブ', 'フェス', 'カフェ', 'ゲーム'],
    location: '兵庫県', occupation: 'エンジニア', height: 172, bodyType: 'やや細め', smoking: '吸わない',
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
    emoji: '🎵', color: 'from-purple-300 to-violet-400',
    likeCount: 134, photoCount: 3, matchPercent: 72, isOnline: true, isVerified: false,
  },
  {
    id: 'male-004', user_id: 'male-user-004',
    name: 'けいた', age: 29, gender: 'male', looking_for: 'female',
    bio: '大阪で営業をしています。グルメと旅行が趣味で、おいしいものを一緒に食べに行けるパートナーを探しています！',
    avatar_url: null, photos: [], interests: ['グルメ', '旅行', 'スポーツ', '映画', 'ドライブ'],
    location: '大阪府', occupation: '営業', height: 180, bodyType: 'がっしり', smoking: 'やめた',
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
    emoji: '🔥', color: 'from-red-300 to-orange-400',
    likeCount: 201, photoCount: 5, matchPercent: 81, isOnline: true, isVerified: true,
  },
  {
    id: 'male-005', user_id: 'male-user-005',
    name: 'ひろ', age: 31, gender: 'male', looking_for: 'female',
    bio: '滋賀で公務員として働いています。休日はアウトドアやドライブが好きです。真剣にお付き合いできる方を探しています。',
    avatar_url: null, photos: [], interests: ['アウトドア', 'ドライブ', '料理', 'スポーツ', 'DIY'],
    location: '滋賀県', occupation: '公務員', height: 176, bodyType: '普通', smoking: '吸わない',
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
    emoji: '🌙', color: 'from-indigo-300 to-blue-400',
    likeCount: 67, photoCount: 2, matchPercent: 90, isOnline: false, isVerified: true,
  },
  {
    id: 'male-006', user_id: 'male-user-006',
    name: 'たく', age: 26, gender: 'male', looking_for: 'female',
    bio: '奈良で医療職として働いています。仕事は忙しいですが、休日は料理やカフェ巡りで癒されています😊',
    avatar_url: null, photos: [], interests: ['料理', 'カフェ', '映画', '読書', 'ランニング'],
    location: '奈良県', occupation: '医療職', height: 171, bodyType: 'やや細め', smoking: '吸わない',
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
    emoji: '☀️', color: 'from-yellow-300 to-amber-400',
    likeCount: 39, photoCount: 2, matchPercent: 77, isOnline: true, isVerified: true,
  },
  // 俊也（DEMO_USER）も候補として表示
  {
    ...DEMO_USER,
    matchPercent: 93,
  },
]

// まいにいいね！した男性プロフィールID
export const MALE_LIKED_ME_IDS = new Set(['male-002', 'male-003'])

// マッチング後のmatchID対応
export const MATCH_ID_BY_MALE_PROFILE_ID: Record<string, string> = {
  'male-002': 'fmatch-002',
  'male-003': 'fmatch-003',
  [DEMO_USER.id]: 'match-demo-pair',
}

// 女性側のマッチ一覧
export const FEMALE_DEMO_MATCHES: DemoMatch[] = [
  {
    id: 'match-demo-pair',
    user1_id: FEMALE_USER_ID,
    user2_id: DEMO_USER_ID,
    created_at: new Date().toISOString(),
    last_message_at: null,
  },
  {
    id: 'fmatch-001',
    user1_id: FEMALE_USER_ID,
    user2_id: 'male-user-001',
    created_at: '2024-04-01T09:00:00Z',
    last_message_at: '2024-04-01T11:00:00Z',
  },
]

// プロフィールID → マッチID（lookupよう）
export const ALL_MALE_PROFILES: DemoProfile[] = MALE_CANDIDATES

// プロフィールマップ（user_id → profile）
export const MALE_PROFILE_MAP = new Map<string, DemoProfile>(
  [...MALE_CANDIDATES, DEMO_USER].map(p => [p.user_id, p])
)

// 事前シードのメッセージ
export const FEMALE_DEMO_MESSAGES: Record<string, DemoMessage[]> = {
  'fmatch-001': [
    {
      id: 'fm-001-1', match_id: 'fmatch-001', sender_id: 'male-user-001',
      content: 'はじめまして！まいさん、プロフィール見てカフェ好きが共通だと思っていいねしました😊',
      is_read: true, created_at: '2024-04-01T10:00:00Z',
    },
    {
      id: 'fm-001-2', match_id: 'fmatch-001', sender_id: FEMALE_USER_ID,
      content: 'はじめまして！りくさん、よろしくお願いします✨ デザイナーさんなんですね！',
      is_read: true, created_at: '2024-04-01T10:15:00Z',
    },
    {
      id: 'fm-001-3', match_id: 'fmatch-001', sender_id: 'male-user-001',
      content: 'そうなんです！まいさんは大阪のカフェとか行ったりしますか？おすすめあれば教えてほしいです😄',
      is_read: false, created_at: '2024-04-01T11:00:00Z',
    },
  ],
}
