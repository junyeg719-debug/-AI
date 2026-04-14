// ============================================================
// 魅力マッチ — デモ用モックデータ
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
  bodyType: string
  smoking: string
  created_at: string
  updated_at: string
  // visual placeholders (demo)
  emoji: string
  color: string
  // Omiai-style stats
  likeCount: number
  photoCount: number
  matchPercent: number
  isOnline: boolean
  isVerified: boolean
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

export interface DemoFootprint {
  id: string
  profile: DemoProfile
  visitedAt: string
  likeStatus: 'liked' | 'liked_x' | 'thanked' | null
  likeCount?: number
}

// ──────────────────────────────────────────────
// デモユーザー（ログイン中：男性ユーザー）
// ──────────────────────────────────────────────
export const DEMO_USER_ID = 'demo-user-001'
export const DEMO_USER: DemoProfile = {
  id: 'profile-demo-001',
  user_id: DEMO_USER_ID,
  name: '俊也',
  age: 28,
  gender: 'male',
  looking_for: 'female',
  bio: '滋賀在住のエンジニアです。週末はドライブやカフェ巡りが好きです。穏やかで笑顔の多い時間を一緒に過ごせる方と出会いたいです。',
  avatar_url: null,
  photos: [],
  interests: ['ドライブ', 'カフェ巡り', '料理', '旅行', '映画'],
  location: '滋賀県',
  occupation: 'エンジニア',
  height: 175,
  bodyType: '普通',
  smoking: '吸わない',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  emoji: '😊',
  color: 'from-sky-400 to-blue-500',
  likeCount: 130,
  photoCount: 4,
  matchPercent: 0,
  isOnline: true,
  isVerified: true,
}

