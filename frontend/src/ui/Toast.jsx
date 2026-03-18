import React from 'react';

export function Toast({ children, className = '' }) {
  return (
    <div className={"fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-2 rounded-md shadow-lg " + className}>
      {children}
    </div>
  );
}

export default Toast;
