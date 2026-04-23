export type StoredMatch = { matchId: string; userId: string; matchedAt: string }

const KEYS = {
  remainingLikes: 'mk_remaining_likes',
  likedIds: 'mk_liked_ids',
  matches: 'mk_matches',
  messages: (matchId: string) => `mk_messages_${matchId}`,
  userProfile: 'mk_user_profile',
  userBio: 'mk_user_bio',
  userAvatar: 'mk_user_avatar',
  userPhotos: 'mk_user_photos',
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
  })
}

function get<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw !== null ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function set(key: string, value: unknown): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

export const storage = {
  getRemainingLikes: (initial: number) => get<number>(KEYS.remainingLikes, initial),
  setRemainingLikes: (n: number) => set(KEYS.remainingLikes, n),

  getLikedIds: () => get<string[]>(KEYS.likedIds, []),
  setLikedIds: (ids: string[]) => set(KEYS.likedIds, ids),
  addLikedId: (id: string) => {
    const ids = get<string[]>(KEYS.likedIds, [])
    if (!ids.includes(id)) set(KEYS.likedIds, [...ids, id])
  },

  getMatches: () => get<StoredMatch[]>(KEYS.matches, []),
  addMatch: (matchId: string, userId: string) => {
    const matches = get<StoredMatch[]>(KEYS.matches, [])
    if (!matches.find(m => m.matchId === matchId)) {
      set(KEYS.matches, [...matches, { matchId, userId, matchedAt: new Date().toISOString() }])
    }
  },

  getMessages: (matchId: string) => get<unknown[]>(KEYS.messages(matchId), []),
  setMessages: (matchId: string, msgs: unknown[]) => set(KEYS.messages(matchId), msgs),

  getUserProfile: () => get<Record<string, string | string[]> | null>(KEYS.userProfile, null),
  setUserProfile: (profile: Record<string, string | string[]>) => set(KEYS.userProfile, profile),

  getUserBio: (fallback: string) => get<string>(KEYS.userBio, fallback),
  setUserBio: (bio: string) => set(KEYS.userBio, bio),

  getUserAvatar: () => get<string | null>(KEYS.userAvatar, null),
  setUserAvatar: (base64: string) => set(KEYS.userAvatar, base64),

  getUserPhotos: () => get<(string | null)[]>(KEYS.userPhotos, Array(6).fill(null)),
  setUserPhotos: (photos: (string | null)[]) => set(KEYS.userPhotos, photos),
}
