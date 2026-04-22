import React from 'react';

/**
 * RiskBadge - Displays a color-coded risk level indicator.
 * 
 * This component provides instant visual feedback about the risk level
 * of a target based on network characteristics (proxy, hosting, etc.).
 * 
 * Risk Levels:
 * - LOW: Green - Normal residential/mobile connection
 * - MEDIUM: Amber - Hosting provider (could be legitimate server)
 * - HIGH: Red - Proxy or suspicious characteristics
 * - UNKNOWN: Grey - Unable to determine risk
 * 
 * Teaching Point: This is a "presentational component" - it receives
 * data via props and renders UI. It has no business logic or state.
 * This makes it easy to test and reuse across the application.
 */
const RiskBadge = ({ level }) => {
  // Define color schemes for each risk level
  const riskStyles = {
    LOW: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-300',
      label: 'Low Risk',
      description: 'Normal residential or mobile connection',
    },
    MEDIUM: {
      bg: 'bg-amber-100',
      text: 'text-amber-800',
      border: 'border-amber-300',
      label: 'Medium Risk',
      description: 'Hosting provider - could be legitimate server',
    },
    HIGH: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-300',
      label: 'High Risk',
      description: 'Proxy or suspicious network characteristics',
    },
    UNKNOWN: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      border: 'border-gray-300',
      label: 'Unknown',
      description: 'Unable to determine risk level',
    },
  };

  // Get the style for the current risk level (default to UNKNOWN if invalid)
  const style = riskStyles[level] || riskStyles.UNKNOWN;

  return (
    <div className="inline-flex items-center group relative">
      {/* The badge itself */}
      <span
        className={`
          inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
          border ${style.bg} ${style.text} ${style.border}
        `}
      >
        {/* Risk level icon */}
        <svg
          className="w-4 h-4 mr-1.5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          {level === 'HIGH' && (
            // Warning triangle for high risk
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          )}
          {level === 'MEDIUM' && (
            // Info circle for medium risk
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          )}
          {level === 'LOW' && (
            // Check circle for low risk
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          )}
          {level === 'UNKNOWN' && (
            // Question mark for unknown
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          )}
        </svg>
        {style.label}
      </span>

      {/* Tooltip that appears on hover */}
      <div
        className="
          absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2
          px-3 py-2 bg-gray-900 text-white text-sm rounded-lg
          opacity-0 group-hover:opacity-100 transition-opacity duration-200
          pointer-events-none whitespace-nowrap z-10
        "
      >
        {style.description}
        {/* Tooltip arrow */}
        <div
          className="
            absolute top-full left-1/2 transform -translate-x-1/2
            border-4 border-transparent border-t-gray-900
          "
        />
      </div>
    </div>
  );
};

export default RiskBadge;

