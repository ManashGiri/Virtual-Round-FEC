"use client"
import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

function ReceiptTable({ receipts, onReceiptAccepted, user }) {
  const handleAccept = async (receiptId) => {
    try {
      await axios.put(`${API_URL}/operations/receipts/${receiptId}/accept`, {}, { withCredentials: true })
      onReceiptAccepted()
    } catch (error) {
      alert("Error accepting receipt")
    }
  }

  return (
    <div className="card">
      <table className="table">
        <thead>
          <tr>
            <th>Receipt No</th>
            <th>Supplier</th>
            <th>Items Count</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {receipts.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4">
                No receipts found
              </td>
            </tr>
          ) : (
            receipts.map((receipt) => (
              <tr key={receipt._id}>
                <td>
                  <strong>{receipt.receiptNo}</strong>
                </td>
                <td>{receipt.supplier}</td>
                <td>{receipt.items.length}</td>
                <td>
                  <span className={`badge badge-${receipt.status === "Done" ? "success" : "info"}`}>
                    {receipt.status}
                  </span>
                </td>
                <td>{new Date(receipt.createdAt).toLocaleDateString()}</td>
                <td>
                  {receipt.status !== "Done" && (
                    <button onClick={() => handleAccept(receipt._id)} className="btn btn-success text-sm">
                      Accept
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

export default ReceiptTable
