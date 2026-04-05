// import { useEffect, useState } from "react"
// import { Navigate } from "react-router-dom"
// import axios from "../api/axios"
// import { base_url } from "../config/config"

// const AuthRoute = ({ children }) => {
//   const [isAuth, setIsAuth] = useState(null)

//   useEffect(() => {
//     axios.get(`${base_url}/api/dashboard`)
//       .then(() => setIsAuth(true))
//       .catch(() => setIsAuth(false))
//   }, [])

//   if (isAuth === null) return <p>Loading...</p>

//   if (isAuth) return <Navigate to="/" />

//   return children
// }

// export default AuthRoute

import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import axios from "../api/axios"

const AuthRoute = ({ children }) => {
  const [auth, setAuth] = useState(null)

  useEffect(() => {
    const verify = async () => {
      try {
        await axios.get("/api/user/verify")
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

  return !auth ? children : <Navigate to="/" replace />
}

export default AuthRoute
