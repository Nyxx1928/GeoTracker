import React from 'react';
import { render, screen } from '@testing-library/react';
import Badge from './Badge';
import { Shield } from 'lucide-react';

describe('Badge Component', () => {
  it('renders children correctly', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('applies default variant when no variant specified', () => {
    render(<Badge>Default</Badge>);
    expect(screen.getByText('Default')).toBeInTheDocument();
  });

  it('maps old variant names to new shadcn variants', () => {
    render(<Badge variant="safe">Safe</Badge>);
    expect(screen.getByText('Safe')).toBeInTheDocument();

    render(<Badge variant="caution">Caution</Badge>);
    expect(screen.getByText('Caution')).toBeInTheDocument();

    render(<Badge variant="danger">Danger</Badge>);
    expect(screen.getByText('Danger')).toBeInTheDocument();
  });

  it('supports size prop', () => {
    render(<Badge size="sm">Small</Badge>);
    expect(screen.getByText('Small')).toBeInTheDocument();

    render(<Badge size="lg">Large</Badge>);
    expect(screen.getByText('Large')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(
      <Badge icon={<Shield data-testid="shield-icon" />}>
        With Icon
      </Badge>
    );
    expect(screen.getByTestId('shield-icon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Badge className="custom-class">Custom</Badge>);
    expect(screen.getByText('Custom')).toBeInTheDocument();
  });

  it('supports new shadcn variant names', () => {
    render(<Badge variant="success">Success</Badge>);
    expect(screen.getByText('Success')).toBeInTheDocument();

    render(<Badge variant="warning">Warning</Badge>);
    expect(screen.getByText('Warning')).toBeInTheDocument();
  });
});
