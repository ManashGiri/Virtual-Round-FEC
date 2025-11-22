function HistoryTable({ history }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Type</th>
          <th>Product</th>
          <th>Quantity Change</th>
          <th>New Quantity</th>
          <th>User</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        {history.length === 0 ? (
          <tr>
            <td colSpan="7" className="text-center py-4">
              No history found
            </td>
          </tr>
        ) : (
          history.map((entry) => (
            <tr key={entry._id}>
              <td>{new Date(entry.createdAt).toLocaleDateString()}</td>
              <td>
                <span className="badge badge-info">{entry.transactionType}</span>
              </td>
              <td>{entry.product?.name}</td>
              <td>
                <span className={entry.quantityChange > 0 ? "text-green-600" : "text-red-600"}>
                  {entry.quantityChange > 0 ? "+" : ""}
                  {entry.quantityChange}
                </span>
              </td>
              <td>{entry.newQuantity}</td>
              <td>{entry.user?.name}</td>
              <td>{entry.notes}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}

export default HistoryTable
