import { useState, useEffect } from 'react'

export default function MyTasksPage() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
      })
      if (response.ok) {
        const data = await response.json()
        setTasks(data)
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleComplete = async (task) => {
    try {
      const response = await fetch(`/api/tasks/${task.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access')}`
        },
        body: JSON.stringify({ completed: !task.completed })
      })
      if (response.ok) {
        setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t))
      }
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
      })
      if (response.ok) {
        setTasks(tasks.filter(t => t.id !== taskId))
      }
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg">
            <div className="card-header">
              <h2 className="mb-0">My Tasks</h2>
            </div>
            <div className="card-body">
              {tasks.length === 0 ? (
                <p className="text-muted text-center">No tasks found.</p>
              ) : (
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
                        {task.group && (
                          <small className="text-muted ms-2">Group: {task.group}</small>
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 