// ──────────────────────────────────────────────
// 候補プロフィール（おすすめ／ブラウズ用）
// ──────────────────────────────────────────────
export const CANDIDATE_PROFILES: DemoProfile[] = [
  {
    id: 'profile-001', user_id: 'user-001',
    name: 'まい', age: 29, gender: 'female', looking_for: 'male',
    bio: 'サービス業で働いています。お休みの日はカフェや旅行によく行きます。明るくて話しやすい方が好みです！',
    avatar_url: null, photos: [],
    interests: ['カフェ巡り', '旅行', 'ショッピング', '映画', 'グルメ'],
    location: '滋賀県', occupation: 'サービス業', height: 164,
    bodyType: 'やや細め', smoking: '吸わない',
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
    emoji: '🌸', color: 'from-pink-300 to-rose-400',
    likeCount: 62, photoCount: 2, matchPercent: 83, isOnline: true, isVerified: true,
  },
  {
    id: 'profile-002', user_id: 'user-002',
    name: 'ゆき', age: 29, gender: 'female', looking_for: 'male',
    bio: 'イルミネーションやテーマパークが大好きです。楽しいことが好きな方、ぜひ話しかけてください😊',
    avatar_url: null, photos: [],
    interests: ['テーマパーク', 'イルミネーション', 'カフェ', '音楽', '旅行'],
    location: '滋賀県', occupation: '会社員', height: 160,
    bodyType: '普通', smoking: '吸わない',
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
    emoji: '✨', color: 'from-indigo-300 to-purple-400',
    likeCount: 213, photoCount: 2, matchPercent: 78, isOnline: true, isVerified: true,
  },
  {
    id: 'profile-003', user_id: 'user-003',
    name: 'りな', age: 27, gender: 'female', looking_for: 'male',
    bio: '大阪でOLをしています。休日はグルメ巡りやヨガを楽しんでいます。丁寧に向き合ってくれる方が好きです。',
    avatar_url: null, photos: [],
    interests: ['グルメ', 'ヨガ', '旅行', 'カフェ', '読書'],
    location: '大阪府', occupation: '会社員', height: 158,
    bodyType: 'やや細め', smoking: '吸わない',
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
    emoji: '🌺', color: 'from-rose-300 to-pink-400',
    likeCount: 1048, photoCount: 2, matchPercent: 77, isOnline: true, isVerified: true,
  },
  {
    id: 'profile-004', user_id: 'user-004',
    name: 'あかり', age: 27, gender: 'female', looking_for: 'male',
    bio: '笑顔が好きです。料理が得意で、おいしいものを一緒に食べに行ける方と仲良くなりたいです！',
    avatar_url: null, photos: [],
    interests: ['料理', 'グルメ', 'カフェ', 'ショッピング', '旅行'],
    location: '大阪府', occupation: '営業', height: 163,
    bodyType: '普通', smoking: '吸わない',
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
    emoji: '🌼', color: 'from-amber-300 to-yellow-400',
    likeCount: 978, photoCount: 3, matchPercent: 81, isOnline: false, isVerified: true,
  },
  {
    id: 'profile-005', user_id: 'user-005',
    name: 'みさき', age: 30, gender: 'female', looking_for: 'male',
    bio: '音楽とライブが大好き！休日は友達とフェスやコンサートに行くことが多いです。一緒に楽しめる方募集中♪',
    avatar_url: null, photos: [],
    interests: ['音楽', 'ライブ', 'フェス', '映画', 'カフェ'],
    location: '大阪府', occupation: '音楽関係', height: 155,
    bodyType: 'やや細め', smoking: '吸わない',
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
    emoji: '🎵', color: 'from-violet-300 to-purple-400',
    likeCount: 947, photoCount: 3, matchPercent: 81, isOnline: true, isVerified: false,
  },
  {
    id: 'profile-006', user_id: 'user-006',
    name: 'さやか', age: 32, gender: 'female', looking_for: 'male',
    bio: '和の文化が好きで、着物でお出かけすることもあります。落ち着いた雰囲気の方と一緒にゆっくり過ごしたいです。',
    avatar_url: null, photos: [],
    interests: ['着物', '和カフェ', '旅行', '読書', '映画'],
    location: '大阪府', occupation: '事務', height: 162,
    bodyType: '普通', smoking: '吸わない',
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
    emoji: '👘', color: 'from-teal-300 to-emerald-400',
    likeCount: 944, photoCount: 3, matchPercent: 76, isOnline: false, isVerified: true,
  },
  {
    id: 'profile-007', user_id: 'user-007',
    name: 'はるか', age: 25, gender: 'female', looking_for: 'male',
    bio: 'アウトドアが好きです。キャンプやハイキング、ドライブなど外で過ごすのが大好き！自然が好きな方ぜひ！',
    avatar_url: null, photos: [],
    interests: ['キャンプ', 'ハイキング', 'ドライブ', '旅行', '料理'],
    location: '京都府', occupation: '看護師', height: 157,
    bodyType: 'やや細め', smoking: '吸わない',
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
    emoji: '🌿', color: 'from-green-300 to-teal-400',
    likeCount: 389, photoCount: 4, matchPercent: 79, isOnline: true, isVerified: true,
  },
  {
    id: 'profile-008', user_id: 'user-008',
    name: 'ことね', age: 24, gender: 'female', looking_for: 'male',
    bio: 'テーマパークとアニメが大好きです。一緒にはしゃげる人と出会いたいです😄新メンバーです！よろしくお願いします！',
    avatar_url: null, photos: [],
    interests: ['テーマパーク', 'アニメ', 'ゲーム', 'カフェ', 'コスプレ'],
    location: '大阪府', occupation: 'アパレル', height: 153,
    bodyType: 'やや細め', smoking: '吸わない',
    created_at: '2024-04-13T00:00:00Z', updated_at: '2024-04-13T00:00:00Z',
    emoji: '🦆', color: 'from-cyan-300 to-sky-400',
    likeCount: 28, photoCount: 2, matchPercent: 74, isOnline: true, isVerified: false,
  },
]

