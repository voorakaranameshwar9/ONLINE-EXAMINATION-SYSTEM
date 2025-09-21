import { Outlet, Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import './App.css'

function App() {
  return (
    <div className="container">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default App
