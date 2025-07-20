import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Peer from 'peerjs'

function AnimatedBackground() {
  useEffect(() => {
    const body = document.body;
    body.style.background = 'linear-gradient(-45deg, #e3ffe8, #f9f9f9, #e0c3fc, #8ec5fc)';
    body.style.backgroundSize = '400% 400%';
    let pos = 0;
    let anim = setInterval(() => {
      pos += 1;
      body.style.backgroundPosition = `${pos % 400}% ${pos % 400}%`;
    }, 60);
    return () => {
      clearInterval(anim);
      body.style.background = '';
      body.style.backgroundSize = '';
      body.style.backgroundPosition = '';
    };
  }, []);
  return null;
}

export function Chat({ group }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [ws, setWs] = useState(null)

  useEffect(() => {
    fetch(`/api/messages/?group=${group.id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
    })
      .then(res => res.json())
      .then(setMessages)
    const socket = new window.WebSocket(`ws://${window.location.host}/ws/chat/${group.id}/`)
    socket.onmessage = e => {
      const data = JSON.parse(e.data)
      setMessages(m => [...m, { user: data.user, content: data.message }])
    }
    setWs(socket)
    return () => socket.close()
  }, [group.id])

  const send = e => {
    e.preventDefault()
    if (input.trim() && ws && ws.readyState === 1) {
      ws.send(JSON.stringify({ message: input }))
      setInput('')
    }
  }

  return (
    <div className="mb-4 card card-body bg-light border">
      <div style={{maxHeight: '250px', overflowY: 'auto'}} className="mb-2">
        {messages.map((m, i) => (
          <div key={i}><strong className="text-primary">{m.user}:</strong> {m.content}</div>
        ))}
      </div>
      <form onSubmit={send} className="d-flex gap-2">
        <input className="form-control" value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message..." />
        <button className="btn btn-primary">Send</button>
      </form>
    </div>
  )
}

export function Tasks({ group }) {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [due, setDue] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/tasks/?group=${group.id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
    })
      .then(res => res.json())
      .then(setTasks)
  }, [group.id])

  const addTask = async e => {
    e.preventDefault()
    setError('')
    if (!title.trim()) return
    const res = await fetch('/api/tasks/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access')}`
      },
      body: JSON.stringify({ group: group.id, title, due_date: due })
    })
    if (res.ok) {
      setTitle('')
      setDue('')
      fetch(`/api/tasks/?group=${group.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
      })
        .then(res => res.json())
        .then(setTasks)
    } else {
      try {
        const data = await res.json()
        setError(typeof data === 'string' ? data : JSON.stringify(data))
      } catch {
        setError('Failed to add task')
      }
    }
  }

  const toggleComplete = async task => {
    const res = await fetch(`/api/tasks/${task.id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access')}`
      },
      body: JSON.stringify({ completed: !task.completed })
    })
    if (res.ok) {
      setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t))
    }
  }

  const deleteTask = async taskId => {
    const res = await fetch(`/api/tasks/${taskId}/`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
    })
    if (res.ok) {
      setTasks(tasks.filter(t => t.id !== taskId))
    }
  }

  return (
    <div className="mb-4">
      <form onSubmit={addTask} className="row g-2 mb-3">
        <div className="col">
          <input 
            type="text" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="New task..." 
            className="form-control" 
          />
        </div>
        <div className="col">
          <input 
            type="date" 
            value={due} 
            onChange={e => setDue(e.target.value)} 
            className="form-control" 
          />
        </div>
        <div className="col-auto">
          <button type="submit" className="btn btn-success">Add</button>
        </div>
      </form>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="list-group">
        {tasks.map(task => (
          <div key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <input
                type="checkbox"
                className="form-check-input me-2"
                checked={task.completed}
                onChange={() => toggleComplete(task)}
              />
              <span className={task.completed ? 'text-decoration-line-through text-muted' : ''}>
                {task.title}
              </span>
              {task.due_date && (
                <small className="text-muted ms-2">Due: {task.due_date}</small>
              )}
            </div>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => deleteTask(task.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export function VideoCall({ group, onClose }) {
  const [peer, setPeer] = useState(null)
  const [myVideo, setMyVideo] = useState(null)
  const [remoteVideo, setRemoteVideo] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [roomId] = useState(`room-${group.id}`)

  useEffect(() => {
    const newPeer = new Peer()
    newPeer.on('open', id => {
      console.log('My peer ID:', id)
    })
    newPeer.on('call', call => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          setMyVideo(stream)
          call.answer(stream)
          call.on('stream', remoteStream => {
            setRemoteVideo(remoteStream)
            setIsConnected(true)
          })
        })
    })
    setPeer(newPeer)
    return () => newPeer.destroy()
  }, [])

  const startCall = async () => {
    if (!peer) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      setMyVideo(stream)
      const call = peer.call(roomId, stream)
      call.on('stream', remoteStream => {
        setRemoteVideo(remoteStream)
        setIsConnected(true)
      })
    } catch (err) {
      console.error('Failed to get user media:', err)
    }
  }

  const joinCall = async () => {
    if (!peer) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      setMyVideo(stream)
      const call = peer.call(roomId, stream)
      call.on('stream', remoteStream => {
        setRemoteVideo(remoteStream)
        setIsConnected(true)
      })
    } catch (err) {
      console.error('Failed to get user media:', err)
    }
  }

  return (
    <div className="modal d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Video Call - {group.name}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6">
                <h6>Your Video</h6>
                {myVideo && (
                  <video 
                    ref={ref => ref && (ref.srcObject = myVideo)} 
                    autoPlay 
                    muted 
                    className="w-100 border"
                  />
                )}
              </div>
              <div className="col-md-6">
                <h6>Remote Video</h6>
                {remoteVideo && (
                  <video 
                    ref={ref => ref && (ref.srcObject = remoteVideo)} 
                    autoPlay 
                    className="w-100 border"
                  />
                )}
                {!remoteVideo && <div className="text-muted">Waiting for other participant...</div>}
              </div>
            </div>
            <div className="mt-3 text-center">
              <button className="btn btn-primary me-2" onClick={startCall}>Start Call</button>
              <button className="btn btn-success me-2" onClick={joinCall}>Join Call</button>
              <button className="btn btn-danger" onClick={onClose}>End Call</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ActionPromptModal({ onVideo, onChat, onClose }) {
  return (
    <div className="modal d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Choose Action</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body text-center">
            <p>What would you like to do with this group?</p>
            <div className="d-grid gap-2">
              <button className="btn btn-warning btn-lg" onClick={onVideo}>
                Start Video Call
              </button>
              <button className="btn btn-info btn-lg" onClick={onChat}>
                Open Group Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [groups, setGroups] = useState([])
  const [subject, setSubject] = useState('')
  const [goal, setGoal] = useState('')
  const [examDate, setExamDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [myGroups, setMyGroups] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [newGroup, setNewGroup] = useState({ name: '', subject: '', description: '', goal: '', exam_date: '' })
  const [createError, setCreateError] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [showActionPrompt, setShowActionPrompt] = useState(false)
  const [actionPromptGroup, setActionPromptGroup] = useState(null)
  const [alreadyJoinedMsg, setAlreadyJoinedMsg] = useState('')

  useEffect(() => {
    if (!localStorage.getItem('access')) navigate('/login')
    fetchGroups()
    fetchMyGroups()
  }, [])

  useEffect(() => {
    if (myGroups.length > 0) {
      fetchGroups()
    }
  }, [myGroups])

  const fetchGroups = async () => {
    setLoading(true)
    let url = `/api/groups/?subject=${subject}&goal=${goal}&exam_date=${examDate}`
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
    })
    if (res.ok) {
      const allGroups = await res.json()
      setGroups(allGroups)
    }
    setLoading(false)
  }

  const fetchMyGroups = async () => {
    const res = await fetch('/api/memberships/', {
      headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
    })
    if (res.ok) {
      const memberships = await res.json()
      const groups = memberships.map(m => {
        if (m.group_details) return m.group_details
        if (m.group && typeof m.group === 'object') return m.group
        return null
      }).filter(Boolean)
      setMyGroups(groups)
      
      if (groups.length > 0 && !selectedGroup) {
        setSelectedGroup(groups[0])
      }
    }
  }

  const handleCreateGroup = async e => {
    e.preventDefault()
    setCreateError('')
    const res = await fetch('/api/groups/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access')}`
      },
      body: JSON.stringify(newGroup)
    })
    if (res.ok) {
      const group = await res.json()
      setShowCreate(false)
      setNewGroup({ name: '', subject: '', description: '', goal: '', exam_date: '' })
      setGroups(prev => [...prev, group])
      await fetchMyGroups()
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 2000)
    } else {
      try {
        const data = await res.json()
        setCreateError(typeof data === 'string' ? data : JSON.stringify(data))
      } catch {
        setCreateError('Failed to create group')
      }
    }
  }

  const joinGroup = async groupId => {
    setActionPromptGroup(groups.find(g => g.id === groupId))
    setShowActionPrompt(true)
  }

  const actuallyJoinGroup = async groupId => {
    setMessage('')
    if (myGroups.some(mg => mg && mg.id === groupId)) {
      setAlreadyJoinedMsg('Already joined')
      setTimeout(() => setAlreadyJoinedMsg(''), 2000)
      return
    }
    const res = await fetch('/api/memberships/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access')}`
      },
      body: JSON.stringify({ group: groupId })
    })
    if (res.ok) {
      setMessage('Joined group!')
      await fetchMyGroups();
      const joinedGroup = groups.find(g => g.id === groupId)
      if (joinedGroup) {
        setSelectedGroup(joinedGroup)
      }
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 2000)
    } else {
      let msg = 'Failed to join group'
      try {
        const data = await res.json()
        if (JSON.stringify(data).includes('unique') || JSON.stringify(data).toLowerCase().includes('already')) {
          msg = 'Already joined'
        } else {
          msg = typeof data === 'string' ? data : JSON.stringify(data)
        }
      } catch {}
      setMessage(msg)
      await fetchMyGroups();
    }
  }

  function Confetti() {
    return (
      <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',pointerEvents:'none',zIndex:9999}}>
        {[...Array(60)].map((_,i) => (
          <div key={i} style={{
            position:'absolute',
            left: Math.random()*100+'vw',
            top: Math.random()*100+'vh',
            width:8,
            height:8,
            borderRadius:'50%',
            background:`hsl(${Math.random()*360},80%,70%)`,
            opacity:0.7,
            animation:`fall 1.5s linear ${Math.random()}s 1`}}
          />
        ))}
        <style>{`@keyframes fall{to{transform:translateY(80vh);opacity:0;}}`}</style>
      </div>
    )
  }

  return (
    <>
      <AnimatedBackground />
      {showConfetti && <Confetti />}
      {showActionPrompt && actionPromptGroup && (
        <ActionPromptModal
          onVideo={() => { setShowActionPrompt(false); actuallyJoinGroup(actionPromptGroup.id); setSelectedGroup(actionPromptGroup); setShowVideo(true); }}
          onChat={() => { setShowActionPrompt(false); actuallyJoinGroup(actionPromptGroup.id); navigate(`/group-chat/${actionPromptGroup.id}`); }}
          onClose={() => setShowActionPrompt(false)}
        />
      )}
      {showVideo && selectedGroup && (
        <VideoCall group={selectedGroup} onClose={() => setShowVideo(false)} />
      )}
      <div className="container py-5">
        <div className="card p-4 mx-auto shadow-lg" style={{maxWidth: '700px',background:'rgba(255,255,255,0.95)'}}>
          <h1 className="mb-4 text-center display-5 fw-bold animated-gradient-text bounce-effect">Welcome to StudySprint</h1>
          
          <h3 className="mb-3 cool-section-title">Accountability Tasks</h3>
          {selectedGroup ? (
            <Tasks group={selectedGroup} />
          ) : (
            <div className="alert alert-info text-center mb-4">Join a group to add accountability tasks.</div>
          )}
          
          <h3 className="mb-3 cool-section-title">Search Groups</h3>
          <form className="row g-2 mb-4" onSubmit={e => {e.preventDefault();fetchGroups()}}>
            <div className="col">
              <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject" className="form-control" />
            </div>
            <div className="col">
              <input type="text" value={goal} onChange={e => setGoal(e.target.value)} placeholder="Goal" className="form-control" />
            </div>
            <div className="col">
              <input type="date" value={examDate} onChange={e => setExamDate(e.target.value)} className="form-control" />
            </div>
            <div className="col-auto">
              <button type="submit" className="btn btn-primary">Search</button>
            </div>
          </form>
          {loading ? <div className="text-center">Loading...</div> : (
            <ul className="list-group mb-3">
              {groups.length === 0 && <li className="list-group-item text-center text-muted">No groups found</li>}
              {groups.map(g => {
                const isMember = myGroups.some(mg => mg && mg.id === g.id)
                return (
                  <li key={g.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-bold">{g.name}</div>
                      <div className="text-secondary small">{g.subject} | {g.goal} | Exam: {g.exam_date}</div>
                    </div>
                    <button 
                      className={`btn btn-sm ${isMember ? 'btn-secondary' : 'btn-success'}`} 
                      onClick={() => joinGroup(g.id)}
                      disabled={isMember}
                    >
                      {isMember ? 'Joined' : 'Join'}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
          {message && <div className="alert alert-success text-center mt-2">{message}</div>}
          {alreadyJoinedMsg && <div className="alert alert-info text-center mt-2">{alreadyJoinedMsg}</div>}
          
          <button className="btn btn-danger w-100 mt-3" onClick={() => {localStorage.clear();navigate('/login')}}>Logout</button>
        </div>
      </div>
    </>
  )
} 