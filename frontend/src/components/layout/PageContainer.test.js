import React from 'react';
import { render } from '@testing-library/react';
import PageContainer from './PageContainer';

describe('PageContainer', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <PageContainer>
        <div>Test Content</div>
      </PageContainer>
    );
    
    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('applies default max-width constraint', () => {
    const { container } = render(
      <PageContainer>
        <div>Content</div>
      </PageContainer>
    );
    
    const innerDiv = container.querySelector('.max-w-7xl');
    expect(innerDiv).toBeInTheDocument();
  });

  it('applies custom max-width when provided', () => {
    const { container } = render(
      <PageContainer maxWidth="max-w-4xl">
        <div>Content</div>
      </PageContainer>
    );
    
    const innerDiv = container.querySelector('.max-w-4xl');
    expect(innerDiv).toBeInTheDocument();
  });

  it('applies background gradient', () => {
    const { container } = render(
      <PageContainer>
        <div>Content</div>
      </PageContainer>
    );
    
    const outerDiv = container.querySelector('.bg-gradient-to-br');
    expect(outerDiv).toBeInTheDocument();
    expect(outerDiv).toHaveClass('from-gray-900', 'via-gray-800', 'to-gray-900');
  });

  it('applies responsive padding by default', () => {
    const { container } = render(
      <PageContainer>
        <div>Content</div>
      </PageContainer>
    );
    
    const innerDiv = container.querySelector('.px-4');
    expect(innerDiv).toBeInTheDocument();
    expect(innerDiv).toHaveClass('sm:px-6', 'lg:px-8');
    expect(innerDiv).toHaveClass('py-6', 'sm:py-8', 'lg:py-12');
  });

  it('removes padding when noPadding is true', () => {
    const { container } = render(
      <PageContainer noPadding>
        <div>Content</div>
      </PageContainer>
    );
    
    const innerDiv = container.querySelector('.mx-auto');
    expect(innerDiv).not.toHaveClass('px-4');
    expect(innerDiv).not.toHaveClass('py-6');
  });

  it('applies custom className', () => {
    const { container } = render(
      <PageContainer className="custom-class">
        <div>Content</div>
      </PageContainer>
    );
    
    const innerDiv = container.querySelector('.custom-class');
    expect(innerDiv).toBeInTheDocument();
  });

  it('centers content with mx-auto', () => {
    const { container } = render(
      <PageContainer>
        <div>Content</div>
      </PageContainer>
    );
    
    const innerDiv = container.querySelector('.mx-auto');
    expect(innerDiv).toBeInTheDocument();
  });

  it('applies min-h-screen for full viewport height', () => {
    const { container } = render(
      <PageContainer>
        <div>Content</div>
      </PageContainer>
    );
    
    const outerDiv = container.querySelector('.min-h-screen');
    expect(outerDiv).toBeInTheDocument();
  });

  it('matches snapshot for default props', () => {
    const { container } = render(
      <PageContainer>
        <div>Test Content</div>
      </PageContainer>
    );
    
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot with custom props', () => {
    const { container } = render(
      <PageContainer maxWidth="max-w-5xl" className="custom-wrapper" noPadding>
        <div>Custom Content</div>
      </PageContainer>
    );
    
    expect(container).toMatchSnapshot();
  });
});
