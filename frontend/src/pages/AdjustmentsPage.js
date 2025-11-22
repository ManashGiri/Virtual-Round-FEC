"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Sidebar from "../components/Sidebar"
import AdjustmentForm from "../components/AdjustmentForm"
import AdjustmentTable from "../components/AdjustmentTable"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

function AdjustmentsPage({ user, socket }) {
  const [adjustments, setAdjustments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchAdjustments()

    if (socket) {
      socket.on("adjustment-created", () => fetchAdjustments())
    }

    return () => {
      if (socket) {
        socket.off("adjustment-created")
      }
    }
  }, [socket])

  const fetchAdjustments = async () => {
    try {
      const response = await axios.get(`${API_URL}/operations/adjustments`, {
        params: { warehouse: user.warehouse },
        withCredentials: true,
      })
      setAdjustments(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching adjustments:", error)
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="app-container">
      <Sidebar user={user} />
      <div className="main-content p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Stock Adjustments</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? "Cancel" : "Create Adjustment"}
          </button>
        </div>

        {showForm && (
          <AdjustmentForm
            user={user}
            onAdjustmentCreated={() => {
              setShowForm(false)
              fetchAdjustments()
            }}
          />
        )}

        <AdjustmentTable adjustments={adjustments} />
      </div>
    </div>
  )
}

export default AdjustmentsPage
