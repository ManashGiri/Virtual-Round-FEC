"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import Sidebar from "../components/Sidebar"
import KPICard from "../components/KPICard"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

function DashboardPage({ user, socket }) {
  const [kpis, setKpis] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchKPIs()

    if (socket) {
      socket.on("receipt-updated", () => fetchKPIs())
      socket.on("delivery-updated", () => fetchKPIs())
      socket.on("transfer-updated", () => fetchKPIs())
      socket.on("adjustment-created", () => fetchKPIs())
    }

    return () => {
      if (socket) {
        socket.off("receipt-updated")
        socket.off("delivery-updated")
        socket.off("transfer-updated")
        socket.off("adjustment-created")
      }
    }
  }, [socket])

  const fetchKPIs = async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/kpis`, {
        params: { warehouse: user.warehouse },
        withCredentials: true,
      })
      setKpis(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching KPIs:", error)
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="app-container">
      <Sidebar user={user} />
      <div className="main-content p-8">
        <h1 className="text-3xl font-bold mb-8">Inventory Dashboard</h1>

        {kpis && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <KPICard title="Total Products" value={kpis.totalProducts} icon="📦" />
            <KPICard title="Low Stock" value={kpis.lowStockItems} icon="⚠️" color="warning" />
            <KPICard title="Out of Stock" value={kpis.outOfStockItems} icon="❌" color="danger" />
            <KPICard title="Pending Receipts" value={kpis.pendingReceipts} icon="📥" />
            <KPICard title="Pending Deliveries" value={kpis.pendingDeliveries} icon="📤" />
          </div>
        )}

        <div className="card">
          <h2 className="text-xl font-bold mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button onClick={() => navigate("/products")} className="btn btn-primary">
              Manage Products
            </button>
            <button onClick={() => navigate("/receipts")} className="btn btn-primary">
              Receipts
            </button>
            <button onClick={() => navigate("/deliveries")} className="btn btn-primary">
              Deliveries
            </button>
            <button onClick={() => navigate("/history")} className="btn btn-primary">
              View History
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
