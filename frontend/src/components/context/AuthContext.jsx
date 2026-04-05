import { createContext, useState, useContext } from "react"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState(null)

  return (
    <AuthContext.Provider value={{ userEmail, setUserEmail }}>
      {children}
    </AuthContext.Provider>
  )
}

// custom hook
export const useAuth = () => useContext(AuthContext)