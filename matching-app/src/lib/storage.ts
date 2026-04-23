const KEYS = {
  remainingLikes: 'mk_remaining_likes',
  likedIds: 'mk_liked_ids',
  messages: (matchId: string) => `mk_messages_${matchId}`,
  userProfile: 'mk_user_profile',
  userBio: 'mk_user_bio',
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

  getMessages: (matchId: string) => get<unknown[]>(KEYS.messages(matchId), []),
  setMessages: (matchId: string, msgs: unknown[]) => set(KEYS.messages(matchId), msgs),

  getUserProfile: () => get<Record<string, string | string[]> | null>(KEYS.userProfile, null),
  setUserProfile: (profile: Record<string, string | string[]>) => set(KEYS.userProfile, profile),

  getUserBio: (fallback: string) => get<string>(KEYS.userBio, fallback),
  setUserBio: (bio: string) => set(KEYS.userBio, bio),
}
