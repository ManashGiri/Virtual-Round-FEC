
# 📦 StockMaster – Inventory Management System

**StockMaster** is a production-grade Inventory Management System (IMS) built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js).  
It digitizes and streamlines warehouse operations by replacing manual registers and Excel-based tracking with a centralized real-time platform.

---

## 🚀 Key Features

### 🛡️ Authentication & Security
- Secure Login/Signup using **Passport.js**
- **Express-Session + MongoStore** session persistence
- OTP-based password reset via email
- Role-based access control (Admin / Manager / Staff)

### 📊 Real-Time Dashboard KPIs
- Total Stock & Product Count
- Low Stock & Out-of-Stock Alerts
- Pending Receipts / Deliveries / Internal Transfers
- Dynamic filtering & search across locations and categories

### 📦 Inventory Management
- Product creation & modification
- Multi-warehouse / multi-location stock tracking
- Reorder level rules & alerts

### 🔄 Stock Operations
| Operation | Description |
|----------|-------------|
| Receipts | Add incoming goods and increase stock |
| Delivery Orders | Remove stock for customer shipments |
| Internal Transfers | Move stock between locations |
| Stock Adjustments | Correct mismatches vs physical count |

### 📝 Move History
- Complete audit trail of all movements
- Timestamp, user details, before/after quantity

### ⚡ Real-Time Functionality
- **Socket.IO** live updates & notifications

---

## 🛠️ Tech Stack

### Backend
- Node.js + Express.js (JavaScript only)
- MongoDB + Mongoose
- Passport.js Authentication (Express-Session + MongoStore)
- Socket.IO (real-time updates)
- Nodemailer (OTP emails)

### Frontend
- React.js (JavaScript, not Next.js)
- React Router v6
- Axios for API communication
- TailwindCSS for modern UI styling

---

## 📂 Project Structure

```

StockMaster/
│
├── backend/               # Express API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── middleware/
│   ├── utils/
│   └── server.js
│
└── frontend/              # React Application
├── src/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── hooks/
│   └── App.js
└── public/

````

---

## ⚙️ Installation & Setup

### Clone the Repository
```bash
git clone https://github.com/yourusername/stockmaster.git
cd stockmaster
````

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```
MONGODB_URI=mongodb://localhost:27017/stockmaster
SESSION_SECRET=your-secret-key
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

Start backend server:

```bash
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint                    | Description       |
| ------ | --------------------------- | ----------------- |
| POST   | `/api/auth/signup`          | Register new user |
| POST   | `/api/auth/login`           | Login             |
| GET    | `/api/auth/logout`          | Logout            |
| POST   | `/api/auth/forgot-password` | Request OTP       |
| POST   | `/api/auth/reset-password`  | Reset password    |

### Inventory & Operations

| Method | Endpoint                      | Description     |
| ------ | ----------------------------- | --------------- |
| GET    | `/api/products`               | All products    |
| POST   | `/api/products`               | Create          |
| PUT    | `/api/products/:id`           | Update          |
| DELETE | `/api/products/:id`           | Delete          |
| POST   | `/api/operations/receipts`    | Add receipt     |
| POST   | `/api/operations/deliveries`  | Create delivery |
| POST   | `/api/operations/transfers`   | Create transfer |
| POST   | `/api/operations/adjustments` | Adjust stock    |
| GET    | `/api/operations/history`     | History log     |

### Dashboard Metrics

```
GET /api/dashboard/kpis
```

---

## ▶️ Usage

1. Create an account or login
2. Access real-time dashboard
3. Add or manage products & warehouses
4. Perform receipts, deliveries, transfers, adjustments
5. Track everything through movement history

---

## 💡 Future Enhancements (Optional)

* Mobile app with React Native
* Barcode / QR Code scanning
* Supplier / Customer modules
* AI-based forecasting & auto-order suggestions

---

## 🙌 Contributers

*Om Joshi

*Manash Giri

*Namisha Warang

*Nikunj Pandey

```

