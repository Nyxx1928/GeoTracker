import React from 'react';
import clsx from 'clsx';
import { Check, AlertTriangle, Info } from 'lucide-react';

const RiskDisplay = ({ level, score = null, size = 'lg', showScore = true }) => {
  const riskConfig = {
    LOW: {
      label: 'Low Risk',
      icon: Check,
      gradient: 'from-green-400 to-green-600',
      bgColor: 'bg-risk-safe',
      textColor: 'text-white',
      description: 'Normal residential or mobile connection',
    },
    MEDIUM: {
      label: 'Medium Risk',
      icon: AlertTriangle,
      gradient: 'from-yellow-400 to-yellow-600',
      bgColor: 'bg-risk-caution',
      textColor: 'text-white',
      description: 'Hosting provider - could be legitimate',
    },
    HIGH: {
      label: 'High Risk',
      icon: AlertTriangle,
      gradient: 'from-red-400 to-red-600',
      bgColor: 'bg-risk-danger',
      textColor: 'text-white',
      description: 'Proxy or suspicious characteristics',
    },
    UNKNOWN: {
      label: 'Unknown',
      icon: Info,
      gradient: 'from-gray-400 to-gray-600',
      bgColor: 'bg-neutral-500',
      textColor: 'text-white',
      description: 'Unable to determine risk level',
    },
  };

  const config = riskConfig[level] || riskConfig.UNKNOWN;
  const IconComponent = config.icon;

  const sizeStyles = {
    sm: {
      container: 'p-4',
      icon: 'text-4xl',
      label: 'text-lg',
      score: 'text-2xl',
      description: 'text-sm',
    },
    md: {
      container: 'p-6',
      icon: 'text-5xl',
      label: 'text-xl',
      score: 'text-3xl',
      description: 'text-base',
    },
    lg: {
      container: 'p-8',
      icon: 'text-6xl',
      label: 'text-2xl',
      score: 'text-4xl',
      description: 'text-lg',
    },
  };

  const styles = sizeStyles[size] || sizeStyles.lg;

  return (
    <div
      className={clsx(
        'rounded-xl shadow-lg transition-smooth',
        `bg-gradient-to-br ${config.gradient}`,
        styles.container
      )}
    >
      <div className="flex flex-col items-center text-center">
        {/* Risk Icon */}
        <div
          className={clsx(
            'w-20 h-20 rounded-full flex items-center justify-center mb-4',
            'bg-white/20 backdrop-blur-sm',
            styles.icon
          )}
        >
          <IconComponent className={clsx('w-10 h-10', config.textColor)} />
        </div>

        {/* Risk Label */}
        <h3 className={clsx('font-bold mb-2', config.textColor, styles.label)}>
          {config.label}
        </h3>

        {/* Risk Score */}
        {showScore && score !== null && (
          <div className="mb-3">
            <div className={clsx('font-bold', config.textColor, styles.score)}>
              {score}
              <span className="text-xl opacity-80">/100</span>
            </div>
            <div className="w-full max-w-xs mt-2">
              <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white/80 rounded-full transition-all duration-500"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        <p className={clsx('opacity-90', config.textColor, styles.description)}>
          {config.description}
        </p>
      </div>
    </div>
  );
};

export default RiskDisplay;
