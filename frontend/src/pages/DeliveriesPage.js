"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Sidebar from "../components/Sidebar"
import DeliveryForm from "../components/DeliveryForm"
import DeliveryTable from "../components/DeliveryTable"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

function DeliveriesPage({ user, socket }) {
  const [deliveries, setDeliveries] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [status, setStatus] = useState("")

  useEffect(() => {
    fetchDeliveries()

    if (socket) {
      socket.on("delivery-created", () => fetchDeliveries())
      socket.on("delivery-updated", () => fetchDeliveries())
    }

    return () => {
      if (socket) {
        socket.off("delivery-created")
        socket.off("delivery-updated")
      }
    }
  }, [socket, status])

  const fetchDeliveries = async () => {
    try {
      const response = await axios.get(`${API_URL}/operations/deliveries`, {
        params: { warehouse: user.warehouse, status: status || undefined },
        withCredentials: true,
      })
      setDeliveries(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching deliveries:", error)
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="app-container">
      <Sidebar user={user} />
      <div className="main-content p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Outgoing Stock (Deliveries)</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? "Cancel" : "Create Delivery"}
          </button>
        </div>

        {showForm && (
          <DeliveryForm
            user={user}
            onDeliveryCreated={() => {
              setShowForm(false)
              fetchDeliveries()
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

        <DeliveryTable deliveries={deliveries} onDeliveryShipped={fetchDeliveries} user={user} />
      </div>
    </div>
  )
}

export default DeliveriesPage
