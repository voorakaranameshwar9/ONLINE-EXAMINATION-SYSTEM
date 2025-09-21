import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'

function Exams() {
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.listExams().then((data) => { setExams(data); setLoading(false) })
  }, [])

  if (loading) return <div>Loading exams...</div>

  return (
    <div>
      <h2>Available Exams</h2>
      <ul className="list">
        {exams.map((e) => (
          <li key={e.id} className="list-item">
            <div>
              <div className="title">{e.title}</div>
              <div className="muted">Duration: {e.durationMinutes} min</div>
            </div>
            <Link to={`/exams/${e.id}`}>Start</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Exams