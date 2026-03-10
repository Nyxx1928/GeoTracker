import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import { useEffect, useState } from 'react';
import api from './api';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // const logoutTimerRef = useRef(null);

  // const parseJwt = (token) => {
  //   try {
  //     const base64 = token.split('.')[1];
  //     const json = JSON.parse(atob(base64.replace(/-/g, '+').replace(/_/g, '/')));
  //     return json;
  //   } catch (e) {
  //     return null;
  //   }
  // };

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (!token) return;

  //   const payload = parseJwt(token);
  //   if (payload && payload.exp && payload.exp * 1000 > Date.now()) {
  //     setIsLoggedIn(true);

  //     // schedule auto-logout when token expires
  //     const ms = payload.exp * 1000 - Date.now();
  //     if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
  //     logoutTimerRef.current = setTimeout(() => {
  //       localStorage.removeItem('token');
  //       setIsLoggedIn(false);
  //       window.location.pathname = '/login';
  //     }, ms);
  //   } else {
  //     localStorage.removeItem('token');
  //     setIsLoggedIn(false);
  //   }
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
  // })

  //   return () => {
  //     if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
  //   };
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