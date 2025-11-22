"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import axios from "axios"
import io from "socket.io-client"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import DashboardPage from "./pages/DashboardPage"
import ProductsPage from "./pages/ProductsPage"
import ReceiptsPage from "./pages/ReceiptsPage"
import DeliveriesPage from "./pages/DeliveriesPage"
import TransfersPage from "./pages/TransfersPage"
import AdjustmentsPage from "./pages/AdjustmentsPage"
import HistoryPage from "./pages/HistoryPage"
import ProfilePage from "./pages/ProfilePage"
import "./App.css"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    // Initialize socket
    const newSocket = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:5000")
    setSocket(newSocket)

    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/me`, { withCredentials: true })
        setUser(response.data)
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    return () => {
      newSocket.close()
    }
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <Router>
      <Routes>
        {user ? (
          <>
            <Route path="/dashboard" element={<DashboardPage user={user} socket={socket} />} />
            <Route path="/products" element={<ProductsPage user={user} socket={socket} />} />
            <Route path="/receipts" element={<ReceiptsPage user={user} socket={socket} />} />
            <Route path="/deliveries" element={<DeliveriesPage user={user} socket={socket} />} />
            <Route path="/transfers" element={<TransfersPage user={user} socket={socket} />} />
            <Route path="/adjustments" element={<AdjustmentsPage user={user} socket={socket} />} />
            <Route path="/history" element={<HistoryPage user={user} socket={socket} />} />
            <Route path="/profile" element={<ProfilePage user={user} setUser={setUser} />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<LoginPage setUser={setUser} />} />
            <Route path="/signup" element={<SignupPage setUser={setUser} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </Router>
  )
}

export default App
