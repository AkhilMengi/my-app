import { useState, useEffect } from 'react'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const loggedIn = localStorage.getItem('isLoggedIn')
    if (loggedIn) {
      setIsLoggedIn(true)
    }
    setIsLoading(false)
  }, [])

  const handleLoginSuccess = () => {
    setIsLoggedIn(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className={isDark ? 'dark' : 'light'}>
      {isLoggedIn ? (
        <Dashboard isDark={isDark} setIsDark={setIsDark} />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} isDark={isDark} setIsDark={setIsDark} />
      )}
    </div>
  )
}

export default App
