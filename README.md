# 🌍 GeoTracker

> A modern, full-stack IP geolocation tracking application built with React and Node.js

[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)](https://nodejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

GeoTracker is a comprehensive web application that allows users to track and explore IP addresses worldwide. It features a secure authentication system, real-time geolocation data, interactive maps, and search history management.

---

## ✨ Features

### 🔐 Core Features

- **Secure Authentication** - JWT-based login system with bcrypt password hashing
- **IP Geolocation** - Real-time location data for any IP address (IPv4 & IPv6)
- **Interactive Maps** - Visual representation of IP locations using OpenStreetMap
- **Search History** - Track and manage your IP search history
- **IP Validation** - Comprehensive validation for both IPv4 and IPv6 addresses

### 🎯 Advanced Features

- **History Management** - Bulk delete multiple search entries
- **Quick Reload** - One-click reload of previous searches
- **Responsive Design** - Modern dark theme UI with smooth animations
- **Real-time Updates** - Instant geolocation data retrieval

---

## 🛠️ Tech Stack

### Frontend

- **React 19.2.3** - UI framework
- **React Router DOM 7.11.0** - Client-side routing
- **Axios 1.13.2** - HTTP client
- **Tailwind CSS 3.4.1** - Utility-first CSS framework

### Backend

- **Node.js** - Runtime environment
- **Express 5.2.1** - Web framework
- **JWT (jsonwebtoken 9.0.3)** - Authentication tokens
- **bcryptjs 3.0.3** - Password hashing
- **CORS 2.8.5** - Cross-origin resource sharing

### External APIs

- **IP Geolocation**: [ipinfo.io](https://ipinfo.io)
- **Maps**: OpenStreetMap

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/YOUR_USERNAME/GeoTracker.git
   cd GeoTracker
   ```

2. **Install backend dependencies**

   ```bash
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Start the backend server**

   ```bash
   node backend/server.js
   ```

   Backend runs on `http://localhost:8000`

5. **Start the frontend (in a new terminal)**
   ```bash
   cd frontend
   npm start
   ```
   Frontend runs on `http://localhost:3000`

---

## 🔑 Default Credentials

For testing purposes, use these credentials:

```
Email: test@example.com
Password: password123
```

> ⚠️ **Note**: These are demo credentials. Change them in production!

---

## 📁 Project Structure

```
GeoTracker/
├── backend/
│   ├── server.js              # Express server & API endpoints
│   ├── seeders/
│   │   └── userSeeder.js      # User seed data
│   └── vercel.json            # Backend deployment config
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js       # Login page component
│   │   │   └── Home.js        # Main dashboard with IP tracking
│   │   ├── App.js              # Root component with routing
│   │   └── index.js            # Application entry point
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   └── vercel.json            # Frontend deployment config
├── .gitignore                 # Git ignore rules
├── package.json               # Backend dependencies
├── vercel.json                # Root deployment config
└── README.md                  # This file
```

---

## 🔌 API Endpoints

### POST `/api/login`

Authenticates a user and returns a JWT token.

**Request:**

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 🌐 Deployment

### GitHub Repository

- **Status**: Public repository
- **URL**: [Add your GitHub repository URL here]

### Vercel Deployment

- **Frontend**: [Add your Vercel frontend URL here]
- **Backend**: [Add your Vercel backend URL here]

---

## 📝 Development Notes

- **User Storage**: Currently uses in-memory storage. Replace with a database (MongoDB, PostgreSQL, etc.) for production.
- **Token Expiry**: JWT tokens expire after 1 hour
- **Search History**: Limited to 10 items, stored in component state
- **Map Provider**: Uses OpenStreetMap (free, no API key required)

---

## 🤝 Contributing

This is a project submission. For questions or issues, please contact the repository owner.

---

## 📄 License

This project is licensed under the ISC License.

---

## 👤 Author

Created for JLabs3 assignment submission.

---

## 🙏 Acknowledgments

- [ipinfo.io](https://ipinfo.io) for geolocation API
- [OpenStreetMap](https://www.openstreetmap.org) for map services
- React and Node.js communities

---

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Made with ❤️ using React and Node.js**
