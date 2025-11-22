const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.status(401).json({ error: "Unauthorized" })
}

const isAuthorized = (roles = []) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      return next()
    }
    res.status(403).json({ error: "Forbidden - Insufficient permissions" })
  }
}

module.exports = { isAuthenticated, isAuthorized }
