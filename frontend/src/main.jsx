import React from 'react'
import ReactDOM from 'react-dom/client'
import axios from 'axios'
import App from './App'
import './styles/App.css'

// Set axios base URL from env variable
// In production (Vercel): uses VITE_API_URL = https://smart-voting-backend.onrender.com
// In development (localhost): uses empty string so Vite proxy handles /api/...
axios.defaults.baseURL = import.meta.env.VITE_API_URL || ''

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)