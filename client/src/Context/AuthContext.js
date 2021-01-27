import React, { useState, useEffect, createContext } from 'react'

const Context = createContext()

const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false

    const token = localStorage.getItem('token')

    if (!isCancelled) {
      if (token) {
        setAuthenticated(true)
      }

      setLoading(false)
    }

    return () => {
      isCancelled = true;
    }
  }, []);

  const handleLogin = async () => {
    setAuthenticated(true)
  }

  const handleLogout = async () => {
    setAuthenticated(false)
  }

  if (loading) return <h1>Loading...</h1>

  return (
    <Context.Provider value={{ authenticated, handleLogin, handleLogout }}>
      {children}
    </Context.Provider>
  )
}

export { Context, AuthProvider }