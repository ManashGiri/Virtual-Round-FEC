"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Sidebar from "../components/Sidebar"
import TransferForm from "../components/TransferForm"
import TransferTable from "../components/TransferTable"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

function TransfersPage({ user, socket }) {
  const [transfers, setTransfers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [status, setStatus] = useState("")

  useEffect(() => {
    fetchTransfers()

    if (socket) {
      socket.on("transfer-created", () => fetchTransfers())
      socket.on("transfer-updated", () => fetchTransfers())
    }

    return () => {
      if (socket) {
        socket.off("transfer-created")
        socket.off("transfer-updated")
      }
    }
  }, [socket, status])

  const fetchTransfers = async () => {
    try {
      const response = await axios.get(`${API_URL}/operations/transfers`, {
        params: { warehouse: user.warehouse, status: status || undefined },
        withCredentials: true,
      })
      setTransfers(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching transfers:", error)
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="app-container">
      <Sidebar user={user} />
      <div className="main-content p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Internal Transfers</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? "Cancel" : "Create Transfer"}
          </button>
        </div>

        {showForm && (
          <TransferForm
            user={user}
            onTransferCreated={() => {
              setShowForm(false)
              fetchTransfers()
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

        <TransferTable transfers={transfers} onTransferReceived={fetchTransfers} user={user} />
      </div>
    </div>
  )
}

export default TransfersPage
