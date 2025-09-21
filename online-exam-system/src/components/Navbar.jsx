import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, logout } = useAuth()
  return (
    <header className="navbar">
      <Link to="/" className="brand">Online Exam</Link>
      <nav>
        <Link to="/exams">Exams</Link>
        <Link to="/results">Results</Link>
      </nav>
      <div className="auth">
        {user ? (
          <>
            <span className="muted">Hi, {user.name}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </header>
  )
}

export default Navbar

