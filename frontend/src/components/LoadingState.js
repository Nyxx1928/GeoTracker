import React from 'react';
import clsx from 'clsx';
import { Check } from 'lucide-react';

const LoadingState = ({
  message = 'Loading...',
  steps = [],
  currentStep = 0,
  progress = null,
  estimatedTime = null,
  size = 'md',
}) => {
  const sizeStyles = {
    sm: {
      spinner: 'w-8 h-8',
      text: 'text-sm',
      container: 'p-4',
    },
    md: {
      spinner: 'w-12 h-12',
      text: 'text-base',
      container: 'p-6',
    },
    lg: {
      spinner: 'w-16 h-16',
      text: 'text-lg',
      container: 'p-8',
    },
  };

  const styles = sizeStyles[size] || sizeStyles.md;

  return (
    <div className={clsx('flex flex-col items-center justify-center', styles.container)}>
      {/* Spinner */}
      <div className="relative mb-4">
        <svg
          className={clsx('animate-spin text-brand-600', styles.spinner)}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>

      {/* Main Message */}
      <p className={clsx('font-medium text-neutral-900 mb-2', styles.text)}>
        {message}
      </p>

      {/* Progress Bar */}
      {progress !== null && (
        <div className="w-full max-w-md mb-4">
          <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-600 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-neutral-500 text-center mt-1">
            {progress}% complete
          </p>
        </div>
      )}

      {/* Step Tracking */}
      {steps.length > 0 && (
        <div className="w-full max-w-md mt-4 space-y-2">
          {steps.map((step, index) => {
            const isComplete = index < currentStep;
            const isCurrent = index === currentStep;
            const isPending = index > currentStep;

            return (
              <div
                key={index}
                className={clsx(
                  'flex items-center space-x-3 p-2 rounded-lg transition-smooth',
                  isCurrent && 'bg-brand-50',
                  isComplete && 'opacity-60'
                )}
              >
                {/* Step Icon */}
                <div
                  className={clsx(
                    'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                    isComplete && 'bg-risk-safe text-white',
                    isCurrent && 'bg-brand-600 text-white',
                    isPending && 'bg-neutral-200 text-neutral-500'
                  )}
                >
                  {isComplete ? <Check className="w-4 h-4" /> : index + 1}
                </div>

                {/* Step Label */}
                <span
                  className={clsx(
                    'text-sm',
                    isCurrent && 'font-medium text-neutral-900',
                    isComplete && 'text-neutral-600',
                    isPending && 'text-neutral-400'
                  )}
                >
                  {step}
                </span>

                {/* Current Step Indicator */}
                {isCurrent && (
                  <div className="flex-shrink-0 ml-auto">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-brand-600 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-brand-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-brand-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Estimated Time */}
      {estimatedTime && (
        <p className="text-xs text-neutral-500 mt-4">
          Estimated time: {estimatedTime}
        </p>
      )}
    </div>
  );
};

export default LoadingState;
