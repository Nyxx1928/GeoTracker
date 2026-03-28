import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import GeoMap from '../components/GeoMap';
import MapErrorBoundary from '../components/MapErrorBoundary';

export default function Home({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [userGeo, setUserGeo] = useState(null);
  const [searchIp, setSearchIp] = useState('');
  const [currentGeo, setCurrentGeo] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Load user's current location on mount
  useEffect(() => {
    fetchUserGeo();
  }, []);

  const fetchUserGeo = async () => {
    try {
      const res = await api.get('/api/geo');
      setUserGeo(res.data);
      setCurrentGeo(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load your location');
    }
  };

  const handleSearch = async (ipToSearch = null) => {
    if (ipToSearch !== null && typeof ipToSearch === 'object' && ipToSearch.target) {
      console.warn('handleSearch was called with React event object - ignoring');
      return;
    }
    const ip = String(ipToSearch || searchIp || '').trim();
    if (!ip) { setError('Please enter an IP address'); return; }
    setError('');
    setLoading(true);

    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]+|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/i;

    if (!ipv4Regex.test(ip) && !ipv6Regex.test(ip)) {
      setError('Invalid IP address format.');
      setLoading(false);
      return;
    }

    try {
      const res = await api.get(`/api/geo/${ip}`);
      if (res.data && res.data.status === 'success') {
        setCurrentGeo(res.data);
        setHistory(prev => [...new Set([ip, ...prev])].slice(0, 10));
        setError('');
        setSearchIp(ip);
      } else {
        setError(res.data?.message || 'Location data not available for this IP address');
      }
    } catch {
      setError('Failed to fetch geolocation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchIp('');
    setCurrentGeo(userGeo);
    setError('');
  };

  const handleHistoryClick = (ip) => {
    handleSearch(ip);
  };

  const handleCheckboxChange = (ip) => {
    setSelectedHistory(prev =>
      prev.includes(ip) ? prev.filter(item => item !== ip) : [...prev, ip]
    );
  };

  const handleDeleteSelected = () => {
    setHistory(prev => prev.filter(ip => !selectedHistory.includes(ip)));
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
            GeoTracker
          </h1>
          <p className="text-gray-400 mt-1">Track and explore IP addresses worldwide</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-medium hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-cyan-500/20 flex items-center gap-2"
        >
          <span>Logout</span>
        </button>
      </div>

      {/* Current Location Display */}
      {currentGeo && (
        <div className="bg-gray-900/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-gray-800/50 shadow-2xl mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <span className="text-2xl">📍</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Location Details</h2>
              <p className="text-sm text-gray-400">Geolocation information</p>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                <p className="text-xs text-cyan-400 mb-1 font-medium">IP Address</p>
                <p className="text-lg font-mono font-semibold text-white">{currentGeo.query}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                  <p className="text-xs text-gray-400 mb-1 font-medium">City</p>
                  <p className="text-base font-semibold text-white">{currentGeo.city || 'N/A'}</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                  <p className="text-xs text-gray-400 mb-1 font-medium">Region</p>
                  <p className="text-base font-semibold text-white">{currentGeo.regionName || 'N/A'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                  <p className="text-xs text-gray-400 mb-1 font-medium">Country</p>
                  <p className="text-base font-semibold text-white">{currentGeo.country || 'N/A'}</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                  <p className="text-xs text-gray-400 mb-1 font-medium">Coordinates</p>
                  <p className="text-sm font-mono text-cyan-300">
                    {currentGeo.lat != null ? `${currentGeo.lat}, ${currentGeo.lon}` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {currentGeo.lat != null && currentGeo.lon != null && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🗺️</span>
                  <h3 className="text-lg font-semibold text-white">Interactive Map</h3>
                </div>
                <MapErrorBoundary
                  lat={currentGeo.lat}
                  lon={currentGeo.lon}
                  resetKey={`${currentGeo.lat},${currentGeo.lon},${currentGeo.query || ''}`}
                >
                  <GeoMap lat={currentGeo.lat} lon={currentGeo.lon} />
                </MapErrorBoundary>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search Controls */}
      <div className="bg-gray-900/80 backdrop-blur-md p-6 rounded-2xl border border-gray-800/50 shadow-2xl mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Enter IP address (e.g. 8.8.8.8 or 2001:db8::1)"
              value={searchIp}
              onChange={(e) => {
                setSearchIp(e.target.value);
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
        <div className="bg-gray-900/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-gray-800/50 shadow-2xl">
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
            {history.map((ip, idx) => (
              <div
                key={idx}
                className="p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all duration-200 flex items-center gap-3 group"
              >
                <input
                  type="checkbox"
                  checked={selectedHistory.includes(ip)}
                  onChange={() => handleCheckboxChange(ip)}
                  className="w-4 h-4 text-cyan-500 border-gray-600 rounded focus:ring-cyan-500 bg-gray-800"
                />
                <span className="flex-1 font-mono font-semibold text-white">{ip}</span>
                <button
                  onClick={() => handleHistoryClick(ip)}
                  className="px-4 py-2 bg-cyan-900/50 text-cyan-300 rounded-lg hover:bg-cyan-800/50 font-medium text-sm transition-all duration-200 flex items-center gap-2 group-hover:bg-cyan-800/70"
                >
                  <span>Reload</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