// ──────────────────────────────────────────────
// マッチング済みプロフィール
// ──────────────────────────────────────────────
export const MATCHED_PROFILES: DemoProfile[] = [
  {
    id: 'profile-m01', user_id: 'user-m01',
    name: 'ふゆ', age: 29, gender: 'female', looking_for: 'male',
    bio: '花屋でアルバイトしながら、将来はフローリストを目指しています。花と猫が大好きです。',
    avatar_url: null, photos: [],
    interests: ['アート', 'ペット', 'カフェ巡り', '旅行', '写真'],
    location: '滋賀県', occupation: 'フローリスト(修業中)', height: 158,
    bodyType: '普通', smoking: '吸わない',
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
    emoji: '🌺', color: 'from-rose-300 to-pink-400',
    likeCount: 312, photoCount: 3, matchPercent: 88, isOnline: false, isVerified: true,
  },
  {
    id: 'profile-m02', user_id: 'user-m02',
    name: 'あん', age: 28, gender: 'female', looking_for: 'male',
    bio: 'カフェでバリスタをしています。コーヒーについて語れる人と友達になりたいです。読書も好きです。',
    avatar_url: null, photos: [],
    interests: ['カフェ巡り', '読書', '音楽', '料理', 'DIY'],
    location: '滋賀県', occupation: 'バリスタ', height: 163,
    bodyType: 'やや細め', smoking: '吸わない',
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
    emoji: '☕', color: 'from-amber-300 to-orange-400',
    likeCount: 224, photoCount: 2, matchPercent: 82, isOnline: true, isVerified: true,
  },
  {
    id: 'profile-m03', user_id: 'user-m03',
    name: 'R', age: 29, gender: 'female', looking_for: 'male',
    bio: '大阪でOLをしています。休日は友達とショッピングや映画を楽しんでいます。',
    avatar_url: null, photos: [],
    interests: ['ショッピング', '映画', 'グルメ', 'カフェ', 'ドライブ'],
    location: '大阪府', occupation: '会社員', height: 162,
    bodyType: '普通', smoking: '吸わない',
    created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
    emoji: '🌙', color: 'from-indigo-300 to-blue-400',
    likeCount: 445, photoCount: 4, matchPercent: 75, isOnline: false, isVerified: false,
  },
]

// ──────────────────────────────────────────────
// 「いいね！をくれた」プロフィール（新着）
// ──────────────────────────────────────────────
export const LIKES_RECEIVED: { profile: DemoProfile; likedAt: string; isNew: boolean }[] = [
  {
    profile: {
      id: 'profile-l01', user_id: 'user-l01',
      name: 'なな', age: 26, gender: 'female', looking_for: 'male',
      bio: 'ハリネズミカフェが好きで動物全般大好きです！看護師をしています。',
      avatar_url: null, photos: [],
      interests: ['動物', 'カフェ', '旅行', '料理', '読書'],
      location: '滋賀県', occupation: '看護師', height: 158,
      bodyType: 'やや細め', smoking: '吸わない',
      created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
      emoji: '🦔', color: 'from-orange-300 to-amber-400',
      likeCount: 86, photoCount: 3, matchPercent: 90, isOnline: true, isVerified: true,
    },
    likedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    isNew: true,
  },
  {
    profile: {
      id: 'profile-l02', user_id: 'user-l02',
      name: 'みほ', age: 25, gender: 'female', looking_for: 'male',
      bio: '受付の仕事をしています。笑顔が大切にしています😊',
      avatar_url: null, photos: [],
      interests: ['ショッピング', 'カフェ', '音楽', 'ドライブ', '旅行'],
      location: '滋賀県', occupation: '受付', height: 157,
      bodyType: '普通', smoking: '吸わない',
      created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
      emoji: '🌷', color: 'from-pink-300 to-rose-300',
      likeCount: 134, photoCount: 2, matchPercent: 83, isOnline: false, isVerified: true,
    },
    likedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    isNew: true,
  },
  {
    profile: {
      id: 'profile-l03', user_id: 'user-l03',
      name: 'えな', age: 27, gender: 'female', looking_for: 'male',
      bio: 'ヨガインストラクターをしています。自然と健康が好きです。',
      avatar_url: null, photos: [],
      interests: ['ヨガ', '自然', 'グルメ', '旅行', 'スポーツ'],
      location: '京都府', occupation: 'ヨガインストラクター', height: 161,
      bodyType: 'やや細め', smoking: '吸わない',
      created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
      emoji: '🧘', color: 'from-green-300 to-emerald-400',
      likeCount: 209, photoCount: 3, matchPercent: 79, isOnline: true, isVerified: true,
    },
    likedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    isNew: true,
  },
  {
    profile: CANDIDATE_PROFILES[0],
    likedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    isNew: false,
  },
  {
    profile: CANDIDATE_PROFILES[2],
    likedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    isNew: false,
  },
]

