import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PageHeader from './PageHeader';

// Mock react-router-dom
jest.mock(
  'react-router-dom',
  () => ({
    useNavigate: () => jest.fn()
  }),
  { virtual: true }
);

describe('PageHeader Component', () => {
  describe('Branding', () => {
    it('renders logo and tagline', () => {
      render(<PageHeader />);
      
      expect(screen.getByText('LinkGuard')).toBeInTheDocument();
      expect(screen.getByText('Analyze links, domains, and IPs for security risks')).toBeInTheDocument();
    });

    it('applies brand gradient to logo', () => {
      render(<PageHeader />);
      
      const logo = screen.getByText('LinkGuard');
      expect(logo).toHaveClass('bg-gradient-to-r', 'from-cyan-400', 'to-cyan-600');
    });
  });

  describe('Unauthenticated State', () => {
    it('shows auth buttons when showAuth is true and not authenticated', () => {
      render(<PageHeader showAuth={true} isAuthenticated={false} />);
      
      expect(screen.getByText('Log In')).toBeInTheDocument();
      expect(screen.getByText('Sign Up')).toBeInTheDocument();
    });

    it('does not show auth buttons when showAuth is false', () => {
      render(<PageHeader showAuth={false} isAuthenticated={false} />);
      
      expect(screen.queryByText('Log In')).not.toBeInTheDocument();
      expect(screen.queryByText('Sign Up')).not.toBeInTheDocument();
    });
  });

  describe('Authenticated State', () => {
    it('shows logout button when authenticated', () => {
      render(<PageHeader isAuthenticated={true} />);
      
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    it('shows user name when provided', () => {
      render(<PageHeader isAuthenticated={true} userName="John Doe" />);
      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('does not show auth buttons when authenticated', () => {
      render(<PageHeader showAuth={true} isAuthenticated={true} />);
      
      expect(screen.queryByText('Log In')).not.toBeInTheDocument();
      expect(screen.queryByText('Sign Up')).not.toBeInTheDocument();
    });

    it('calls onLogout when logout button is clicked', () => {
      const mockLogout = jest.fn();
      render(<PageHeader isAuthenticated={true} onLogout={mockLogout} />);
      
      const logoutButton = screen.getByText('Logout');
      fireEvent.click(logoutButton);
      
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  describe('Custom Actions', () => {
    it('renders custom actions when provided', () => {
      const customActions = (
        <button data-testid="custom-action">Custom Action</button>
      );
      
      render(<PageHeader actions={customActions} />);
      
      expect(screen.getByTestId('custom-action')).toBeInTheDocument();
    });
  });

  describe('Responsive Layout', () => {
    it('applies responsive flex classes', () => {
      const { container } = render(<PageHeader />);
      
      const header = container.querySelector('header');
      expect(header).toHaveClass('flex', 'flex-col', 'sm:flex-row');
    });

    it('applies custom className', () => {
      const { container } = render(<PageHeader className="custom-class" />);
      
      const header = container.querySelector('header');
      expect(header).toHaveClass('custom-class');
    });
  });

  describe('Snapshot Tests', () => {
    it('matches snapshot for unauthenticated state', () => {
      const { container } = render(
        <PageHeader showAuth={true} isAuthenticated={false} />
      );
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot for authenticated state', () => {
      const { container } = render(
        <PageHeader isAuthenticated={true} userName="John Doe" />
      );
      expect(container).toMatchSnapshot();
    });

    it('matches snapshot with custom actions', () => {
      const customActions = <button>Custom</button>;
      const { container } = render(
        <PageHeader actions={customActions} />
      );
      expect(container).toMatchSnapshot();
    });
  });
});
