import React from 'react';
import clsx from 'clsx';
import { Button } from './ui';

/**
 * ErrorDisplay - Friendly error message component with clear next steps
 * 
 * Displays user-friendly error messages with appropriate styling, icons,
 * and actionable next steps. Designed to guide users toward resolution
 * without causing alarm.
 * 
 * Error Types:
 * - validation: Invalid input format
 * - network: Connection or network issues
 * - rateLimit: Too many requests
 * - notFound: Target couldn't be resolved
 * - server: Backend or server errors
 */
const ErrorDisplay = ({
  type = 'server',
  title = null,
  message = null,
  details = null,
  actions = [],
  onRetry = null,
  onDismiss = null,
  size = 'md',
  className = '',
}) => {
  // Error type configurations
  const errorConfig = {
    validation: {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      defaultTitle: 'Invalid Input Format',
      defaultMessage: 'The format doesn\'t match any supported type.',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-500',
      textColor: 'text-red-900',
      detailsColor: 'text-red-700',
    },
    network: {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
          />
        </svg>
      ),
      defaultTitle: 'Connection Issue',
      defaultMessage: 'We couldn\'t connect to the server. Please check your internet connection.',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-500',
      textColor: 'text-red-900',
      detailsColor: 'text-red-700',
    },
    rateLimit: {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      defaultTitle: 'Too Many Requests',
      defaultMessage: 'You\'ve made too many requests. Please wait a moment before trying again.',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-500',
      textColor: 'text-red-900',
      detailsColor: 'text-red-700',
    },
    notFound: {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
      defaultTitle: 'Target Not Found',
      defaultMessage: 'We couldn\'t find or resolve the target you entered.',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-500',
      textColor: 'text-red-900',
      detailsColor: 'text-red-700',
    },
    server: {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
      defaultTitle: 'Something Went Wrong',
      defaultMessage: 'We encountered an unexpected error. Please try again in a moment.',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-500',
      textColor: 'text-red-900',
      detailsColor: 'text-red-700',
    },
  };

  const config = errorConfig[type] || errorConfig.server;

  const sizeStyles = {
    sm: {
      container: 'p-4',
      icon: 'w-10 h-10',
      title: 'text-base',
      message: 'text-sm',
      details: 'text-xs',
    },
    md: {
      container: 'p-6',
      icon: 'w-12 h-12',
      title: 'text-lg',
      message: 'text-base',
      details: 'text-sm',
    },
    lg: {
      container: 'p-8',
      icon: 'w-14 h-14',
      title: 'text-xl',
      message: 'text-lg',
      details: 'text-base',
    },
  };

  const styles = sizeStyles[size] || sizeStyles.md;

  const displayTitle = title || config.defaultTitle;
  const displayMessage = message || config.defaultMessage;

  return (
    <div
      className={clsx(
        'rounded-xl border-2 transition-smooth',
        config.bgColor,
        config.borderColor,
        styles.container,
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex flex-col items-center text-center">
        {/* Error Icon */}
        <div
          className={clsx(
            'rounded-full flex items-center justify-center mb-4',
            'bg-white/60 backdrop-blur-sm',
            config.iconColor,
            styles.icon
          )}
        >
          {config.icon}
        </div>

        {/* Error Title */}
        <h3 className={clsx('font-bold mb-2', config.textColor, styles.title)}>
          {displayTitle}
        </h3>

        {/* Error Message */}
        <p className={clsx('mb-4', config.textColor, styles.message)}>
          {displayMessage}
        </p>

        {/* Error Details */}
        {details && (
          <div
            className={clsx(
              'w-full p-3 rounded-lg mb-4',
              'bg-white/60 backdrop-blur-sm',
              config.detailsColor,
              styles.details
            )}
          >
            {Array.isArray(details) ? (
              <ul className="list-disc list-inside text-left space-y-1">
                {details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            ) : (
              <p className="text-left">{details}</p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          {onRetry && (
            <Button
              variant="primary"
              size={size === 'lg' ? 'md' : 'sm'}
              onClick={onRetry}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              }
            >
              Try Again
            </Button>
          )}

          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'secondary'}
              size={size === 'lg' ? 'md' : 'sm'}
              onClick={action.onClick}
              icon={action.icon}
            >
              {action.label}
            </Button>
          ))}

          {onDismiss && (
            <Button
              variant="ghost"
              size={size === 'lg' ? 'md' : 'sm'}
              onClick={onDismiss}
            >
              Dismiss
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
