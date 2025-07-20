import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { VideoCall } from './Dashboard'

export default function VideoCallPage() {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const [show, setShow] = useState(true)
  const [group, setGroup] = useState({ id: groupId, name: 'Group' })

  useEffect(() => {
    fetch(`/api/groups/${groupId}/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
    })
      .then(res => res.json())
      .then(data => setGroup(data))
      .catch(() => setGroup({ id: groupId, name: 'Group' }))
  }, [groupId])

  return (
    <div className="container py-5">
      <h2 className="mb-4">Group Video Call</h2>
      {show && <VideoCall group={group} onClose={() => { setShow(false); navigate('/dashboard') }} />}
      {!show && <button className="btn btn-primary" onClick={() => setShow(true)}>Rejoin Call</button>}
    </div>
  )
} 