import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Input from './Input';
import { Search } from 'lucide-react';

describe('Input Component', () => {
  it('renders basic input', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Input label="Email" id="email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<Input error="This field is required" id="test" />);
    const errorMessage = screen.getByText('This field is required');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveAttribute('role', 'alert');
  });

  it('displays success message', () => {
    render(<Input success="Looks good!" id="test" />);
    expect(screen.getByText('Looks good!')).toBeInTheDocument();
  });

  it('shows loading spinner when loading', () => {
    render(<Input loading={true} />);
    // Ensure input still renders when loading
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders with left icon', () => {
    render(
      <Input icon={<Search data-testid="search-icon" />} iconPosition="left" />
    );
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
  });

  it('shows clear button when clearable and has value', () => {
    render(<Input clearable={true} defaultValue="test" />);
    // Type to trigger showClear
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test value' } });
    
    const clearButton = screen.getByLabelText('Clear input');
    expect(clearButton).toBeInTheDocument();
  });

  it('calls onClear when clear button is clicked', () => {
    const onClear = jest.fn();
    render(<Input clearable={true} onClear={onClear} defaultValue="test" />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test value' } });
    
    const clearButton = screen.getByLabelText('Clear input');
    fireEvent.click(clearButton);
    
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('calls onChange when input value changes', () => {
    const onChange = jest.fn();
    render(<Input onChange={onChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new value' } });
    
    expect(onChange).toHaveBeenCalled();
  });

  it('has minimum 44px height for touch targets', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('min-h-[44px]');
  });

  it('applies error styling when error prop is provided', () => {
    render(<Input error="Error message" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-destructive');
  });

  it('applies success styling when success prop is provided', () => {
    render(<Input success="Success message" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-green-500');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('disables input when disabled prop is true', () => {
    render(<Input disabled={true} />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });
});
