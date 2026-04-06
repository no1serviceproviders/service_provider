import axios from "axios"

const instance = axios.create({
  baseURL: "https://service-provider-nbcy.onrender.com",
  withCredentials: true
})

export default instance
