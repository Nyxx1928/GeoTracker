import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Landing from './pages/Landing';
import PublicLookup from './pages/PublicLookup';
import { useEffect, useState } from 'react';
import api from './api';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) { setIsLoggedIn(false); return; }
      try {
        const res = await api.get('/api/me');
        if (res.data?.authenticated) setIsLoggedIn(true);
        else { localStorage.removeItem('auth_token'); setIsLoggedIn(false); }
      } catch {
        localStorage.removeItem('auth_token');
        setIsLoggedIn(false);
      }
    };
    checkSession();
  }, []);


  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/lookup/:uuid" element={<PublicLookup />} />
          
          {/* Auth routes */}
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/home" /> : <Login setIsLoggedIn={setIsLoggedIn} />}
          />
          
          {/* Protected routes */}
          <Route
            path="/home"
            element={isLoggedIn ? <Home setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/login" />}
          />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;