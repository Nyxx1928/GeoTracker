import React from 'react';
import clsx from 'clsx';

const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon = null,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full transition-smooth';

  const variantStyles = {
    safe: 'bg-risk-safe-light text-green-800 border border-green-300',
    caution: 'bg-risk-caution-light text-yellow-800 border border-yellow-300',
    danger: 'bg-risk-danger-light text-red-800 border border-red-300',
    info: 'bg-blue-50 text-blue-800 border border-blue-300',
    neutral: 'bg-neutral-100 text-neutral-800 border border-neutral-300',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
