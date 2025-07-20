import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    try {
      const response = await fetch('/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('access', data.access)
        localStorage.setItem('refresh', data.refresh)
        navigate('/dashboard')
      } else {
        const errorData = await response.json()
        setError(errorData.detail || 'Login failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
      <div className="card p-4 shadow-lg" style={{maxWidth: '400px', width: '100%'}}>
        <h2 className="text-center mb-4">Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        <div className="text-center mt-3">
          <a href="/register" className="text-decoration-none">Don't have an account? Register</a>
        </div>
      </div>
    </div>
  )
} 