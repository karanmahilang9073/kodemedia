import { createContext, useState } from 'react'

// create context
export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  // get token from localStorage on app load
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token')
  })

  // login function
  const login = (newToken) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
  }

  // logout function
  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  const isAuthenticated = !!token

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
