import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorDisplay from './ErrorDisplay';

describe('ErrorDisplay Component', () => {
  describe('Error Type Variants', () => {
    it('renders validation error with default title and message', () => {
      render(<ErrorDisplay type="validation" />);
      
      expect(screen.getByText('Invalid Input Format')).toBeInTheDocument();
      expect(screen.getByText(/format doesn't match/i)).toBeInTheDocument();
    });

    it('renders network error with default title and message', () => {
      render(<ErrorDisplay type="network" />);
      
      expect(screen.getByText('Connection Issue')).toBeInTheDocument();
      expect(screen.getByText(/couldn't connect to the server/i)).toBeInTheDocument();
    });

    it('renders rate limit error with default title and message', () => {
      render(<ErrorDisplay type="rateLimit" />);
      
      expect(screen.getByText('Too Many Requests')).toBeInTheDocument();
      expect(screen.getByText(/wait a moment before trying again/i)).toBeInTheDocument();
    });

    it('renders not found error with default title and message', () => {
      render(<ErrorDisplay type="notFound" />);
      
      expect(screen.getByText('Target Not Found')).toBeInTheDocument();
      expect(screen.getByText(/couldn't find or resolve/i)).toBeInTheDocument();
    });

    it('renders server error with default title and message', () => {
      render(<ErrorDisplay type="server" />);
      
      expect(screen.getByText('Something Went Wrong')).toBeInTheDocument();
      expect(screen.getByText(/unexpected error/i)).toBeInTheDocument();
    });
  });

  describe('Custom Content', () => {
    it('renders custom title and message', () => {
      render(
        <ErrorDisplay
          type="validation"
          title="Custom Error Title"
          message="Custom error message"
        />
      );
      
      expect(screen.getByText('Custom Error Title')).toBeInTheDocument();
      expect(screen.getByText('Custom error message')).toBeInTheDocument();
    });

    it('renders string details', () => {
      render(
        <ErrorDisplay
          type="server"
          details="Additional error information"
        />
      );
      
      expect(screen.getByText('Additional error information')).toBeInTheDocument();
    });

    it('renders array details as list', () => {
      const details = [
        'First error detail',
        'Second error detail',
        'Third error detail',
      ];
      
      render(<ErrorDisplay type="validation" details={details} />);
      
      details.forEach(detail => {
        expect(screen.getByText(detail)).toBeInTheDocument();
      });
    });
  });

  describe('Action Buttons', () => {
    it('renders retry button when onRetry provided', () => {
      const handleRetry = jest.fn();
      render(<ErrorDisplay type="network" onRetry={handleRetry} />);
      
      const retryButton = screen.getByText('Try Again');
      expect(retryButton).toBeInTheDocument();
      
      fireEvent.click(retryButton);
      expect(handleRetry).toHaveBeenCalledTimes(1);
    });

    it('renders dismiss button when onDismiss provided', () => {
      const handleDismiss = jest.fn();
      render(<ErrorDisplay type="server" onDismiss={handleDismiss} />);
      
      const dismissButton = screen.getByText('Dismiss');
      expect(dismissButton).toBeInTheDocument();
      
      fireEvent.click(dismissButton);
      expect(handleDismiss).toHaveBeenCalledTimes(1);
    });

    it('renders custom action buttons', () => {
      const handleAction1 = jest.fn();
      const handleAction2 = jest.fn();
      
      const actions = [
        { label: 'Go Home', onClick: handleAction1, variant: 'secondary' },
        { label: 'Contact Support', onClick: handleAction2, variant: 'primary' },
      ];
      
      render(<ErrorDisplay type="server" actions={actions} />);
      
      const homeButton = screen.getByText('Go Home');
      const supportButton = screen.getByText('Contact Support');
      
      expect(homeButton).toBeInTheDocument();
      expect(supportButton).toBeInTheDocument();
      
      fireEvent.click(homeButton);
      expect(handleAction1).toHaveBeenCalledTimes(1);
      
      fireEvent.click(supportButton);
      expect(handleAction2).toHaveBeenCalledTimes(1);
    });

    it('renders all button types together', () => {
      const handleRetry = jest.fn();
      const handleDismiss = jest.fn();
      const handleCustom = jest.fn();
      
      render(
        <ErrorDisplay
          type="network"
          onRetry={handleRetry}
          onDismiss={handleDismiss}
          actions={[{ label: 'Custom Action', onClick: handleCustom }]}
        />
      );
      
      expect(screen.getByText('Try Again')).toBeInTheDocument();
      expect(screen.getByText('Custom Action')).toBeInTheDocument();
      expect(screen.getByText('Dismiss')).toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('renders small size variant', () => {
      const { container } = render(<ErrorDisplay type="server" size="sm" />);
      expect(container.firstChild).toHaveClass('p-4');
    });

    it('renders medium size variant (default)', () => {
      const { container } = render(<ErrorDisplay type="server" size="md" />);
      expect(container.firstChild).toHaveClass('p-6');
    });

    it('renders large size variant', () => {
      const { container } = render(<ErrorDisplay type="server" size="lg" />);
      expect(container.firstChild).toHaveClass('p-8');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA role', () => {
      const { container } = render(<ErrorDisplay type="server" />);
      const alert = container.querySelector('[role="alert"]');
      expect(alert).toBeInTheDocument();
    });

    it('has aria-live attribute', () => {
      const { container } = render(<ErrorDisplay type="server" />);
      const alert = container.querySelector('[aria-live="polite"]');
      expect(alert).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies custom className', () => {
      const { container } = render(
        <ErrorDisplay type="server" className="custom-class" />
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('applies error-specific background colors', () => {
      const { container: validationContainer } = render(
        <ErrorDisplay type="validation" />
      );
      expect(validationContainer.firstChild).toHaveClass('bg-red-50');

      const { container: networkContainer } = render(
        <ErrorDisplay type="network" />
      );
      expect(networkContainer.firstChild).toHaveClass('bg-red-50');
    });
  });
});
