"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Sidebar from "../components/Sidebar"
import ReceiptForm from "../components/ReceiptForm"
import ReceiptTable from "../components/ReceiptTable"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

function ReceiptsPage({ user, socket }) {
  const [receipts, setReceipts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [status, setStatus] = useState("")

  useEffect(() => {
    fetchReceipts()

    if (socket) {
      socket.on("receipt-created", (receipt) => fetchReceipts())
      socket.on("receipt-updated", (receipt) => fetchReceipts())
    }

    return () => {
      if (socket) {
        socket.off("receipt-created")
        socket.off("receipt-updated")
      }
    }
  }, [socket, status])

  const fetchReceipts = async () => {
    try {
      const response = await axios.get(`${API_URL}/operations/receipts`, {
        params: { warehouse: user.warehouse, status: status || undefined },
        withCredentials: true,
      })
      setReceipts(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching receipts:", error)
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="app-container">
      <Sidebar user={user} />
      <div className="main-content p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Incoming Stock (Receipts)</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? "Cancel" : "Create Receipt"}
          </button>
        </div>

        {showForm && (
          <ReceiptForm
            user={user}
            onReceiptCreated={() => {
              setShowForm(false)
              fetchReceipts()
            }}
          />
        )}

        <div className="form-group mb-6">
          <label>Filter by Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="Draft">Draft</option>
            <option value="Waiting">Waiting</option>
            <option value="Ready">Ready</option>
            <option value="Done">Done</option>
          </select>
        </div>

        <ReceiptTable receipts={receipts} onReceiptAccepted={fetchReceipts} user={user} />
      </div>
    </div>
  )
}

export default ReceiptsPage