// ──────────────────────────────────────────────
// 足あとデータ
// ──────────────────────────────────────────────
export const DEMO_FOOTPRINTS: DemoFootprint[] = [
  // 4/12
  {
    id: 'fp-001',
    profile: {
      id: 'profile-f01', user_id: 'user-f01',
      name: 'かな', age: 28, gender: 'female', looking_for: 'male',
      bio: '受付事務をしています。', avatar_url: null, photos: [],
      interests: ['カフェ', '旅行', 'ショッピング'],
      location: '滋賀県', occupation: '受付', height: 157,
      bodyType: 'やや細め', smoking: '吸わない',
      created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
      emoji: '🌸', color: 'from-pink-300 to-rose-300',
      likeCount: 93, photoCount: 2, matchPercent: 83, isOnline: false, isVerified: true,
    },
    visitedAt: new Date('2026-04-12T21:06:00').toISOString(),
    likeStatus: 'liked_x',
    likeCount: 3,
  },
  {
    id: 'fp-002',
    profile: {
      id: 'profile-f02', user_id: 'user-f02',
      name: 'るな', age: 31, gender: 'female', looking_for: 'male',
      bio: '奈良でのんびり暮らしています。', avatar_url: null, photos: [],
      interests: ['旅行', '読書', 'カフェ'],
      location: '奈良県', occupation: '会社員', height: 169,
      bodyType: '普通', smoking: '吸わない',
      created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
      emoji: '🦌', color: 'from-yellow-300 to-amber-300',
      likeCount: 57, photoCount: 2, matchPercent: 80, isOnline: false, isVerified: false,
    },
    visitedAt: new Date('2026-04-12T10:05:00').toISOString(),
    likeStatus: 'liked',
  },
  // 4/11
  {
    id: 'fp-003',
    profile: CANDIDATE_PROFILES[0], // まい 29歳 滋賀
    visitedAt: new Date('2026-04-11T23:38:00').toISOString(),
    likeStatus: 'liked',
  },
  {
    id: 'fp-004',
    profile: {
      id: 'profile-f04', user_id: 'user-f04',
      name: 'きょうか', age: 28, gender: 'female', looking_for: 'male',
      bio: '京都の会社員です。歴史と和スイーツが好き。', avatar_url: null, photos: [],
      interests: ['歴史', '和カフェ', '旅行', '読書'],
      location: '京都府', occupation: '会社員', height: 155,
      bodyType: 'やや細め', smoking: '吸わない',
      created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
      emoji: '⛩️', color: 'from-red-300 to-rose-300',
      likeCount: 178, photoCount: 2, matchPercent: 72, isOnline: false, isVerified: true,
    },
    visitedAt: new Date('2026-04-11T20:41:00').toISOString(),
    likeStatus: 'liked_x',
    likeCount: 5,
  },
  {
    id: 'fp-005',
    profile: {
      id: 'profile-f05', user_id: 'user-f05',
      name: 'なな', age: 26, gender: 'female', looking_for: 'male',
      bio: 'ハリネズミカフェが好きで動物全般大好きです！看護師をしています。',
      avatar_url: null, photos: [],
      interests: ['動物', 'カフェ', '旅行', '料理', '読書'],
      location: '滋賀県', occupation: '看護師', height: 158,
      bodyType: 'やや細め', smoking: '吸わない',
      created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z',
      emoji: '🦔', color: 'from-orange-300 to-amber-400',
      likeCount: 86, photoCount: 3, matchPercent: 90, isOnline: true, isVerified: true,
    },
    visitedAt: new Date('2026-04-11T18:49:00').toISOString(),
    likeStatus: 'thanked',
  },
  // 4/10
  {
    id: 'fp-006',
    profile: CANDIDATE_PROFILES[7], // ことね 24歳 滋賀
    visitedAt: new Date('2026-04-10T15:22:00').toISOString(),
    likeStatus: 'liked',
  },
  {
    id: 'fp-007',
    profile: CANDIDATE_PROFILES[4], // みさき 30歳 大阪
    visitedAt: new Date('2026-04-10T11:10:00').toISOString(),
    likeStatus: null,
  },
]

