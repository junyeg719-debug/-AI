import { FEMALE_DEMO_MATCHES } from '@/lib/female-demo-data'
import FemaleChatClient from './FemaleChatClient'

export function generateStaticParams() {
  return FEMALE_DEMO_MATCHES.map(m => ({ id: m.id }))
}

export default async function FemaleChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <FemaleChatClient matchId={id} />
}
