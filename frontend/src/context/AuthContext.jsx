import { createContext, useCallback,  useMemo,  useState } from 'react'

export const AuthContext =  createContext()

export const AuthProvider = ({children}) => {
  const [token, setToken] = useState(() =>{
    return localStorage.getItem('token')
  })

  const [userId, setUserId] = useState(() =>{
    return localStorage.getItem('userId')
  })

  const login = useCallback((newToken, newUserId)=> {
    const userIdStr = String(newUserId)
    localStorage.setItem('token', String(newToken))
    localStorage.setItem('userId', userIdStr)
    setToken(String(newToken))
    setUserId(userIdStr)
  },[])

  const logout = useCallback(()=>{
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    setToken(null)
    setUserId(null)
  },[])

  const isAuthenticated = !!token

  const value = useMemo(() => ({
    token,
    userId,
    isAuthenticated,
    login,
    logout
  }), [token, userId, isAuthenticated, login, logout])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}