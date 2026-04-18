import { DEMO_MATCHES } from '@/lib/demo-data'
import ChatClient from './ChatClient'

export function generateStaticParams() {
  return DEMO_MATCHES.map((m) => ({ id: m.id }))
}

export default function ChatPage({ params }: { params: { id: string } }) {
  return <ChatClient matchId={params.id} />
}
