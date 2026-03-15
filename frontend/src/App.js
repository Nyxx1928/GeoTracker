import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import { useEffect, useState } from 'react';
import api from './api';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await api.get('/api/me');
        if (res.data?.authenticated) setIsLoggedIn(true);
        else setIsLoggedIn(false);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkSession();

  }, []);


  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Routes>
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/home" /> : <Login setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route
            path="/home"
            element={isLoggedIn ? <Home setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;