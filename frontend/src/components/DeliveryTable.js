"use client"
import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

function DeliveryTable({ deliveries, onDeliveryShipped, user }) {
  const handleShip = async (deliveryId) => {
    try {
      await axios.put(`${API_URL}/operations/deliveries/${deliveryId}/ship`, {}, { withCredentials: true })
      onDeliveryShipped()
    } catch (error) {
      alert("Error shipping delivery")
    }
  }

  return (
    <div className="card">
      <table className="table">
        <thead>
          <tr>
            <th>Order No</th>
            <th>Customer</th>
            <th>Items Count</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4">
                No deliveries found
              </td>
            </tr>
          ) : (
            deliveries.map((delivery) => (
              <tr key={delivery._id}>
                <td>
                  <strong>{delivery.orderNo}</strong>
                </td>
                <td>{delivery.customer}</td>
                <td>{delivery.items.length}</td>
                <td>
                  <span className={`badge badge-${delivery.status === "Done" ? "success" : "info"}`}>
                    {delivery.status}
                  </span>
                </td>
                <td>{new Date(delivery.createdAt).toLocaleDateString()}</td>
                <td>
                  {delivery.status !== "Done" && (
                    <button onClick={() => handleShip(delivery._id)} className="btn btn-success text-sm">
                      Ship
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default DeliveryTable
