import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'

function Results() {
  const { user } = useAuth()
  const [attempts, setAttempts] = useState([])
  const location = useLocation()

  useEffect(() => {
    api.listAttempts(user?.id).then(setAttempts)
  }, [user?.id, location.key])

  if (!user) return <div>Please login to view results.</div>

  return (
    <div>
      <h2>Your Results</h2>
      {attempts.length === 0 && <div>No attempts yet.</div>}
      <ul className="list">
        {attempts.map((a) => (
          <li key={a.id} className="list-item">
            <div>
              <div className="title">{a.examId}</div>
              <div className="muted">{new Date(a.date).toLocaleString()}</div>
            </div>
            <div>{a.score}/{a.total} ({a.percentage}%)</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Results

