"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Sidebar from "../components/Sidebar"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

function ProfilePage({ user, setUser }) {
  const [showReset, setShowReset] = useState(false)
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await axios.get(`${API_URL}/auth/logout`, { withCredentials: true })
      setUser(null)
      navigate("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const handlePasswordReset = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${API_URL}/auth/forgot-password`, { email })
      setMessage("OTP sent to your email")
    } catch (error) {
      setMessage("Error sending OTP")
    }
  }

  return (
    <div className="app-container">
      <Sidebar user={user} />
      <div className="main-content p-8">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="card">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
        </div>

        <div className="card">
          <button onClick={() => setShowReset(!showReset)} className="btn btn-primary mb-4">
            Reset Password
          </button>

          {showReset && (
            <form onSubmit={handlePasswordReset}>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary">
                Send OTP
              </button>
            </form>
          )}

          {message && <p className="mt-4">{message}</p>}
        </div>

        <div className="card">
          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
