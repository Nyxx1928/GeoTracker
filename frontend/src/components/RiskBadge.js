import React from 'react';
import { Badge } from './ui';

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
 */
const RiskBadge = ({ level, size = 'md' }) => {
  // Map risk levels to badge variants
  const variantMap = {
    LOW: 'safe',
    MEDIUM: 'caution',
    HIGH: 'danger',
    UNKNOWN: 'neutral',
  };

  const labelMap = {
    LOW: 'Low Risk',
    MEDIUM: 'Medium Risk',
    HIGH: 'High Risk',
    UNKNOWN: 'Unknown',
  };

  const iconMap = {
    LOW: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
    MEDIUM: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
    ),
    HIGH: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
    UNKNOWN: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
  };

  const variant = variantMap[level] || variantMap.UNKNOWN;
  const label = labelMap[level] || labelMap.UNKNOWN;
  const icon = iconMap[level] || iconMap.UNKNOWN;

  return (
    <Badge variant={variant} size={size} icon={icon}>
      {label}
    </Badge>
  );
};

export default RiskBadge;

