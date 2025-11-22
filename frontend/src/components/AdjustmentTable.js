function AdjustmentTable({ adjustments }) {
  return (
    <div className="card">
      <table className="table">
        <thead>
          <tr>
            <th>Adjustment No</th>
            <th>Product</th>
            <th>Recorded Qty</th>
            <th>Counted Qty</th>
            <th>Adjustment</th>
            <th>Reason</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {adjustments.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-4">
                No adjustments found
              </td>
            </tr>
          ) : (
            adjustments.map((adj) => (
              <tr key={adj._id}>
                <td>
                  <strong>{adj.adjustmentNo}</strong>
                </td>
                <td>{adj.product?.name}</td>
                <td>{adj.recordedQuantity}</td>
                <td>{adj.countedQuantity}</td>
                <td>
                  <span className={`badge ${adj.adjustmentQuantity > 0 ? "badge-success" : "badge-danger"}`}>
                    {adj.adjustmentQuantity > 0 ? "+" : ""}
                    {adj.adjustmentQuantity}
                  </span>
                </td>
                <td>{adj.reason}</td>
                <td>{new Date(adj.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default AdjustmentTable
