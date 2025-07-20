import { useParams } from 'react-router-dom'
import { Chat } from './Dashboard'

export default function GroupChatPage() {
  const { groupId } = useParams()
  return (
    <div className="container py-5">
      <h2 className="mb-4">Group Chat</h2>
      <Chat group={{ id: groupId }} />
    </div>
  )
} 