import React from 'react';
import clsx from 'clsx';

const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-xl transition-smooth';

  const variantStyles = {
    default: 'bg-white border border-neutral-200 shadow-md',
    elevated: 'bg-white shadow-lg hover:shadow-xl',
    outlined: 'bg-transparent border-2 border-neutral-300',
    glass: 'bg-white/80 backdrop-blur-glass border border-neutral-200/50 shadow-lg',
  };

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverStyles = hover ? 'hover:shadow-xl hover:-translate-y-1' : '';

  return (
    <div
      className={clsx(
        baseStyles,
        variantStyles[variant],
        paddingStyles[padding],
        hoverStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
