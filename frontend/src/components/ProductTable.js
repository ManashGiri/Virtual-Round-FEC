function ProductTable({ products }) {
  return (
    <div className="card">
      <table className="table">
        <thead>
          <tr>
            <th>SKU</th>
            <th>Name</th>
            <th>Category</th>
            <th>Unit</th>
            <th>Reorder Level</th>
            <th>Total Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4">
                No products found
              </td>
            </tr>
          ) : (
            products.map((product) => {
              const totalStock = product.locationStocks.reduce((sum, loc) => sum + loc.quantity, 0)
              return (
                <tr key={product._id}>
                  <td>
                    <strong>{product.sku}</strong>
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.unitOfMeasure}</td>
                  <td>{product.reorderLevel}</td>
                  <td>
                    <span className={`badge ${totalStock <= product.reorderLevel ? "badge-warning" : "badge-success"}`}>
                      {totalStock}
                    </span>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ProductTable
