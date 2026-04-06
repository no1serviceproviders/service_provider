import { useEffect, useState } from "react"
import { Navigate, useLocation } from "react-router-dom"
import instance from "../api/axios"

const ProtectedRoute = ({ children }) => {
  const [auth, setAuth] = useState(null)
  const location = useLocation()
  useEffect(() => {
    const verify = async () => {
      try {
        await instance.get("/api/user/verify")
        setAuth(true)
      } catch {
        setAuth(false)
      }
    }
    verify()
  }, [location])

  if (auth === null) {
    return <h1 className="text-center mt-10">Loading...</h1>
  }

  return auth ? children : <Navigate to="/login" />
}

export default ProtectedRoute
