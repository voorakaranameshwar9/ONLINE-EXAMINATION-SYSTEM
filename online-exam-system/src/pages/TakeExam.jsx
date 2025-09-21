import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

function TakeExam() {
  const { examId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [exam, setExam] = useState(null)
  const [answers, setAnswers] = useState([])
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.getExam(examId).then((e) => {
      setExam(e)
      setAnswers(Array(e.questions.length).fill(null))
      setSecondsLeft(e.durationMinutes * 60)
    })
  }, [examId])

  useEffect(() => {
    if (!secondsLeft) return
    const id = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(id)
  }, [secondsLeft])

  useEffect(() => {
    if (secondsLeft === 0 && exam && !submitting) {
      handleSubmit()
    }
  }, [secondsLeft, exam])

  const formattedTime = useMemo(() => {
    const m = Math.floor(secondsLeft / 60)
    const s = secondsLeft % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }, [secondsLeft])

  if (!exam) return <div>Loading exam...</div>

  const handleChange = (qIdx, optionIdx) => {
    setAnswers((prev) => {
      const copy = [...prev]
      copy[qIdx] = optionIdx
      return copy
    })
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    const attempt = await api.submitAttempt({ examId, userId: user.id, answers })
    navigate(`/results/${attempt.id}`, { state: { attempt } })
  }

  return (
    <div>
      <div className="exam-header">
        <h2>{exam.title}</h2>
        <div className="timer">Time left: {formattedTime}</div>
      </div>
      <ol className="questions">
        {exam.questions.map((q, qIdx) => (
          <li key={q.id} className="question">
            <div className="q-text">{q.text}</div>
            <div className="options">
              {q.options.map((opt, oIdx) => (
                <label key={oIdx} className={`option ${answers[qIdx] === oIdx ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    checked={answers[qIdx] === oIdx}
                    onChange={() => handleChange(qIdx, oIdx)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </li>
        ))}
      </ol>
      <button disabled={submitting} onClick={handleSubmit}>Submit</button>
    </div>
  )
}

export default TakeExam

