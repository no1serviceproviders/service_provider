import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import instance from "../api/axios"

const AuthRoute = ({ children }) => {
  const [auth, setAuth] = useState(null)

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
  }, [])

  if (auth === null) {
    return <h1 className="text-center mt-10">Loading...</h1>
  }

  return !auth ? children : <Navigate to="/" />
}

export default AuthRoute
