function KPICard({ title, value, icon, color = "primary" }) {
  const colorClasses = {
    primary: "bg-blue-50 text-blue-600 border-blue-200",
    warning: "bg-yellow-50 text-yellow-600 border-yellow-200",
    danger: "bg-red-50 text-red-600 border-red-200",
    success: "bg-green-50 text-green-600 border-green-200",
  }

  return (
    <div className={`card border-l-4 ${colorClasses[color]}`}>
      <div className="text-4xl mb-2">{icon}</div>
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  )
}

export default KPICard
