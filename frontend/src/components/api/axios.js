import axios from "axios"

const instance = axios.create({
  baseURL: "https://service-provider-frontend-hlu9.onrender.com",
  withCredentials: true
})

export default instance
