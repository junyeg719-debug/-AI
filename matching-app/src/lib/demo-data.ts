// ============================================================
// デモ用モックデータ
// ============================================================

export interface DemoProfile {
  id: string
  user_id: string
  name: string
  age: number
  gender: 'male' | 'female' | 'other'
  looking_for: 'male' | 'female' | 'both'
  bio: string
  avatar_url: string | null
  photos: string[]
  interests: string[]
  location: string
  occupation: string
  height: number | null
  created_at: string
  updated_at: string
  // demo用: 絵文字アバター
  emoji: string
  color: string
}

export interface DemoMessage {
  id: string
  match_id: string
  sender_id: string
  content: string
  is_read: boolean
  created_at: string
}

export interface DemoMatch {
  id: string
  user1_id: string
  user2_id: string
  created_at: string
  last_message_at: string | null
}

// デモユーザー（ログイン中として扱う）
export const DEMO_USER_ID = 'demo-user-001'
export const DEMO_USER: DemoProfile = {
  id: 'profile-demo-001',
  user_id: DEMO_USER_ID,
  name: 'さくら',
  age: 25,
  gender: 'female',
  looking_for: 'male',
  bio: '旅行と料理が大好きです。週末はカフェ巡りをしています。一緒に楽しい時間を過ごせる人と出会いたいです！',
  avatar_url: null,
  photos: [],
  interests: ['旅行', '料理', 'カフェ巡り', '映画', '写真'],
  location: '東京都',
  occupation: 'デザイナー',
  height: 162,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  emoji: '🌸',
  color: 'from-rose-400 to-pink-500',
}

// 候補プロフィール（スワイプ用）
export const CANDIDATE_PROFILES: DemoProfile[] = [
  {
    id: 'profile-001', user_id: 'user-001',
    name: '健太', age: 28, gender: 'male', looking_for: 'female',
    bio: 'エンジニアをしています。週末はランニングや料理を楽しんでいます。穏やかで笑顔の絶えない関係を築きたいです。',
    avatar_url: null, photos: [],
    interests: ['ランニング', '料理', '音楽', '旅行', 'スポーツ'],
    location: '東京都', occupation: 'エンジニア', height: 175,
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
    emoji: '😊', color: 'from-sky-400 to-blue-500',
  },
  {
    id: 'profile-002', user_id: 'user-002',
    name: '大輝', age: 30, gender: 'male', looking_for: 'female',
    bio: '映画と読書が好きな文系男子です。休日はよく美術館に行きます。一緒に文化的な時間を過ごせる方を探しています。',
    avatar_url: null, photos: [],
    interests: ['映画', '読書', 'アート', 'カフェ巡り', 'ドライブ'],
    location: '神奈川県', occupation: '編集者', height: 178,
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
    emoji: '📚', color: 'from-violet-400 to-purple-500',
  },
  {
    id: 'profile-003', user_id: 'user-003',
    name: '拓海', age: 26, gender: 'male', looking_for: 'both',
    bio: '料理が得意で、よく手料理でおもてなしします。アウトドアも好きで、キャンプや登山によく行きます。',
    avatar_url: null, photos: [],
    interests: ['料理', 'アウトドア', 'ペット', '旅行', 'ランニング'],
    location: '埼玉県', occupation: '料理研究家', height: 172,
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
    emoji: '🍳', color: 'from-emerald-400 to-teal-500',
  },
  {
    id: 'profile-004', user_id: 'user-004',
    name: '誠', age: 32, gender: 'male', looking_for: 'female',
    bio: '音楽が大好きでギターを弾いています。バンド活動もしていて、ライブによく行きます。',
    avatar_url: null, photos: [],
    interests: ['音楽', 'ライブ', '映画', 'カフェ巡り', 'ドライブ'],
    location: '東京都', occupation: 'ミュージシャン', height: 180,
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
    emoji: '🎸', color: 'from-amber-400 to-orange-500',
  },
  {
    id: 'profile-005', user_id: 'user-005',
    name: '優斗', age: 27, gender: 'male', looking_for: 'female',
    bio: 'スポーツジムでインストラクターをしています。健康的な生活が好きで、一緒に運動できる人を探しています。',
    avatar_url: null, photos: [],
    interests: ['スポーツ', 'ヨガ', 'ランニング', '料理', '旅行'],
    location: '千葉県', occupation: 'フィットネスインストラクター', height: 177,
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
    emoji: '💪', color: 'from-fuchsia-400 to-pink-500',
  },
  {
    id: 'profile-006', user_id: 'user-006',
    name: '蓮', age: 29, gender: 'male', looking_for: 'female',
    bio: '旅行が趣味で、毎年海外に行っています。異文化に触れることが好きです。穏やかな性格です。',
    avatar_url: null, photos: [],
    interests: ['旅行', '写真', '料理', 'アート', '映画'],
    location: '大阪府', occupation: '旅行ライター', height: 174,
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
    emoji: '✈️', color: 'from-cyan-400 to-sky-500',
  },
]

