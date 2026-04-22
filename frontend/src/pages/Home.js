import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import ResultCard from '../components/ResultCard';
import HistoryList from '../components/HistoryList';
import BulkLookup from '../components/BulkLookup';

export default function Home({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [userGeo, setUserGeo] = useState(null);
  const [searchTarget, setSearchTarget] = useState('');
  const [currentResult, setCurrentResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  const [lookupMode, setLookupMode] = useState('single'); // 'single' or 'bulk'

  // Load user's current location on mount
  useEffect(() => {
    fetchUserGeo();
  }, []);

  const fetchUserGeo = async () => {
    try {
      const res = await api.get('/api/geo');
      setUserGeo(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load your location');
    }
  };

  const handleSearch = async (targetToSearch = null) => {
    if (targetToSearch !== null && typeof targetToSearch === 'object' && targetToSearch.target) {
      console.warn('handleSearch was called with React event object - ignoring');
      return;
    }
    const target = String(targetToSearch || searchTarget || '').trim();
    if (!target) { setError('Please enter an IP address, domain, URL, or email'); return; }
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/api/analyze', { target });
      if (res.data) {
        setCurrentResult(res.data);
        setHistory(prev => [...new Set([target, ...prev])].slice(0, 10));
        setError('');
        setSearchTarget(target);
        // Refresh the HistoryList component
        setHistoryRefreshKey(prev => prev + 1);
      } else {
        setError('Analysis data not available for this target');
      }
    } catch (err) {
      if (err.response?.status === 422) {
        setError(err.response.data?.message || 'Invalid target format');
      } else if (err.response?.status === 404) {
        setError('Unable to resolve target. Please check the address and try again.');
      } else {
        setError('Failed to analyze target. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTarget('');
    setCurrentResult(null);
    setError('');
  };

  const handleHistoryClick = (target) => {
    handleSearch(target);
  };

  const handleCheckboxChange = (target) => {
    setSelectedHistory(prev =>
      prev.includes(target) ? prev.filter(item => item !== target) : [...prev, target]
    );
  };

  const handleDeleteSelected = () => {
    setHistory(prev => prev.filter(target => !selectedHistory.includes(target)));
    setSelectedHistory([]);
  };

  const handleSelectAll = () => {
    if (selectedHistory.length === history.length) {
      setSelectedHistory([]);
    } else {
      setSelectedHistory([...history]);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/api/logout');
    } finally {
      localStorage.removeItem('auth_token');
      setIsLoggedIn(false);
      navigate('/login');
    }
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
        <button
          onClick={handleLogout}
          className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-cyan-500/20 flex items-center gap-2"
        >
          <span>Logout</span>
        </button>
      </div>

      {/* Mode Toggle */}
      <div className="bg-gray-900/80 backdrop-blur-md p-2 rounded-2xl border border-gray-800/50 shadow-2xl mb-8 inline-flex">
        <button
          onClick={() => setLookupMode('single')}
          className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-200 ${
            lookupMode === 'single'
              ? 'bg-gradient-to-r from-cyan-600 to-cyan-700 text-white shadow-lg'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <span className="mr-2">🔍</span>
          Single Lookup
        </button>
        <button
          onClick={() => setLookupMode('bulk')}
          className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-200 ${
            lookupMode === 'bulk'
              ? 'bg-gradient-to-r from-cyan-600 to-cyan-700 text-white shadow-lg'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <span className="mr-2">📋</span>
          Bulk Lookup
        </button>
      </div>

      {/* Current Location Display */}
      {currentResult && lookupMode === 'single' && (
        <div className="mb-8">
          <ResultCard result={currentResult} />
        </div>
      )}

      {/* Single Lookup Mode */}
      {lookupMode === 'single' && (
        <>
          {/* Search Controls */}
          <div className="bg-gray-900/80 backdrop-blur-md p-6 rounded-2xl border border-gray-800/50 shadow-2xl mb-8">
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
            onClick={() => handleSearch()}
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
                <span>Search</span>
              </>
            )}
          </button>
          <button
            onClick={clearSearch}
            disabled={loading}
            className="px-6 py-3.5 bg-gray-800 text-gray-300 rounded-xl font-semibold hover:bg-gray-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            <span>🗑️</span>
            <span>Clear</span>
          </button>
        </div>

        {/* What's my IP button */}
        <div className="mt-3">
          <button
            onClick={() => {
              if (userGeo?.query) {
                setSearchTarget(userGeo.query);
                setError('');
              }
            }}
            disabled={loading || !userGeo}
            className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg font-medium hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span>📍</span>
            <span>What's my IP?</span>
          </button>
        </div>
            disabled={loading}
            className="px-6 py-3.5 bg-gray-800 text-gray-300 rounded-xl font-semibold hover:bg-gray-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            <span>🗑️</span>
            <span>Clear</span>
          </button>
        </div>
        {error && (
          <div className="mt-4 p-3 bg-red-900/50 border border-red-700/50 rounded-lg">
            <p className="text-red-400 text-sm flex items-center">
              <span className="mr-2">⚠️</span>
              {error}
            </p>
          </div>
        )}
      </div>

      {/* Search History */}
      {history.length > 0 && (
        <div className="bg-gray-900/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-gray-800/50 shadow-2xl mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <span className="text-xl">📜</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Search History</h3>
                <p className="text-xs text-gray-400">{history.length} recent searches</p>
              </div>
            </div>
            {selectedHistory.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-red-500/20 text-sm font-medium flex items-center gap-2"
              >
                <span>🗑️</span>
                <span>Delete Selected ({selectedHistory.length})</span>
              </button>
            )}
          </div>
          <div className="mb-4 p-3 bg-gray-800/50 rounded-xl border border-gray-700">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedHistory.length === history.length && history.length > 0}
                onChange={handleSelectAll}
                className="w-4 h-4 text-cyan-500 border-gray-600 rounded focus:ring-cyan-500 bg-gray-800"
              />
              <span className="ml-3 text-sm font-medium text-gray-300">Select All</span>
            </label>
          </div>
          <div className="space-y-2">
            {history.map((target, idx) => (
              <div
                key={idx}
                className="p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all duration-200 flex items-center gap-3 group"
              >
                <input
                  type="checkbox"
                  checked={selectedHistory.includes(target)}
                  onChange={() => handleCheckboxChange(target)}
                  className="w-4 h-4 text-cyan-500 border-gray-600 rounded focus:ring-cyan-500 bg-gray-800"
                />
                <span className="flex-1 font-mono font-semibold text-white">{target}</span>
                <button
                  onClick={() => handleHistoryClick(target)}
                  className="px-4 py-2 bg-cyan-900/50 text-cyan-300 rounded-lg hover:bg-cyan-800/50 font-medium text-sm transition-all duration-200 flex items-center gap-2 group-hover:bg-cyan-800/70"
                >
                  <span>Reload</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Persistent Lookup History */}
      <HistoryList onRefresh={historyRefreshKey} />
        </>
      )}

      {/* Bulk Lookup Mode */}
      {lookupMode === 'bulk' && (
        <BulkLookup />
      )}
    </div>
  );
}
