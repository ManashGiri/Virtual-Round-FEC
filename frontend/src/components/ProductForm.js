"use client"

import { useState } from "react"
import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

function ProductForm({ onProductAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    unitOfMeasure: "pcs",
    reorderLevel: 10,
    reorderQuantity: 50,
  })
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${API_URL}/products`, formData, { withCredentials: true })
      onProductAdded()
      setFormData({ name: "", sku: "", category: "", unitOfMeasure: "pcs", reorderLevel: 10, reorderQuantity: 50 })
    } catch (err) {
      setError(err.response?.data?.error || "Error creating product")
    }
  }

  return (
    <div className="card mb-8">
      <h2 className="text-xl font-bold mb-4">Add New Product</h2>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label>Product Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>SKU *</label>
            <input type="text" name="sku" value={formData.sku} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Category</label>
            <input type="text" name="category" value={formData.category} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Unit of Measure</label>
            <select name="unitOfMeasure" value={formData.unitOfMeasure} onChange={handleChange}>
              <option value="pcs">Pieces</option>
              <option value="kg">Kilograms</option>
              <option value="l">Liters</option>
              <option value="box">Box</option>
            </select>
          </div>

          <div className="form-group">
            <label>Reorder Level</label>
            <input type="number" name="reorderLevel" value={formData.reorderLevel} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Reorder Quantity</label>
            <input type="number" name="reorderQuantity" value={formData.reorderQuantity} onChange={handleChange} />
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          Create Product
        </button>
      </form>
    </div>
  )
}

export default ProductForm
