import React from 'react';
import { Button as ShadcnButton } from './button.jsx';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Enhanced Button component built on shadcn/ui primitives
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.variant - Button variant (primary, secondary, danger, ghost, outline, link)
 * @param {string} props.size - Button size (sm, md, lg, icon)
 * @param {boolean} props.loading - Show loading spinner
 * @param {boolean} props.disabled - Disable button
 * @param {React.ReactNode} props.icon - Icon element (lucide-react icon)
 * @param {string} props.iconPosition - Icon position (left or right)
 * @param {string} props.className - Additional CSS classes
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon = null,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  // Map old variant names to shadcn variants for backward compatibility
  const variantMap = {
    primary: 'default',
    secondary: 'secondary',
    danger: 'destructive',
    ghost: 'ghost',
    outline: 'outline',
    link: 'link',
    default: 'default',
    destructive: 'destructive',
  };

  // Map old size names to shadcn sizes for backward compatibility
  const sizeMap = {
    sm: 'sm',
    md: 'default',
    lg: 'lg',
    default: 'default',
    icon: 'icon',
  };

  const mappedVariant = variantMap[variant] || 'default';
  const mappedSize = sizeMap[size] || 'default';
  const isDisabled = disabled || loading;

  return (
    <ShadcnButton
      variant={mappedVariant}
      size={mappedSize}
      disabled={isDisabled}
      className={cn(className)}
      {...props}
    >
      {loading && (
        <Loader2 className="h-4 w-4 animate-spin" />
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className="inline-flex">{icon}</span>
      )}
      
      {children}
      
      {!loading && icon && iconPosition === 'right' && (
        <span className="inline-flex">{icon}</span>
      )}
    </ShadcnButton>
  );
};

export default Button;
