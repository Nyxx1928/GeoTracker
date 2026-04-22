import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ResultCard from '../components/ResultCard';

/**
 * Landing - Public landing page for unauthenticated users.
 * 
 * Features:
 * - Shows visitor's IP and location automatically
 * - Allows public lookups without authentication
 * - "What's my IP?" button to auto-fill search
 * - Prompts users to log in or register to save history
 * - Uses public API endpoints (no auth required)
 */
const Landing = () => {
  const navigate = useNavigate();
  const [visitorGeo, setVisitorGeo] = useState(null);
  const [searchTarget, setSearchTarget] = useState('');
  const [currentResult, setCurrentResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch visitor's IP and geo data on mount
  useEffect(() => {
    fetchVisitorGeo();
  }, []);

  const fetchVisitorGeo = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const res = await axios.get(`${apiUrl}/api/geo/public`);
      setVisitorGeo(res.data);
    } catch (err) {
      console.error('Failed to fetch visitor geo:', err);
    }
  };

  const handleSearch = async () => {
    const target = searchTarget.trim();
    if (!target) {
      setError('Please enter an IP address, domain, URL, or email');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const res = await axios.post(`${apiUrl}/api/analyze/public`, { target });
      
      if (res.data) {
        setCurrentResult(res.data);
        setError('');
      } else {
        setError('Analysis data not available for this target');
      }
    } catch (err) {
      if (err.response?.status === 422) {
        setError(err.response.data?.message || 'Invalid target format');
      } else if (err.response?.status === 404) {
        setError('Unable to resolve target. Please check the address and try again.');
      } else if (err.response?.status === 429) {
        setError('Rate limit exceeded. Please try again in a minute.');
      } else {
        setError('Failed to analyze target. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsMyIP = () => {
    if (visitorGeo?.query) {
      setSearchTarget(visitorGeo.query);
      setError('');
    }
  };

  const clearSearch = () => {
    setSearchTarget('');
    setCurrentResult(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-gray-100 p-4 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
            LinkGuard
          </h1>
          <p className="text-gray-400 mt-1">Analyze links, domains, and IPs for security risks</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2.5 bg-gray-800 text-gray-300 rounded-lg font-medium hover:bg-gray-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-cyan-500/20"
          >
            Log In
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-lg font-medium hover:from-cyan-700 hover:to-cyan-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-cyan-500/20"
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Visitor IP Display */}
      {visitorGeo && (
        <div className="bg-gray-900/80 backdrop-blur-md p-6 rounded-2xl border border-gray-800/50 shadow-2xl mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">📍</span>
            <div>
              <h3 className="text-lg font-semibold text-white">Your Location</h3>
              <p className="text-sm text-gray-400">Detected from your IP address</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div>
              <span className="text-gray-400 text-sm">IP Address</span>
              <p className="font-mono font-semibold text-white">{visitorGeo.query}</p>
            </div>
            {visitorGeo.city && (
              <div>
                <span className="text-gray-400 text-sm">Location</span>
                <p className="font-semibold text-white">
                  {visitorGeo.city}, {visitorGeo.country}
                </p>
              </div>
            )}
            {visitorGeo.isp && (
              <div>
                <span className="text-gray-400 text-sm">ISP</span>
                <p className="font-semibold text-white">{visitorGeo.isp}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Current Result Display */}
      {currentResult && (
        <div className="mb-8">
          <ResultCard result={currentResult} showShareLink={false} />
        </div>
      )}

      {/* Search Controls */}
      <div className="bg-gray-900/80 backdrop-blur-md p-6 rounded-2xl border border-gray-800/50 shadow-2xl mb-8">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Enter IP, domain, URL, or email (e.g. 8.8.8.8, example.com, https://example.com, user@example.com)"
                value={searchTarget}
                onChange={(e) => {
                  setSearchTarget(e.target.value);
                  if (error) setError('');
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !loading) handleSearch();
                }}
                disabled={loading}
                className="w-full px-4 py-3.5 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium placeholder-gray-500"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-8 py-3.5 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white font-semibold rounded-xl hover:from-cyan-500 hover:to-cyan-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 min-w-[120px]"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <span>🔍</span>
                  <span>Analyze</span>
                </>
              )}
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleWhatsMyIP}
              disabled={loading || !visitorGeo}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg font-medium hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span>📍</span>
              <span>What's my IP?</span>
            </button>
            <button
              onClick={clearSearch}
              disabled={loading}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg font-medium hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span>🗑️</span>
              <span>Clear</span>
            </button>
          </div>

          {error && (
            <div className="mt-2 p-3 bg-red-900/50 border border-red-700/50 rounded-lg">
              <p className="text-red-400 text-sm flex items-center">
                <span className="mr-2">⚠️</span>
                {error}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 backdrop-blur-md p-8 rounded-2xl border border-cyan-700/50 shadow-2xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Want to save your lookups?
          </h2>
          <p className="text-gray-300 mb-6">
            Create a free account to save your lookup history, add custom labels, and share results with your team.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white font-semibold rounded-xl hover:from-cyan-500 hover:to-cyan-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-cyan-500/50"
            >
              Create Free Account
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3 bg-gray-800 text-gray-300 font-semibold rounded-xl hover:bg-gray-700 transform hover:scale-105 transition-all duration-200"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
