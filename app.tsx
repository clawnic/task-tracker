"use client"

import { useState, useEffect } from "react"
import { Login } from "./components/Login"
import { Dashboard } from "./components/Dashboard"
import { saveToLocalStorage, getFromLocalStorage, removeFromLocalStorage, STORAGE_KEYS } from "./utils/localStorage"

export default function App() {
  const [username, setUsername] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing login on app start
  useEffect(() => {
    const savedUsername = getFromLocalStorage(STORAGE_KEYS.USERNAME)
    if (savedUsername) {
      setUsername(savedUsername)
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (newUsername: string) => {
    setUsername(newUsername)
    saveToLocalStorage(STORAGE_KEYS.USERNAME, newUsername)
  }

  const handleLogout = () => {
    setUsername(null)
    removeFromLocalStorage(STORAGE_KEYS.USERNAME)
    removeFromLocalStorage(STORAGE_KEYS.TASKS)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      {username ? <Dashboard username={username} onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
    </div>
  )
}
