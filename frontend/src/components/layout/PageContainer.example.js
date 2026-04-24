import React from 'react';
import PageContainer from './PageContainer';
import PageHeader from './PageHeader';

/**
 * Example usage of PageContainer component
 * 
 * This file demonstrates different ways to use PageContainer
 * for various page layouts and content types.
 */

// Example 1: Standard page with default settings
export const StandardPage = () => (
  <PageContainer>
    <PageHeader />
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Standard Page Layout</h2>
      <p className="text-gray-300">
        This uses the default max-width (max-w-7xl) and responsive padding.
        The content is centered and constrained for optimal readability.
      </p>
    </div>
  </PageContainer>
);

// Example 2: Narrow content page (blog post, article)
export const NarrowContentPage = () => (
  <PageContainer maxWidth="max-w-3xl">
    <h1 className="text-3xl font-bold text-white mb-4">Article Title</h1>
    <p className="text-gray-300 leading-relaxed">
      This page uses a narrower max-width (max-w-3xl) which is ideal for
      text-heavy content like blog posts or articles. The narrower width
      maintains optimal line length for reading.
    </p>
  </PageContainer>
);

// Example 3: Wide content page (dashboard, data tables)
export const WideContentPage = () => (
  <PageContainer maxWidth="max-w-full">
    <h2 className="text-2xl font-bold text-white mb-4">Dashboard</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Dashboard cards would go here */}
      <div className="bg-gray-800 p-4 rounded-lg">Card 1</div>
      <div className="bg-gray-800 p-4 rounded-lg">Card 2</div>
      <div className="bg-gray-800 p-4 rounded-lg">Card 3</div>
      <div className="bg-gray-800 p-4 rounded-lg">Card 4</div>
    </div>
  </PageContainer>
);

// Example 4: Full-width section within a page
export const MixedWidthPage = () => (
  <PageContainer>
    <h2 className="text-2xl font-bold text-white mb-6">Mixed Width Content</h2>
    
    {/* Constrained content */}
    <p className="text-gray-300 mb-8">
      This text is constrained by the PageContainer's max-width.
    </p>
    
    {/* Full-width section - break out of container */}
    <div className="-mx-4 sm:-mx-6 lg:-mx-8 mb-8">
      <div className="bg-gradient-to-r from-cyan-900 to-blue-900 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-xl font-bold text-white text-center">
            Full-Width Feature Section
          </h3>
        </div>
      </div>
    </div>
    
    {/* Back to constrained content */}
    <p className="text-gray-300">
      This text is back within the constrained width.
    </p>
  </PageContainer>
);

// Example 5: Custom styling with className
export const CustomStyledPage = () => (
  <PageContainer className="bg-opacity-50">
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Custom Styled Page</h2>
      <p className="text-gray-300">
        This page uses the className prop to add custom styling while
        maintaining the standard layout structure.
      </p>
    </div>
  </PageContainer>
);

// Example 6: No padding for full control
export const NoPaddingPage = () => (
  <PageContainer noPadding>
    {/* Full-width hero section */}
    <div className="bg-gradient-to-r from-cyan-600 to-blue-600 py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Hero Section</h1>
        <p className="text-xl text-cyan-100">
          Using noPadding gives you full control over spacing
        </p>
      </div>
    </div>
    
    {/* Content section with custom padding */}
    <div className="px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-4">Content Section</h2>
        <p className="text-gray-300">
          You can add your own padding and max-width constraints as needed.
        </p>
      </div>
    </div>
  </PageContainer>
);
