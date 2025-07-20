import { useParams } from 'react-router-dom'
import { Tasks } from './Dashboard'

export default function GroupTasksPage() {
  const { groupId } = useParams()
  return (
    <div className="container py-5">
      <h2 className="mb-4">Group Tasks</h2>
      <Tasks group={{ id: groupId }} />
    </div>
  )
} 