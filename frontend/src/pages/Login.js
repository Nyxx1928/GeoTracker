import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setError('');
  //   setLoading(true);

  //   try {
  //     const res = await axios.post('http://localhost:8000/api/login', { email, password });
  //     localStorage.setItem('token', res.data.token);
  //     setIsLoggedIn(true);
  //     navigate('/home');
  //   } catch (err) {
  //     setError('Invalid credentials. Please try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      //await api.get('/api/csrf-token');
      await api.get('/sanctum/csrf-cookie'); // prime the CSRF cookie (Sanctum built-in)
      await api.post('/api/login', { email, password }); // sets session cookie
      setIsLoggedIn(true);
      navigate('/home');
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950">
      <div className="w-full max-w-md px-6">
        <form
          onSubmit={handleLogin}
          className="bg-gray-900/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-800/50"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-2xl mb-4 shadow-lg shadow-cyan-500/30">
              <span className="text-3xl">🌐</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-400 text-sm">Sign in to access GeoTracker</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-700/50 rounded-lg">
              <p className="text-red-400 text-sm flex items-center justify-center">
                <span className="mr-2">⚠️</span>
                {error}
              </p>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all outline-none text-white placeholder-gray-500"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all outline-none text-white placeholder-gray-500"
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 bg-gradient-to-r from-cyan-600 to-cyan-700 text-black font-bold py-3.5 rounded-lg hover:from-cyan-500 hover:to-cyan-600 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-cyan-500/50 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
              </>
            )}
          </button>

          <div className="mt-8 text-center text-xs text-gray-500">
            <p>Demo credentials:</p>
            <p className="mt-1 text-cyan-400 font-mono">test@example.com / password123</p>
          </div>
        </form>
      </div>
    </div>
  );
}