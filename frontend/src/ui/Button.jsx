import React from 'react';
import { cn } from './utils';

export default function Button({ children, className = '', variant = 'default', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50';
  const variants = {
    default: 'bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-300',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-200',
    destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-300'
  };

  return (
    <button className={cn(base, variants[variant] || variants.default, className)} {...props}>
      {children}
    </button>
  );
}
