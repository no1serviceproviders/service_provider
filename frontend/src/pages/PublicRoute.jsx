import React from 'react'
import { Navigate,Outlet } from 'react-router-dom'
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'
import { base_url } from '../components/config/config'

const PublicRoute = () => {
    const[auth,setAuth] = useState(null)

    useEffect(()=>
    {
        axios.get(`${base_url}/user/verify`,{withCredentials:true})
        .then(()=>setAuth(true))
        .catch(()=>setAuth(false))
    },[])
    if(auth === null)  return <h3>loading</h3>
  return auth ? <Navigate to='/dashboard'/> : <Outlet/>
}

export default PublicRoute