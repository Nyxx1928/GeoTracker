import { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card, Alert, Icons } from '../ui';

export default function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/api/login', { email, password });
      localStorage.setItem('auth_token', res.data.token);
      setIsLoggedIn(true);
      navigate('/home');
    } catch {
      setError('Invalid credentials, please try again.');
    } finally {
      setLoading(false);
    }
  };

  const LoginIcon = Icons.LogIn;
  const LoadingIcon = Icons.Clock;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 p-4">
      <div className="w-full max-w-md">
        <form onSubmit={handleLogin}>
          <Card className="bg-gray-900/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-800/50">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-2xl mb-4 shadow-lg shadow-cyan-500/30">
                <svg className="text-white w-6 h-6" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" stroke="white" strokeWidth="0" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-1">Welcome Back</h2>
              <p className="text-gray-400 text-sm">Sign in to access GeoTracker</p>
            </div>

            {error && (
              <div className="mb-4">
                <Alert type="error">{error}</Alert>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mt-6">
              <Button type="submit" disabled={loading} className="w-full" variant="default">
                {loading ? (
                  <>
                    <LoadingIcon className="mr-2 w-4 h-4 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <LoginIcon className="mr-2 w-4 h-4" />
                    <span>Sign In</span>
                  </>
                )}
              </Button>
            </div>

            <div className="mt-6 text-center text-xs text-gray-500">
              <p>Demo credentials:</p>
              <p className="mt-1 text-cyan-400 font-mono">test@example.com / password123</p>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
}