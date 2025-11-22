"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

function TransferForm({ user, onTransferCreated }) {
  const [formData, setFormData] = useState({
    fromWarehouse: "",
    toWarehouse: "",
    items: [{ product: "", quantityTransferred: 0 }],
    notes: "",
  })
  const [products, setProducts] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [error, setError] = useState("")

  useEffect(() => {
    fetchProducts()
    fetchWarehouses()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`, { withCredentials: true })
      setProducts(response.data)
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  const fetchWarehouses = async () => {
    try {
      const response = await axios.get(`${API_URL}/warehouses`, { withCredentials: true })
      setWarehouses(response.data)
    } catch (error) {
      console.error("Error fetching warehouses:", error)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items]
    newItems[index][field] = value
    setFormData({ ...formData, items: newItems })
  }

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product: "", quantityTransferred: 0 }],
    })
  }

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index)
    setFormData({ ...formData, items: newItems })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${API_URL}/operations/transfers`, formData, { withCredentials: true })
      onTransferCreated()
      setError("")
    } catch (err) {
      setError(err.response?.data?.error || "Error creating transfer")
    }
  }

  return (
    <div className="card mb-8">
      <h2 className="text-xl font-bold mb-4">Create Internal Transfer</h2>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label>From Warehouse *</label>
            <select name="fromWarehouse" value={formData.fromWarehouse} onChange={handleChange} required>
              <option value="">Select Warehouse</option>
              {warehouses.map((w) => (
                <option key={w._id} value={w._id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>To Warehouse *</label>
            <select name="toWarehouse" value={formData.toWarehouse} onChange={handleChange} required>
              <option value="">Select Warehouse</option>
              {warehouses.map((w) => (
                <option key={w._id} value={w._id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea name="notes" value={formData.notes} onChange={handleChange} rows="3" />
        </div>

        <h3 className="font-bold mb-4">Items</h3>
        {formData.items.map((item, index) => (
          <div key={index} className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label>Product</label>
              <select
                value={item.product}
                onChange={(e) => handleItemChange(index, "product", e.target.value)}
                required
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Quantity</label>
              <input
                type="number"
                value={item.quantityTransferred}
                onChange={(e) => handleItemChange(index, "quantityTransferred", Number.parseInt(e.target.value))}
                required
              />
            </div>
            <div className="flex items-end">
              <button type="button" onClick={() => removeItem(index)} className="btn btn-danger w-full">
                Remove
              </button>
            </div>
          </div>
        ))}

        <button type="button" onClick={addItem} className="btn btn-primary mb-4">
          Add Item
        </button>

        <button type="submit" className="btn btn-success">
          Create Transfer
        </button>
      </form>
    </div>
  )
}

export default TransferForm
