import axios from "axios"

// Create an axios instance with a base URL and timeout settings
const request = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // use .env file to store the base URL
  timeout: 1000 * 60 * 10, // request timeout of 10 minutes
})

// Set up request interceptor to add Authorization header
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") // Get token from localStorage or any other storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error("Request Error:", error) // Log the error for debugging
    return Promise.reject(error)
  }
)

// Set up response interceptor for error handling
request.interceptors.response.use(
  (response) => {
    // return response
    const res = response
    // Example check for non-200 status code
    if (response.status !== 200) {
      console.error(`Error: ${res.data.message || "Unknown error"}`)
      return Promise.reject(new Error(res.data.message || "Error"))
    }
    return res // Return data if no issues
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem("token")
      window.location.href = "/login" // redirect to login page
    } else {
      console.error("Response Error:", error)
    }
    return Promise.reject(error)
  }
)

export default request
