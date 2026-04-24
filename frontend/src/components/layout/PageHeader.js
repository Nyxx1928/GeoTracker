import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import MobileNav from './MobileNav';
import { ThemeToggle } from '../ui/ThemeToggle';
import { User } from 'lucide-react';

/**
 * PageHeader - Consistent header component for all pages
 * 
 * Features:
 * - Logo with brand gradient
 * - Tagline/description
 * - Responsive navigation (MobileNav < 1024px, horizontal nav >= 1024px)
 * - User menu (when authenticated)
 * - Maintains navigation state during orientation changes
 * 
 * Requirements: 1.4, 10.1, 10.2, 7.1, 5.1, 5.5, 5.6
 */
const PageHeader = ({
  showAuth = false,
  isAuthenticated = false,
  onLogout = null,
  userName = null,
  actions = null,
  className = '',
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <header className={`flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 ${className}`}>
      {/* Logo and Branding */}
      <div className="flex-shrink-0">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
          LinkGuard
        </h1>
        <p className="text-gray-400 text-sm sm:text-base mt-1">
          Analyze links, domains, and IPs for security risks
        </p>
      </div>

      {/* Mobile Navigation - Visible on mobile (< 1024px) */}
      <div className="lg:hidden">
        <MobileNav
          isAuthenticated={isAuthenticated}
          onLogout={onLogout}
          userName={userName}
        />
      </div>

      {/* Desktop Actions and User Menu - Visible on desktop (>= 1024px) */}
      <div className="hidden lg:flex items-center gap-3 flex-wrap">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Custom Actions */}
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}

        {/* Authentication Buttons */}
        {showAuth && !isAuthenticated && (
          <>
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate('/login')}
              className="shadow-lg hover:shadow-cyan-500/20"
            >
              Log In
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/register')}
              className="shadow-lg hover:shadow-cyan-500/20"
            >
              Sign Up
            </Button>
          </>
        )}

        {/* User Menu (Authenticated) */}
        {isAuthenticated && (
          <div className="flex items-center gap-3">
            {userName && (
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300 text-sm font-medium">{userName}</span>
              </div>
            )}
            <Button
              variant="danger"
              size="md"
              onClick={handleLogout}
              className="shadow-lg hover:shadow-red-500/20"
            >
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default PageHeader;
