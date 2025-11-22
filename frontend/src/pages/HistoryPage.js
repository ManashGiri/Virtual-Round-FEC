"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Sidebar from "../components/Sidebar"
import HistoryTable from "../components/HistoryTable"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

function HistoryPage({ user }) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState("")

  useEffect(() => {
    fetchHistory()
  }, [product])

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/operations/history`, {
        params: { warehouse: user.warehouse, product: product || undefined },
        withCredentials: true,
      })
      setHistory(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching history:", error)
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="app-container">
      <Sidebar user={user} />
      <div className="main-content p-8">
        <h1 className="text-3xl font-bold mb-8">Move History & Audit Trail</h1>

        <div className="card">
          <HistoryTable history={history} />
        </div>
      </div>
    </div>
  )
}

export default HistoryPage
