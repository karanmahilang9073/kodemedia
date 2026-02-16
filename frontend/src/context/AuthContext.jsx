import { createContext, useState } from 'react'

// create context
export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  // get token and userId from localStorage on app load
  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem('token')
    console.log('Auth init - token:', savedToken)
    return savedToken
  })

  const [userId, setUserId] = useState(() => {
    const savedUserId = localStorage.getItem('userId')
    console.log('Auth init - userId:', savedUserId)
    return savedUserId
  })

  // login function
  const login = (newToken, newUserId) => {
    console.log('Login called with:', { newToken: newToken?.substring(0, 20) + '...', newUserId })
    const userIdStr = String(newUserId)
    localStorage.setItem('token', String(newToken))
    localStorage.setItem('userId', userIdStr)
    console.log('Storage after save:', { token: localStorage.getItem('token')?.substring(0, 20) + '...', userId: localStorage.getItem('userId') })
    setToken(String(newToken))
    setUserId(userIdStr)
  }

  // logout function
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    setToken(null)
    setUserId(null)
  }

  const isAuthenticated = !!token

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        isAuthenticated,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
