import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await register(name, email, password)
      navigate('/exams')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>Name<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" /></label>
        <label>Email<input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></label>
        <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" /></label>
        {error && <div className="error">{error}</div>}
        <button type="submit">Register</button>
      </form>
      <p>Have an account? <Link to="/login">Sign in</Link></p>
    </div>
  )
}

export default Register

