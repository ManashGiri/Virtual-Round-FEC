# StockMaster - Inventory Management System

A production-grade Inventory Management System built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- **User Authentication**: Secure login/signup with Passport.js and OTP-based password reset
- **Dashboard**: Real-time KPIs and inventory overview
- **Product Management**: CRUD operations with multi-location stock tracking
- **Stock Operations**:
  - Receipts (incoming goods)
  - Delivery Orders (outgoing goods)
  - Internal Transfers between warehouses
  - Stock Adjustments for discrepancies
- **Move History**: Complete audit trail of all stock movements
- **Real-time Updates**: Socket.IO for live notifications
- **Role-Based Access**: Admin, Manager, and Staff roles

## Tech Stack

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- Passport.js for authentication
- Socket.IO for real-time updates
- Nodemailer for OTP emails

**Frontend:**
- React.js
- React Router for navigation
- Axios for API calls
- TailwindCSS for styling

## Installation

### Backend

\`\`\`bash
cd backend
npm install
\`\`\`

Create `.env` file:
\`\`\`
MONGODB_URI=mongodb://localhost:27017/stockmaster
SESSION_SECRET=your-secret-key
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
\`\`\`

Start backend:
\`\`\`bash
npm start
\`\`\`

### Frontend

\`\`\`bash
cd frontend
npm install
npm start
\`\`\`

## Usage

1. Sign up or login with credentials
2. Access the dashboard to view KPIs
3. Manage products and warehouse stock
4. Create receipts, deliveries, transfers, and adjustments
5. View complete audit trail and history

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request OTP
- `POST /api/auth/reset-password` - Reset password

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Operations
- `POST /api/operations/receipts` - Create receipt
- `GET /api/operations/receipts` - Get receipts
- `PUT /api/operations/receipts/:id/accept` - Accept receipt
- `POST /api/operations/deliveries` - Create delivery
- `GET /api/operations/deliveries` - Get deliveries
- `PUT /api/operations/deliveries/:id/ship` - Ship delivery
- `POST /api/operations/transfers` - Create transfer
- `GET /api/operations/transfers` - Get transfers
- `PUT /api/operations/transfers/:id/receive` - Receive transfer
- `POST /api/operations/adjustments` - Create adjustment
- `GET /api/operations/adjustments` - Get adjustments
- `GET /api/operations/history` - Get move history

### Dashboard
- `GET /api/dashboard/kpis` - Get KPI metrics

## License

MIT
