import { DEMO_MATCHES } from '@/lib/demo-data'
import ChatClient from './ChatClient'

export function generateStaticParams() {
  return DEMO_MATCHES.map((m) => ({ id: m.id }))
}

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ChatClient matchId={id} />
}
