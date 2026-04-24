import React from 'react';
import { cn } from '../../lib/utils';
import { cva } from 'class-variance-authority';

/**
 * Enhanced Badge component built on shadcn/ui primitives
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Badge content
 * @param {string} props.variant - Badge variant (safe, caution, danger, info, neutral, success, warning, destructive, default, secondary, outline)
 * @param {string} props.size - Badge size (sm, md, lg)
 * @param {React.ReactNode} props.icon - Icon element (lucide-react icon)
 * @param {string} props.className - Additional CSS classes
 */

// Extended badge variants with size support and custom variants
const extendedBadgeVariants = cva(
  "inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-transparent bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900/30 dark:text-green-400",
        warning: "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80 dark:bg-yellow-900/30 dark:text-yellow-400",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon = null,
  className = '',
  ...props
}) => {
  // Map old variant names to shadcn variants for backward compatibility
  const variantMap = {
    safe: 'success',
    caution: 'warning',
    danger: 'destructive',
    info: 'default',
    neutral: 'secondary',
    success: 'success',
    warning: 'warning',
    destructive: 'destructive',
    default: 'default',
    secondary: 'secondary',
    outline: 'outline',
  };

  const mappedVariant = variantMap[variant] || 'default';

  return (
    <div
      className={cn(extendedBadgeVariants({ variant: mappedVariant, size }), className)}
      {...props}
    >
      {icon && <span className="mr-1.5 inline-flex items-center">{icon}</span>}
      {children}
    </div>
  );
};

export default Badge;
