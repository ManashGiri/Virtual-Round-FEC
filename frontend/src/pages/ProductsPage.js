"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Sidebar from "../components/Sidebar"
import ProductForm from "../components/ProductForm"
import ProductTable from "../components/ProductTable"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

function ProductsPage({ user }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [category, setCategory] = useState("")

  useEffect(() => {
    fetchProducts()
  }, [category])

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`, {
        params: { category: category || undefined },
        withCredentials: true,
      })
      setProducts(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching products:", error)
      setLoading(false)
    }
  }

  const handleProductAdded = () => {
    fetchProducts()
    setShowForm(false)
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="app-container">
      <Sidebar user={user} />
      <div className="main-content p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Products Management</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? "Cancel" : "Add Product"}
          </button>
        </div>

        {showForm && <ProductForm onProductAdded={handleProductAdded} />}

        <div className="form-group mb-6">
          <label>Filter by Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Hardware">Hardware</option>
            <option value="Tools">Tools</option>
          </select>
        </div>

        <ProductTable products={products} />
      </div>
    </div>
  )
}

export default ProductsPage
