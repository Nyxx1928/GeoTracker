import React from 'react';
import { cn } from './utils';

export default function Alert({ children, type = 'info', className = '' }) {
  const styles = {
    info: 'bg-blue-50 text-blue-700',
    error: 'bg-red-50 text-red-700',
    success: 'bg-green-50 text-green-700',
    warning: 'bg-yellow-50 text-yellow-700'
  };

  return <div className={cn('p-3 rounded-md', styles[type] || styles.info, className)}>{children}</div>;
}
