import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './Login'
import Register from './Register'
import Dashboard from './Dashboard'
import './index.css'
import { useEffect, useState } from 'react'
import VideoCallPage from './VideoCallPage'
import GroupChatPage from './GroupChatPage'
import GroupTasksPage from './GroupTasksPage'
import CreateGroupPage from './CreateGroupPage'
import MyTasksPage from './MyTasksPage'

function Logo() {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="30" r="28" fill="#8ec5fc" stroke="#4e54c8" strokeWidth="2" />
      <path d="M22 36c3 4 13 4 16 0" stroke="#4e54c8" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="24" cy="26" r="3" fill="#fff" stroke="#4e54c8" strokeWidth="2" />
      <circle cx="36" cy="26" r="3" fill="#fff" stroke="#4e54c8" strokeWidth="2" />
      <circle cx="24" cy="27" r="1" fill="#4e54c8" />
      <circle cx="36" cy="27" r="1" fill="#4e54c8" />
    </svg>
  )
}

function Landing() {
  return (
    <div className="landing-bg min-vh-100 d-flex flex-column align-items-center justify-content-center">
      <div className="text-center p-5 card shadow-lg landing-hero" style={{maxWidth: 600, background:'rgba(255,255,255,0.97)'}}>
        <Logo />
        <h1 className="display-3 fw-bold mb-2 animated-gradient-text bounce-effect" style={{letterSpacing:'2px'}}>Welcome to <span className="brand-gradient">StudySprint</span></h1>
        <h4 className="mb-4 text-secondary">Peer Study Group Finder</h4>
        <p className="mb-4 fs-5">Find and join micro study groups based on shared subjects, topics, goals, and exam timelines. Chat, collaborate, and stay accountable every day!</p>
        <a href="/register" className="btn btn-primary btn-lg me-2">Get Started</a>
        <a href="/login" className="btn btn-outline-primary btn-lg">Login</a>
        <div className="mt-4">
          <span className="badge bg-info text-dark">INTERMEDIATE PROJECT</span>
        </div>
      </div>
      <div className="mt-5 w-100" style={{maxWidth: 900}}>
        <div className="row g-4 justify-content-center">
          <div className="col-md-4">
            <div className="card p-3 h-100 text-center border-0 shadow-sm">
              <div className="mb-2"><span role="img" aria-label="search" style={{fontSize:'2rem'}}>🔍</span></div>
              <h5>Smart Matching</h5>
              <p className="text-muted">Get matched with peers based on subjects, goals, and exam dates.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-3 h-100 text-center border-0 shadow-sm">
              <div className="mb-2"><span role="img" aria-label="chat" style={{fontSize:'2rem'}}>💬</span></div>
              <h5>Real-time Chat</h5>
              <p className="text-muted">Collaborate and motivate each other with built-in group chat.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-3 h-100 text-center border-0 shadow-sm">
              <div className="mb-2"><span role="img" aria-label="checklist" style={{fontSize:'2rem'}}>✅</span></div>
              <h5>Daily Accountability</h5>
              <p className="text-muted">Track your progress and stay on top of your study goals every day.</p>
            </div>
          </div>
        </div>
        <div className="mt-5 text-center">
          <h5 className="mb-3">Why students love StudySprint</h5>
          <div className="row g-3 justify-content-center">
            <div className="col-md-4">
              <div className="card p-3 border-0 shadow-sm">
                <div className="mb-2"><span role="img" aria-label="user" style={{fontSize:'1.5rem'}}>👩‍🎓</span></div>
                <p className="mb-0">"I found my perfect study group for finals! The chat and daily tasks kept me motivated."</p>
                <div className="text-muted small mt-1">— Priya, BSc Student</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-3 border-0 shadow-sm">
                <div className="mb-2"><span role="img" aria-label="user" style={{fontSize:'1.5rem'}}>🧑‍💻</span></div>
                <p className="mb-0">"The matching tool is genius. I met people with the same exam date and we crushed it together!"</p>
                <div className="text-muted small mt-1">— Alex, Engineering</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',zIndex:-1}}>
        <svg width="100%" height="100%">
          <circle cx="20%" cy="30%" r="120" fill="#e0c3fc" opacity="0.3" />
          <circle cx="80%" cy="70%" r="180" fill="#8ec5fc" opacity="0.2" />
          <circle cx="60%" cy="20%" r="90" fill="#e3ffe8" opacity="0.2" />
        </svg>
      </div>
    </div>
  )
}

function Sidebar({ children }) {
  const [myGroups, setMyGroups] = useState([])
  useEffect(() => {
    async function fetchMyGroups() {
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
      }
    }
    fetchMyGroups()
  }, [])
  const [selectedGroupId, setSelectedGroupId] = useState('')
  return (
    <div className="d-flex" style={{minHeight:'100vh'}}>
      <div className="sidebar bg-white shadow-sm p-4 d-flex flex-column align-items-center" style={{width:220}}>
        <div className="mb-4">
          <Logo />
          <div className="fw-bold mt-2" style={{fontSize:'1.2rem',color:'#4e54c8'}}>StudySprint</div>
        </div>
        <a href="/dashboard" className="btn btn-outline-primary w-100 mb-2">Dashboard</a>
        <a href="/my-groups" className="btn btn-outline-success w-100 mb-2">Create a Group</a>
        <a href="/my-tasks" className="btn btn-outline-info w-100 mb-2">My Tasks</a>
        <a href="/register" className="btn btn-outline-secondary w-100 mb-2">Register</a>
        <a href="/login" className="btn btn-outline-secondary w-100 mb-2">Login</a>
        <div className="w-100 mt-3">
          <div className="mb-2">Group Actions:</div>
          {myGroups.length === 0 ? (
            <>
              <button className="btn btn-outline-warning w-100 mb-2" disabled>Video Call</button>
              <button className="btn btn-outline-info w-100 mb-2" disabled>Group Chat</button>
            </>
          ) : (
            <>
              <select className="form-select mb-2" value={selectedGroupId} onChange={e => setSelectedGroupId(e.target.value)}>
                <option value="">Select Group</option>
                {myGroups.filter(Boolean).map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
              <a href={selectedGroupId ? `/video-call/${selectedGroupId}` : '#'} className={`btn btn-outline-warning w-100 mb-2${!selectedGroupId ? ' disabled' : ''}`}>Video Call</a>
              <a href={selectedGroupId ? `/group-chat/${selectedGroupId}` : '#'} className={`btn btn-outline-info w-100 mb-2${!selectedGroupId ? ' disabled' : ''}`}>Group Chat</a>
            </>
          )}
        </div>
        <a href="/" className="btn btn-link w-100 mt-auto">Home</a>
      </div>
      <div className="flex-grow-1" style={{minHeight:'100vh',background:'none'}}>
        {children}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Sidebar><Dashboard /></Sidebar>} />
        <Route path="/my-groups" element={<Sidebar><CreateGroupPage /></Sidebar>} />
        <Route path="/my-tasks" element={<Sidebar><MyTasksPage /></Sidebar>} />
        <Route path="/video-call/:groupId" element={<Sidebar><VideoCallPage /></Sidebar>} />
        <Route path="/group-chat/:groupId" element={<Sidebar><GroupChatPage /></Sidebar>} />
        <Route path="/group-tasks/:groupId" element={<Sidebar><GroupTasksPage /></Sidebar>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}
