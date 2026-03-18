import React from 'react';
import { cn } from './utils';

export default function Card({ children, className = '' }) {
  return <div className={cn('bg-white shadow-sm rounded-md p-4', className)}>{children}</div>;
}
