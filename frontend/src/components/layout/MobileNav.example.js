/**
 * MobileNav Component Usage Examples
 * 
 * This file demonstrates how to use the MobileNav component in different scenarios.
 */

import React from 'react';
import MobileNav from './MobileNav';

// Example 1: Basic usage (unauthenticated)
export const BasicMobileNav = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Basic Mobile Navigation (Unauthenticated)</h2>
      <MobileNav isAuthenticated={false} />
    </div>
  );
};

// Example 2: Authenticated user with logout
export const AuthenticatedMobileNav = () => {
  const handleLogout = () => {
    console.log('User logged out');
    // Add your logout logic here
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Mobile Navigation (Authenticated)</h2>
      <MobileNav 
        isAuthenticated={true} 
        onLogout={handleLogout}
      />
    </div>
  );
};

// Example 3: Authenticated user with username
export const AuthenticatedWithUserName = () => {
  const handleLogout = () => {
    console.log('User logged out');
    localStorage.removeItem('auth_token');
    window.location.href = '/';
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Mobile Navigation (With Username)</h2>
      <MobileNav 
        isAuthenticated={true}
        userName="John Doe"
        onLogout={handleLogout}
      />
    </div>
  );
};

// Example 4: Integration with PageHeader
export const IntegratedExample = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [userName, setUserName] = React.useState('');

  const handleLogin = () => {
    setIsAuthenticated(true);
    setUserName('Jane Smith');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserName('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-4">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
              LinkGuard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Analyze links, domains, and IPs for security risks
            </p>
          </div>
          
          {/* Mobile Navigation - Only visible on mobile screens */}
          <div className="lg:hidden">
            <MobileNav 
              isAuthenticated={isAuthenticated}
              userName={userName}
              onLogout={handleLogout}
            />
          </div>
          
          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden lg:flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <button className="px-4 py-2 text-gray-700 dark:text-gray-300">
                  Log In
                </button>
                <button className="px-4 py-2 bg-cyan-500 text-white rounded-lg">
                  Sign Up
                </button>
              </>
            ) : (
              <>
                <span className="text-gray-700 dark:text-gray-300">{userName}</span>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </header>

        <main className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Welcome to LinkGuard</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This example shows how MobileNav integrates with your page layout.
            Try resizing your browser to see the mobile navigation in action!
          </p>
          
          {!isAuthenticated && (
            <button 
              onClick={handleLogin}
              className="px-6 py-3 bg-cyan-500 text-white rounded-lg"
            >
              Simulate Login
            </button>
          )}
        </main>
      </div>
    </div>
  );
};

/**
 * Usage Notes:
 * 
 * 1. The MobileNav component is designed to be used on mobile screens (< 1024px)
 * 2. It uses the shadcn Sheet component for the slide-out drawer
 * 3. All navigation links have a minimum height of 44px for touch-friendly interaction
 * 4. The component automatically closes the drawer after navigation
 * 5. Icons are from lucide-react for a professional appearance
 * 
 * Props:
 * - isAuthenticated (boolean): Whether the user is logged in
 * - onLogout (function): Callback function when logout is clicked
 * - userName (string, optional): Display name of the authenticated user
 * 
 * Responsive Behavior:
 * - The hamburger menu button has className "lg:hidden" to hide on desktop
 * - Pair with desktop navigation that has className "hidden lg:flex"
 * - This ensures proper navigation across all screen sizes
 */
