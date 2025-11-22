"use client"
import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

function TransferTable({ transfers, onTransferReceived, user }) {
  const handleReceive = async (transferId) => {
    try {
      await axios.put(`${API_URL}/operations/transfers/${transferId}/receive`, {}, { withCredentials: true })
      onTransferReceived()
    } catch (error) {
      alert("Error receiving transfer")
    }
  }

  return (
    <div className="card">
      <table className="table">
        <thead>
          <tr>
            <th>Transfer No</th>
            <th>From</th>
            <th>To</th>
            <th>Items Count</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transfers.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-4">
                No transfers found
              </td>
            </tr>
          ) : (
            transfers.map((transfer) => (
              <tr key={transfer._id}>
                <td>
                  <strong>{transfer.transferNo}</strong>
                </td>
                <td>{transfer.fromWarehouse?.name}</td>
                <td>{transfer.toWarehouse?.name}</td>
                <td>{transfer.items.length}</td>
                <td>
                  <span className={`badge badge-${transfer.status === "Done" ? "success" : "info"}`}>
                    {transfer.status}
                  </span>
                </td>
                <td>{new Date(transfer.createdAt).toLocaleDateString()}</td>
                <td>
                  {transfer.status !== "Done" && (
                    <button onClick={() => handleReceive(transfer._id)} className="btn btn-success text-sm">
                      Receive
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

export default TransferTable
