import React from 'react';
import ErrorDisplay from './ErrorDisplay';

/**
 * ErrorDisplay Component Usage Examples
 * 
 * This file demonstrates various ways to use the ErrorDisplay component
 * in different scenarios throughout the application.
 */

// Example 1: Basic validation error with defaults
export const ValidationErrorBasic = () => (
  <ErrorDisplay type="validation" />
);

// Example 2: Validation error with custom message and details
export const ValidationErrorDetailed = () => (
  <ErrorDisplay
    type="validation"
    title="Invalid Email Format"
    message="The email address you entered doesn't match the expected format."
    details={[
      'Must contain an @ symbol',
      'Must have a domain (e.g., example.com)',
      'Cannot contain spaces',
    ]}
  />
);

// Example 3: Network error with retry action
export const NetworkErrorWithRetry = () => {
  const handleRetry = () => {
    console.log('Retrying connection...');
    // Implement retry logic here
  };

  return (
    <ErrorDisplay
      type="network"
      onRetry={handleRetry}
    />
  );
};

// Example 4: Rate limit error with custom actions
export const RateLimitErrorWithActions = () => {
  const goToUpgrade = () => {
    console.log('Navigating to upgrade page...');
  };

  const learnMore = () => {
    console.log('Opening rate limit documentation...');
  };

  return (
    <ErrorDisplay
      type="rateLimit"
      message="You've reached your daily limit of 100 lookups."
      details="Upgrade to Pro for unlimited lookups and advanced features."
      actions={[
        {
          label: 'Upgrade to Pro',
          onClick: goToUpgrade,
          variant: 'primary',
        },
        {
          label: 'Learn More',
          onClick: learnMore,
          variant: 'secondary',
        },
      ]}
    />
  );
};

// Example 5: Not found error with helpful suggestions
export const NotFoundErrorWithSuggestions = () => {
  const tryExample = () => {
    console.log('Loading example target...');
  };

  return (
    <ErrorDisplay
      type="notFound"
      title="Domain Not Found"
      message="We couldn't resolve the domain you entered."
      details={[
        'Check for typos in the domain name',
        'Ensure the domain includes a TLD (.com, .org, etc.)',
        'Try entering the full URL instead',
      ]}
      actions={[
        {
          label: 'Try an Example',
          onClick: tryExample,
          variant: 'secondary',
        },
      ]}
    />
  );
};

// Example 6: Server error with retry and dismiss
export const ServerErrorWithActions = () => {
  const handleRetry = () => {
    console.log('Retrying request...');
  };

  const handleDismiss = () => {
    console.log('Error dismissed');
  };

  return (
    <ErrorDisplay
      type="server"
      onRetry={handleRetry}
      onDismiss={handleDismiss}
    />
  );
};

// Example 7: Small size variant for inline errors
export const InlineValidationError = () => (
  <ErrorDisplay
    type="validation"
    size="sm"
    title="Invalid IP Address"
    message="Please enter a valid IPv4 or IPv6 address."
  />
);

// Example 8: Large size variant for page-level errors
export const PageLevelError = () => {
  const goHome = () => {
    console.log('Navigating to home...');
  };

  const contactSupport = () => {
    console.log('Opening support contact...');
  };

  return (
    <ErrorDisplay
      type="server"
      size="lg"
      title="Service Temporarily Unavailable"
      message="We're experiencing technical difficulties. Our team has been notified and is working to resolve the issue."
      details="Error ID: ERR-2024-01-19-12345"
      actions={[
        {
          label: 'Go to Home',
          onClick: goHome,
          variant: 'primary',
        },
        {
          label: 'Contact Support',
          onClick: contactSupport,
          variant: 'secondary',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          ),
        },
      ]}
    />
  );
};

// Example 9: Authentication error (using server type with custom content)
export const AuthenticationError = () => {
  const login = () => {
    console.log('Redirecting to login...');
  };

  return (
    <ErrorDisplay
      type="server"
      title="Authentication Required"
      message="You need to be logged in to access this feature."
      actions={[
        {
          label: 'Log In',
          onClick: login,
          variant: 'primary',
        },
      ]}
    />
  );
};

// Example 10: Custom error with all features
export const CompleteExample = () => {
  const handleRetry = () => {
    console.log('Retrying...');
  };

  const handleDismiss = () => {
    console.log('Dismissed');
  };

  const viewDocs = () => {
    console.log('Opening documentation...');
  };

  return (
    <ErrorDisplay
      type="network"
      title="Connection Timeout"
      message="The request took too long to complete."
      details={[
        'Check your internet connection',
        'The server might be experiencing high traffic',
        'Try again in a few moments',
      ]}
      onRetry={handleRetry}
      onDismiss={handleDismiss}
      actions={[
        {
          label: 'View Documentation',
          onClick: viewDocs,
          variant: 'secondary',
        },
      ]}
      size="md"
      className="max-w-2xl mx-auto"
    />
  );
};

// Example 11: Conditional error display based on error type
export const ConditionalErrorDisplay = ({ error }) => {
  if (!error) return null;

  // Map backend error codes to error types
  const getErrorType = (errorCode) => {
    if (errorCode === 400) return 'validation';
    if (errorCode === 404) return 'notFound';
    if (errorCode === 429) return 'rateLimit';
    if (errorCode >= 500) return 'server';
    return 'network';
  };

  const handleRetry = () => {
    console.log('Retrying...');
  };

  return (
    <ErrorDisplay
      type={getErrorType(error.code)}
      title={error.title}
      message={error.message}
      details={error.details}
      onRetry={error.retryable ? handleRetry : null}
    />
  );
};

// Example 12: Error display in a form context
export const FormErrorDisplay = ({ errors, onClear }) => {
  if (!errors || errors.length === 0) return null;

  return (
    <ErrorDisplay
      type="validation"
      title="Please fix the following errors:"
      details={errors}
      onDismiss={onClear}
      size="sm"
    />
  );
};
