export type ChannelEvent =
  | { type: 'like_sent'; profileId: string }
  | { type: 'matched'; matchId: string }
  | { type: 'message'; matchId: string; msg: { id: string; content: string; senderId: string; createdAt: string } }

let _bc: BroadcastChannel | null = null

function getBC(): BroadcastChannel | null {
  if (typeof window === 'undefined') return null
  if (!_bc) try { _bc = new BroadcastChannel('matching-demo') } catch { return null }
  return _bc
}

export const channel = {
  send(event: ChannelEvent) { getBC()?.postMessage(event) },
  on(handler: (e: ChannelEvent) => void): () => void {
    const bc = getBC()
    if (!bc) return () => {}
    const fn = (e: MessageEvent) => handler(e.data as ChannelEvent)
    bc.addEventListener('message', fn)
    return () => bc.removeEventListener('message', fn)
  },
}
