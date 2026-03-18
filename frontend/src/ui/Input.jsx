import React from 'react';
import { cn } from './utils';

export default function Input(props) {
  return (
    <input
      {...props}
      className={cn('block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500', props.className)}
    />
  );
}
