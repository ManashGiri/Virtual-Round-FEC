"use client"
import { useNavigate, useLocation } from "react-router-dom"

function Sidebar({ user }) {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => (location.pathname === path ? "active" : "")

  return (
    <div className="sidebar">
      <h2 className="text-2xl font-bold mb-8">StockMaster</h2>

      <nav>
        <a href="#" onClick={() => navigate("/dashboard")} className={`nav-link ${isActive("/dashboard")}`}>
          📊 Dashboard
        </a>
        <a href="#" onClick={() => navigate("/products")} className={`nav-link ${isActive("/products")}`}>
          📦 Products
        </a>
        <a href="#" onClick={() => navigate("/receipts")} className={`nav-link ${isActive("/receipts")}`}>
          📥 Receipts
        </a>
        <a href="#" onClick={() => navigate("/deliveries")} className={`nav-link ${isActive("/deliveries")}`}>
          📤 Deliveries
        </a>
        <a href="#" onClick={() => navigate("/transfers")} className={`nav-link ${isActive("/transfers")}`}>
          🔄 Transfers
        </a>
        <a href="#" onClick={() => navigate("/adjustments")} className={`nav-link ${isActive("/adjustments")}`}>
          🔧 Adjustments
        </a>
        <a href="#" onClick={() => navigate("/history")} className={`nav-link ${isActive("/history")}`}>
          📋 History
        </a>
        <hr className="my-4" />
        <a href="#" onClick={() => navigate("/profile")} className={`nav-link ${isActive("/profile")}`}>
          👤 My Profile
        </a>
      </nav>
    </div>
  )
}

export default Sidebar
