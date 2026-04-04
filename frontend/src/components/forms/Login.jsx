import React, { useState } from 'react'
import axios from 'axios'
import { base_url } from '../config/config'

const Login = () => {

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [msg, setMsg] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    // ✅ check empty fields
    if (!formData.email || !formData.password) {
      setMsg(
        <p className='text-red-500 p-2 rounded-xl bg-red-200 w-fit'>
          All fields are required ❌
        </p>
      )
      return
    }

    try {
      const res = await axios.post(`${base_url}/user/login`, formData)

      if (res.status === 200) {
        setMsg(
          <p className='text-green-700 p-2 rounded-xl bg-green-200 w-fit'>
            Login successfully ✅
          </p>
        )
        console.log('login successfully')
      }

    } catch (err) {

      if (err.response) {
        const status = err.response.status

        switch (status) {
          case 400:
            setMsg(
              <p className='text-red-500 p-2 rounded-xl bg-red-200 w-fit'>
                Email is invalid ❌
              </p>
            )
            break

          case 401:
            setMsg(
              <p className='text-red-500 p-2 rounded-xl bg-red-200 w-fit'>
                Password is invalid ❌
              </p>
            )
            break

          default:
            setMsg(
              <p className='text-red-500 p-2 rounded-xl bg-red-200 w-fit'>
                Server error ❌
              </p>
            )
        }

      } else {
        setMsg(
          <p className='text-red-500 p-2 rounded-xl bg-red-200 w-fit'>
            Server not reachable ❌
          </p>
        )
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="w-full max-w-md bg-gray-200 p-8 rounded-xl shadow-sm border">

        <div className="mb-6 flex flex-col items-center justify-center gap-2">
          <h2 className="text-2xl font-semibold text-gray-800">Sign in</h2>
          <p className="text-sm text-gray-500 mt-1">
            Enter your credentials to continue
          </p>
          {msg}
        </div>

        <form className="space-y-5" onSubmit={handleLogin}>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email address
            </label>
            <input
              type="email"
              name='email'
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              name='password'
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white cursor-pointer py-2 rounded-md text-sm font-medium hover:bg-gray-900 transition"
          >
            Sign in
          </button>

        </form>

        <p className="text-sm text-gray-500 mt-6 text-center">
          Don’t have an account?
          <a href="/register" className="text-black font-medium ml-1 hover:underline">
            Sign up
          </a>
        </p>

      </div>

    </div>
  )
}

export default Login