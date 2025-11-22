"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

function AdjustmentForm({ user, onAdjustmentCreated }) {
  const [formData, setFormData] = useState({
    product: "",
    warehouse: user.warehouse,
    countedQuantity: 0,
    reason: "Counting Error",
    notes: "",
  })
  const [products, setProducts] = useState([])
  const [error, setError] = useState("")

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`, { withCredentials: true })
      setProducts(response.data)
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${API_URL}/operations/adjustments`, formData, { withCredentials: true })
      onAdjustmentCreated()
      setError("")
      setFormData({ product: "", warehouse: user.warehouse, countedQuantity: 0, reason: "Counting Error", notes: "" })
    } catch (err) {
      setError(err.response?.data?.error || "Error creating adjustment")
    }
  }

  return (
    <div className="card mb-8">
      <h2 className="text-xl font-bold mb-4">Create Stock Adjustment</h2>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product *</label>
          <select name="product" value={formData.product} onChange={handleChange} required>
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Counted Quantity *</label>
          <input
            type="number"
            name="countedQuantity"
            value={formData.countedQuantity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Reason *</label>
          <select name="reason" value={formData.reason} onChange={handleChange}>
            <option value="Counting Error">Counting Error</option>
            <option value="Damage">Damage</option>
            <option value="Theft">Theft</option>
            <option value="Expiry">Expiry</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea name="notes" value={formData.notes} onChange={handleChange} rows="3" />
        </div>

        <button type="submit" className="btn btn-success">
          Create Adjustment
        </button>
      </form>
    </div>
  )
}

export default AdjustmentForm
