import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ChatRoom from './ChatRoom'

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: matchId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // マッチ情報
  const { data: match } = await supabase
    .from('matches')
    .select('*')
    .eq('id', matchId)
    .single()

  if (!match || (match.user1_id !== user.id && match.user2_id !== user.id)) {
    redirect('/chat')
  }

  const partnerId = match.user1_id === user.id ? match.user2_id : match.user1_id

  const { data: partner } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', partnerId)
    .single()

  if (!partner) redirect('/chat')

  // 既存メッセージ
  const { data: initialMessages } = await supabase
    .from('messages')
    .select('*')
    .eq('match_id', matchId)
    .order('created_at', { ascending: true })

  // 未読を既読に
  await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('match_id', matchId)
    .neq('sender_id', user.id)
    .eq('is_read', false)

  return (
    <ChatRoom
      matchId={matchId}
      currentUserId={user.id}
      partner={partner}
      initialMessages={initialMessages ?? []}
    />
  )
}
