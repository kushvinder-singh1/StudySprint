import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CreateGroupPage() {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    description: '',
    goal: '',
    exam_date: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [myGroups, setMyGroups] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchMyGroups()
  }, [])

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
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/groups/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access')}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setSuccess('Group created successfully!')
        setFormData({ name: '', subject: '', description: '', goal: '', exam_date: '' })
        await fetchMyGroups()
      } else {
        const errorData = await response.json()
        setError(typeof errorData === 'string' ? errorData : JSON.stringify(errorData))
      }
    } catch (err) {
      setError('Failed to create group')
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg">
            <div className="card-header">
              <h2 className="mb-0">Create a Study Group</h2>
            </div>
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Group Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    className="form-control"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Goal</label>
                  <input
                    type="text"
                    className="form-control"
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Exam Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="exam_date"
                    value={formData.exam_date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">Create Group</button>
              </form>
            </div>
          </div>

          <div className="card mt-4 shadow-lg">
            <div className="card-header">
              <h3 className="mb-0">My Groups</h3>
            </div>
            <div className="card-body">
              {myGroups.length === 0 ? (
                <p className="text-muted">You haven't joined any groups yet.</p>
              ) : (
                <div className="list-group">
                  {myGroups.map(group => (
                    <div key={group.id} className="list-group-item">
                      <h5 className="mb-1">{group.name}</h5>
                      <p className="mb-1 text-muted">{group.subject}</p>
                      <small className="text-muted">Goal: {group.goal} | Exam: {group.exam_date}</small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 