import axios from "axios"

axios.defaults.withCredentials = true

axios.interceptors.response.use(
  res => res,
  err => {
    return Promise.reject(err)
  }
)

export default axios