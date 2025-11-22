const express = require("express")
const mongoose = require("mongoose")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const passport = require("passport")
const cors = require("cors")
const http = require("http")
const socketIO = require("socket.io")
require("dotenv").config()

const app = express()
const server = http.createServer(app)
const io = socketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  },
})

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/stockmaster", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI || "mongodb://localhost:27017/stockmaster",
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
)

// Passport Configuration
app.use(passport.initialize())
app.use(passport.session())
require("./config/passport")(passport)

// Routes
app.use("/api/auth", require("./routes/auth.routes"))
app.use("/api/products", require("./routes/products.routes"))
app.use("/api/operations", require("./routes/operations.routes"))
app.use("/api/dashboard", require("./routes/dashboard.routes"))
app.use("/api/warehouses", require("./routes/warehouses.routes"))

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message)
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  })
})

// Socket.IO Connection
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id)

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id)
  })
})

// Make io accessible to routes
app.set("io", io)

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`StockMaster Backend running on port ${PORT}`)
})
