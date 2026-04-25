import React, { useState } from 'react';
import { Input as ShadcnInput } from './input.jsx';
import { cn } from '../../lib/utils';
import { Loader2, X } from 'lucide-react';

/**
 * Enhanced Input component built on shadcn/ui primitives
 * Supports labels, validation states, icons, loading, and clearable functionality
 * Ensures minimum 44px height for touch targets (mobile-first)
 * 
 * @param {string} label - Optional label text
 * @param {string} error - Error message to display
 * @param {string} success - Success message to display
 * @param {boolean} loading - Show loading spinner
 * @param {ReactNode} icon - Icon element to display
 * @param {string} iconPosition - Position of icon ('left' or 'right')
 * @param {boolean} clearable - Show clear button when input has value
 * @param {function} onClear - Callback when clear button is clicked
 * @param {string} className - Additional classes for input element
 * @param {string} containerClassName - Additional classes for container
 */
const Input = React.forwardRef(({
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
}, ref) => {
  const [showClear, setShowClear] = useState(false);

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

  // Determine input state styling
  const inputStateClasses = cn(
    error && 'border-destructive focus-visible:ring-destructive',
    success && !error && 'border-green-500 focus-visible:ring-green-500'
  );

  // Calculate padding based on icons and buttons
  const inputPaddingClasses = cn(
    icon && iconPosition === 'left' && 'pl-10',
    icon && iconPosition === 'right' && !clearable && !loading && 'pr-10',
    (clearable && showClear) || loading ? 'pr-10' : ''
  );

  return (
    <div className={cn('w-full', containerClassName)}>
      {label && (
        <label 
          htmlFor={props.id}
          className="block text-sm font-medium text-foreground mb-1.5"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {/* Left Icon */}
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {icon}
          </div>
        )}
        
        {/* Input Field - minimum 44px height for touch targets */}
        <ShadcnInput
          ref={ref}
          className={cn(
            'min-h-[44px]', // Mobile-first touch target
            inputStateClasses,
            inputPaddingClasses,
            className
          )}
          onChange={handleChange}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${props.id}-error` : 
            success ? `${props.id}-success` : 
            undefined
          }
          {...props}
        />
        
        {/* Loading Spinner */}
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
        
        {/* Clear Button */}
        {!loading && clearable && showClear && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center -mr-3"
            aria-label="Clear input"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        
        {/* Right Icon (only when no clear button or loading) */}
        {!loading && !clearable && icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {icon}
          </div>
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <p 
          id={`${props.id}-error`}
          className="mt-1.5 text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      )}
      
      {/* Success Message */}
      {success && !error && (
        <p 
          id={`${props.id}-success`}
          className="mt-1.5 text-sm text-green-600 dark:text-green-500"
        >
          {success}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
