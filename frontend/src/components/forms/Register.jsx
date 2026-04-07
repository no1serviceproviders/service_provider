import React, { useState } from 'react'
import axios from '../api/axios'
import { useNavigate, Link } from 'react-router-dom'

const Register = () => {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    email: '',
    password: ''
  })

  const [msg, setMsg] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    // ✅ validation
    if (!formData.username || !formData.phone || !formData.email || !formData.password) {
      setMsg(
        <p className='text-red-500 p-2 rounded-xl bg-red-200 w-fit'>
          All fields are required ❌
        </p>
      )
      return
    }

    try {
      const res = await axios.post(
        "/api/user/register",
        formData
      )

      if (res.status === 200) {
        setMsg(
          <p className='text-green-700 p-2 rounded-xl bg-green-200 w-fit'>
            Registered successfully ✅
          </p>
        )

        // 🔥 redirect to login after 1 sec
        setTimeout(() => {
          navigate("/login")
        }, 1000)
      }

    } catch (err) {
      console.log(err)
      if (err.response?.status === 400) {
        setMsg(
          <p className='text-red-500 p-2 rounded-xl bg-red-200 w-fit'>
            User already exists ❌
          </p>
        )
      } else {
        setMsg(
          <p className='text-red-500 p-2 rounded-xl bg-red-200 w-fit'>
            Server error ❌
          </p>
        )
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="w-full max-w-md bg-gray-200 p-8 rounded-xl shadow-sm border">

        <div className="mb-6 flex flex-col items-center gap-2">
          <h2 className="text-2xl font-semibold text-gray-800">Create Account</h2>
          <p className="text-sm text-gray-500">
            Fill in your details to register
          </p>
          {msg}
        </div>

        <form className="space-y-5" onSubmit={handleRegister}>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Name
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Your name"
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-black text-white cursor-pointer py-2 rounded-md text-sm font-medium hover:bg-gray-900 transition"
          >
            Register
          </button>

        </form>

        {/* Redirect */}
        <p className="text-sm text-gray-500 mt-6 text-center">
          Already have an account?
          <Link to="/login" className="text-black font-medium ml-1 hover:underline">
            Sign in
          </Link>
        </p>

      </div>

    </div>
  )
}

export default Register