// ──────────────────────────────────────────────
// マッチ
// ──────────────────────────────────────────────
export const DEMO_MATCHES: DemoMatch[] = [
  {
    id: 'match-001',
    user1_id: DEMO_USER_ID,
    user2_id: 'user-m01',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    last_message_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 'match-002',
    user1_id: DEMO_USER_ID,
    user2_id: 'user-m02',
    created_at: new Date(Date.now() - 114 * 24 * 60 * 60 * 1000).toISOString(),
    last_message_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'match-003',
    user1_id: DEMO_USER_ID,
    user2_id: 'user-m03',
    created_at: new Date(Date.now() - 113 * 24 * 60 * 60 * 1000).toISOString(),
    last_message_at: null,
  },
]

// ──────────────────────────────────────────────
// メッセージ
// ──────────────────────────────────────────────
export const DEMO_MESSAGES: Record<string, DemoMessage[]> = {
  'match-001': [
    {
      id: 'msg-001', match_id: 'match-001', sender_id: 'user-m01',
      content: 'マッチありがとうございます！よろしくお願いします😊',
      is_read: true, created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-002', match_id: 'match-001', sender_id: DEMO_USER_ID,
      content: 'こちらこそよろしくお願いします！プロフィール見て、花が好きなんですね',
      is_read: true, created_at: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-003', match_id: 'match-001', sender_id: 'user-m01',
      content: 'はい！毎日花に囲まれて幸せです🌸 俊也さんはエンジニアなんですね',
      is_read: true, created_at: new Date(Date.now() - 100 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-004', match_id: 'match-001', sender_id: DEMO_USER_ID,
      content: 'そうです！ドライブも好きで、滋賀の自然スポットよく行きますよ',
      is_read: true, created_at: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-005', match_id: 'match-001', sender_id: 'user-m01',
      content: 'いいですね！今度お花の写真送りますね📸',
      is_read: false, created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
  ],
  'match-002': [
    {
      id: 'msg-006', match_id: 'match-002', sender_id: DEMO_USER_ID,
      content: 'マッチありがとうございます！バリスタさんなんですね、コーヒー好きです☕',
      is_read: true, created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-007', match_id: 'match-002', sender_id: 'user-m02',
      content: 'わあ！コーヒー好きなんですね。どんな種類が好きですか？',
      is_read: true, created_at: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-008', match_id: 'match-002', sender_id: DEMO_USER_ID,
      content: 'ラテが好きです！あんさんのお店のコーヒー、ぜひ飲んでみたいです',
      is_read: true, created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'msg-009', match_id: 'match-002', sender_id: 'user-m02',
      content: 'ぜひ来てください！特別なラテアート作りますよ😄',
      is_read: true, created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
  ],
  'match-003': [],
}

// 全プロフィール（検索用）
export const ALL_PROFILES: DemoProfile[] = [
  ...CANDIDATE_PROFILES,
  ...MATCHED_PROFILES,
]
