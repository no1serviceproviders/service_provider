import React, { useEffect, useState } from 'react'
import axios from '../api/axios'
import { base_url } from '../config/config'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({children}) => {
    const [isAuth,setIsAuth] = useState(null)

    useEffect(()=>
    {
        axios.get(`${base_url}/api/dashboard`)
        .then(()=>setIsAuth(true))
        .catch(()=>setIsAuth(false))
    },[])

    if(isAuth === null) return <p>loading...</p>
    if(!isAuth) return <Navigate to='/login'/>
  return children 
}

export default ProtectedRoute