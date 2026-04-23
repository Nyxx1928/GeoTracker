import React, { useState } from 'react';
import clsx from 'clsx';

const Input = ({
  label = '',
  error = '',
  success = '',
  loading = false,
  icon = null,
  iconPosition = 'left',
  clearable = false,
  onClear = null,
  className = '',
  containerClassName = '',
  ...props
}) => {
  const [showClear, setShowClear] = useState(false);

  const baseStyles = 'w-full px-4 py-2 rounded-lg border transition-smooth focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const stateStyles = {
    default: 'border-neutral-300 focus:border-brand-500 focus:ring-brand-500/20',
    error: 'border-risk-danger focus:border-risk-danger focus:ring-risk-danger/20',
    success: 'border-risk-safe focus:border-risk-safe focus:ring-risk-safe/20',
    loading: 'border-neutral-300 focus:border-brand-500 focus:ring-brand-500/20',
  };

  const getState = () => {
    if (error) return 'error';
    if (success) return 'success';
    if (loading) return 'loading';
    return 'default';
  };

  const state = getState();

  const handleClear = () => {
    if (onClear) {
      onClear();
    }
    setShowClear(false);
  };

  const handleChange = (e) => {
    if (clearable) {
      setShowClear(e.target.value.length > 0);
    }
    if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <div className={clsx('w-full', containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-1.5">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            {icon}
          </div>
        )}
        
        <input
          className={clsx(
            baseStyles,
            stateStyles[state],
            icon && iconPosition === 'left' && 'pl-10',
            icon && iconPosition === 'right' && 'pr-10',
            (clearable && showClear) || loading ? 'pr-10' : '',
            className
          )}
          onChange={handleChange}
          {...props}
        />
        
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg
              className="animate-spin h-5 w-5 text-brand-600"
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
        )}
        
        {!loading && clearable && showClear && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-smooth"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
        
        {!loading && icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
            {icon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1.5 text-sm text-risk-danger">{error}</p>
      )}
      
      {success && !error && (
        <p className="mt-1.5 text-sm text-risk-safe">{success}</p>
      )}
    </div>
  );
};

export default Input;
