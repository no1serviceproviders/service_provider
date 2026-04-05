// import React, { useEffect, useState } from 'react'
// import axios from '../api/axios'
// import { base_url } from '../config/config'
// import { Navigate } from 'react-router-dom'

// const ProtectedRoute = ({children}) => {
//     const [isAuth,setIsAuth] = useState(null)

//     useEffect(()=>
//     {
//         axios.get(`${base_url}/api/dashboard`)
//         .then(()=>setIsAuth(true))
//         .catch(()=>setIsAuth(false))
//     },[])

//     if(isAuth === null) return <p>loading...</p>
//     if(!isAuth) return <Navigate to='/login'/>
//   return children 
// }

// export default ProtectedRoute



import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import axios from "../api/axios"

const ProtectedRoute = ({ children }) => {
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

  return auth ? children : <Navigate to="/login" replace />
}

export default ProtectedRoute
