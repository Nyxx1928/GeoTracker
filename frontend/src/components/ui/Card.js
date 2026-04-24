import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import {
  Card as ShadcnCard,
  CardHeader as ShadcnCardHeader,
  CardTitle as ShadcnCardTitle,
  CardDescription as ShadcnCardDescription,
  CardContent as ShadcnCardContent,
  CardFooter as ShadcnCardFooter,
} from './card';

// Define card variants using class-variance-authority
const cardVariants = cva(
  'rounded-xl transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 shadow-md',
        elevated: 'bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl',
        outlined: 'bg-transparent border-2 border-neutral-300 dark:border-gray-600',
        glass: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-neutral-200/50 dark:border-gray-700/50 shadow-lg',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
);

// Main Card component with backward compatibility
const Card = React.forwardRef(({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  className = '',
  ...props
}, ref) => {
  const hoverStyles = hover ? 'hover:shadow-xl hover:-translate-y-1' : '';

  return (
    <ShadcnCard
      ref={ref}
      className={cn(
        cardVariants({ variant, padding }),
        hoverStyles,
        className
      )}
      {...props}
    >
      {children}
    </ShadcnCard>
  );
});

Card.displayName = 'Card';

// Export composition components from shadcn
const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <ShadcnCardHeader
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <ShadcnCardTitle
    ref={ref}
    className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <ShadcnCardDescription
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <ShadcnCardContent
    ref={ref}
    className={cn('p-6 pt-0', className)}
    {...props}
  />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <ShadcnCardFooter
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

// Export all components
export default Card;
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