// マッチング済みのデモユーザー
export const MATCHED_PROFILES: DemoProfile[] = [
  {
    id: 'profile-007', user_id: 'user-007',
    name: '凜', age: 24, gender: 'female', looking_for: 'male',
    bio: '花屋でアルバイトしながら、将来はフローリストを目指しています。花と猫が大好きです。',
    avatar_url: null, photos: [],
    interests: ['アート', 'ペット', 'カフェ巡り', '旅行', '写真'],
    location: '東京都', occupation: 'フローリスト(修業中)', height: 158,
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
    emoji: '🌺', color: 'from-rose-400 to-pink-500',
  },
  {
    id: 'profile-008', user_id: 'user-008',
    name: '葵', age: 26, gender: 'female', looking_for: 'male',
    bio: 'カフェでバリスタをしています。コーヒーについて語れる人と友達になりたいです。読書も好きです。',
    avatar_url: null, photos: [],
    interests: ['カフェ巡り', '読書', '音楽', '料理', 'DIY'],
    location: '神奈川県', occupation: 'バリスタ', height: 163,
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
    emoji: '☕', color: 'from-amber-400 to-orange-500',
  },
]

// デモマッチ
export const DEMO_MATCHES: DemoMatch[] = [
  {
    id: 'match-001',
    user1_id: DEMO_USER_ID,
    user2_id: 'user-007',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    last_message_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'match-002',
    user1_id: DEMO_USER_ID,
    user2_id: 'user-008',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    last_message_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
]

// デモメッセージ
export const DEMO_MESSAGES: Record<string, DemoMessage[]> = {
  'match-001': [
    {
      id: 'msg-001',
      match_id: 'match-001',
      sender_id: 'user-007',
      content: 'マッチありがとうございます！よろしくお願いします😊',
      is_read: true,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-002',
      match_id: 'match-001',
      sender_id: DEMO_USER_ID,
      content: 'こちらこそよろしくお願いします！プロフィール見て、花が好きなんですね',
      is_read: true,
      created_at: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-003',
      match_id: 'match-001',
      sender_id: 'user-007',
      content: 'はい！毎日花に囲まれて幸せです🌸 さくらさんはデザイナーなんですね',
      is_read: true,
      created_at: new Date(Date.now() - 100 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-004',
      match_id: 'match-001',
      sender_id: DEMO_USER_ID,
      content: 'そうです！花屋さんのデザインとかすごく素敵ですよね',
      is_read: true,
      created_at: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-005',
      match_id: 'match-001',
      sender_id: 'user-007',
      content: 'ありがとうございます！今度お花の写真送りますね📸',
      is_read: false,
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
  ],
  'match-002': [
    {
      id: 'msg-006',
      match_id: 'match-002',
      sender_id: DEMO_USER_ID,
      content: 'マッチありがとうございます！バリスタさんなんですね、コーヒー好きです☕',
      is_read: true,
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-007',
      match_id: 'match-002',
      sender_id: 'user-008',
      content: 'わあ！コーヒー好きなんですね。どんな種類が好きですか？',
      is_read: true,
      created_at: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-008',
      match_id: 'match-002',
      sender_id: DEMO_USER_ID,
      content: 'ラテが好きです！葵さんのお店のコーヒー、ぜひ飲んでみたいです',
      is_read: true,
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-009',
      match_id: 'match-002',
      sender_id: 'user-008',
      content: 'ぜひ来てください！特別なラテアート作りますよ😄',
      is_read: true,
      created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
  ],
}

// 検索用プロフィール（候補 + マッチ済み全員）
export const ALL_PROFILES: DemoProfile[] = [
  ...CANDIDATE_PROFILES,
  ...MATCHED_PROFILES,
]
