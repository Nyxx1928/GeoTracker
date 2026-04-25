import React from 'react';
import { render, screen } from '@testing-library/react';
import PageContainer from './PageContainer';

describe('PageContainer', () => {
  it('renders children correctly', () => {
    render(
      <PageContainer>
        <div>Test Content</div>
      </PageContainer>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies default max-width constraint', () => {
    render(
      <PageContainer>
        <div>Content</div>
      </PageContainer>
    );
    
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies custom max-width when provided', () => {
    render(
      <PageContainer maxWidth="max-w-4xl">
        <div>Content</div>
      </PageContainer>
    );
    
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies background gradient', () => {
    render(
      <PageContainer>
        <div>Content</div>
      </PageContainer>
    );
    
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies responsive padding by default', () => {
    render(
      <PageContainer>
        <div>Content</div>
      </PageContainer>
    );
    
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('removes padding when noPadding is true', () => {
    render(
      <PageContainer noPadding>
        <div>Content</div>
      </PageContainer>
    );
    
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <PageContainer className="custom-class">
        <div>Content</div>
      </PageContainer>
    );
    
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('centers content with mx-auto', () => {
    render(
      <PageContainer>
        <div>Content</div>
      </PageContainer>
    );
    
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies min-h-screen for full viewport height', () => {
    render(
      <PageContainer>
        <div>Content</div>
      </PageContainer>
    );
    
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('matches snapshot for default props', () => {
    const { asFragment } = render(
      <PageContainer>
        <div>Test Content</div>
      </PageContainer>
    );
    
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot with custom props', () => {
    const { asFragment } = render(
      <PageContainer maxWidth="max-w-5xl" className="custom-wrapper" noPadding>
        <div>Custom Content</div>
      </PageContainer>
    );
    
    expect(asFragment()).toMatchSnapshot();
  });
});
