// import axios from "axios"

// axios.defaults.withCredentials = true

// axios.interceptors.response.use(
//   res => res,
//   err => {
//     return Promise.reject(err)
//   }
// )

// export default axios


import axios from "axios"

const instance = axios.create({
  baseURL: "https://service-provider-nbcy.onrender.com", // backend URL
  withCredentials: true
})

export default instance
