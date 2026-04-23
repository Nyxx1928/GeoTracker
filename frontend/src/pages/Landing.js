import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PageHeader from '../components/layout/PageHeader';
import PageContainer from '../components/layout/PageContainer';
import Button from '../components/ui/Button';
import ResultCard from '../components/ResultCard';
import TransparencyPanel from '../components/TransparencyPanel';
import EducationalTooltip from '../components/EducationalTooltip';
import LoadingState from '../components/LoadingState';
import RiskDisplay from '../components/RiskDisplay';

/**
 * Landing - Public landing page for unauthenticated users.
 * 
 * Features:
 * - Professional hero section with branding
 * - Shows visitor's IP and location automatically
 * - Allows public lookups without authentication
 * - Educational tooltips for key features
 * - Transparency panel explaining validation methodology
 * - Uses new design system components
 * - Prompts users to log in or register to save history
 * 
 * Requirements: 1.1, 1.4, 2.1, 4.1, 10.1, 10.3
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
    <PageContainer className="text-gray-100">
      {/* Header */}
      <PageHeader showAuth={true} isAuthenticated={false} />

      {/* Hero Section */}
      <div className="text-center mb-12 py-8">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-600 bg-clip-text text-transparent">
          Validate Links Before You Click
        </h2>
        <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-6">
          Protect yourself from malicious links, phishing attempts, and suspicious domains. 
          Get instant security analysis with geographic intelligence and risk assessment.
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <EducationalTooltip
              content="We analyze IP addresses, domains, URLs, and email addresses to detect potential security threats based on network characteristics and geographic data."
              position="bottom"
            >
              <span className="flex items-center gap-2 cursor-help hover:text-cyan-400 transition-colors">
                <span className="text-2xl">🔍</span>
                <span>Multi-Source Analysis</span>
              </span>
            </EducationalTooltip>
          </div>
          <div className="flex items-center gap-2">
            <EducationalTooltip
              content="Get results in seconds with real-time DNS resolution, geolocation lookup, and network intelligence analysis."
              position="bottom"
            >
              <span className="flex items-center gap-2 cursor-help hover:text-cyan-400 transition-colors">
                <span className="text-2xl">⚡</span>
                <span>Instant Results</span>
              </span>
            </EducationalTooltip>
          </div>
          <div className="flex items-center gap-2">
            <EducationalTooltip
              content="We use standard DNS queries and reputable geolocation databases. No data is stored without your permission."
              position="bottom"
            >
              <span className="flex items-center gap-2 cursor-help hover:text-cyan-400 transition-colors">
                <span className="text-2xl">🔒</span>
                <span>Privacy Focused</span>
              </span>
            </EducationalTooltip>
          </div>
        </div>
      </div>

      {/* Visitor IP Display */}
      {visitorGeo && (
        <div className="bg-gray-900/60 backdrop-blur-md p-6 rounded-2xl border border-cyan-500/20 shadow-2xl shadow-cyan-500/10 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">📍</span>
            <div>
              <h3 className="text-xl font-semibold text-white">Your Current Location</h3>
              <p className="text-sm text-gray-400">Automatically detected from your IP address</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <span className="text-gray-400 text-xs uppercase tracking-wide">IP Address</span>
              <p className="font-mono font-semibold text-white text-lg mt-1">{visitorGeo.query}</p>
            </div>
            {visitorGeo.city && (
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <span className="text-gray-400 text-xs uppercase tracking-wide">Location</span>
                <p className="font-semibold text-white text-lg mt-1">
                  {visitorGeo.city}, {visitorGeo.country}
                </p>
              </div>
            )}
            {visitorGeo.isp && (
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <span className="text-gray-400 text-xs uppercase tracking-wide">ISP</span>
                <p className="font-semibold text-white text-lg mt-1">{visitorGeo.isp}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="mb-8 bg-gray-900/60 backdrop-blur-md p-8 rounded-2xl border border-cyan-500/20">
          <LoadingState
            message="Analyzing security indicators..."
            steps={[
              'Resolving domain',
              'Checking geolocation',
              'Analyzing network',
              'Calculating risk score'
            ]}
            currentStep={1}
            size="lg"
          />
        </div>
      )}

      {/* Current Result Display */}
      {currentResult && !loading && (
        <div className="mb-8">
          <ResultCard result={currentResult} showShareLink={false} />
        </div>
      )}

      {/* Search Controls */}
      <div className="bg-gray-900/60 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-cyan-500/20 shadow-2xl shadow-cyan-500/10 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🔍</span>
          <h3 className="text-xl font-semibold text-white">Analyze a Target</h3>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Enter IP, domain, URL, or email (e.g., 8.8.8.8, example.com, https://example.com)"
                value={searchTarget}
                onChange={(e) => {
                  setSearchTarget(e.target.value);
                  if (error) setError('');
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !loading) handleSearch();
                }}
                disabled={loading}
                className="w-full px-5 py-4 bg-gray-800/80 border-2 border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium placeholder-gray-500 text-base"
              />
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={handleSearch}
              disabled={loading}
              loading={loading}
              icon={!loading && <span>🔍</span>}
              iconPosition="left"
              className="shadow-lg hover:shadow-cyan-500/50 min-w-[140px]"
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </Button>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={handleWhatsMyIP}
              disabled={loading || !visitorGeo}
              icon={<span>📍</span>}
              iconPosition="left"
            >
              What's my IP?
            </Button>
            <Button
              variant="ghost"
              size="md"
              onClick={clearSearch}
              disabled={loading}
              icon={<span>🗑️</span>}
              iconPosition="left"
            >
              Clear
            </Button>
          </div>

          {error && (
            <div className="mt-2 p-4 bg-red-900/50 border-2 border-red-700/50 rounded-xl">
              <p className="text-red-300 text-sm flex items-center">
                <span className="mr-2 text-lg">⚠️</span>
                <span className="font-medium">{error}</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Transparency Panel */}
      <div className="mb-8">
        <TransparencyPanel />
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 backdrop-blur-md p-8 sm:p-10 rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/10">
        <div className="text-center">
          <div className="inline-block p-3 bg-cyan-500/20 rounded-full mb-4">
            <span className="text-4xl">💾</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Want to Save Your Lookups?
          </h2>
          <p className="text-gray-300 text-base sm:text-lg mb-6 max-w-2xl mx-auto">
            Create a free account to save your lookup history, add custom labels, 
            and share results with your team. Track patterns and build your security intelligence.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/register')}
              className="shadow-lg hover:shadow-cyan-500/50"
            >
              Create Free Account
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/login')}
            >
              Log In
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Landing;
