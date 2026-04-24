import React from 'react';
import { render, screen } from '@testing-library/react';
import Badge from './Badge';
import { Shield, AlertTriangle } from 'lucide-react';

describe('Badge Component', () => {
  it('renders children correctly', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('applies default variant when no variant specified', () => {
    const { container } = render(<Badge>Default</Badge>);
    expect(container.firstChild).toHaveClass('bg-secondary');
  });

  it('maps old variant names to new shadcn variants', () => {
    const { container: safeContainer } = render(<Badge variant="safe">Safe</Badge>);
    expect(safeContainer.firstChild).toHaveClass('bg-green-100');

    const { container: cautionContainer } = render(<Badge variant="caution">Caution</Badge>);
    expect(cautionContainer.firstChild).toHaveClass('bg-yellow-100');

    const { container: dangerContainer } = render(<Badge variant="danger">Danger</Badge>);
    expect(dangerContainer.firstChild).toHaveClass('bg-destructive');
  });

  it('supports size prop', () => {
    const { container: smContainer } = render(<Badge size="sm">Small</Badge>);
    expect(smContainer.firstChild).toHaveClass('text-xs', 'px-2');

    const { container: lgContainer } = render(<Badge size="lg">Large</Badge>);
    expect(lgContainer.firstChild).toHaveClass('text-sm', 'px-3');
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
    const { container } = render(<Badge className="custom-class">Custom</Badge>);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('supports new shadcn variant names', () => {
    const { container: successContainer } = render(<Badge variant="success">Success</Badge>);
    expect(successContainer.firstChild).toHaveClass('bg-green-100');

    const { container: warningContainer } = render(<Badge variant="warning">Warning</Badge>);
    expect(warningContainer.firstChild).toHaveClass('bg-yellow-100');
  });
});
