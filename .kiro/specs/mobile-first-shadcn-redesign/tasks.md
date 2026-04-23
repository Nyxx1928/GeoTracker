# Implementation Plan: Mobile-First shadcn/ui Redesign

## Overview

This implementation plan breaks down the mobile-first shadcn/ui redesign into actionable coding tasks. The approach follows a phased strategy: foundation setup, core component refactoring, mobile-first layouts, typography and forms, accessibility testing, performance optimization, and documentation. Each task builds incrementally to ensure the application remains functional throughout the migration.

## Tasks

- [ ] 1. Foundation Setup - Install and configure shadcn/ui infrastructure
  - [-] 1.1 Install shadcn/ui dependencies and configure project
    - Install @radix-ui primitives, class-variance-authority, tailwind-merge, and lucide-react
    - Create components.json configuration file with project paths and settings
    - Create jsconfig.json with path aliases (@/* mapping to ./src/*)
    - _Requirements: 1.1, 1.2, 1.3, 1.5_

  - [~] 1.2 Create utility functions and dark mode infrastructure
    - Create src/lib/utils.js with cn() helper function using clsx and tailwind-merge
    - Configure Tailwind dark mode with class-based strategy in tailwind.config.js
    - Add CSS variables for theme colors in src/index.css
    - _Requirements: 1.2, 11.1, 11.6_

  - [~] 1.3 Install core shadcn/ui components
    - Run shadcn-ui CLI to add button, card, input, badge components
    - Run shadcn-ui CLI to add dialog, dropdown-menu, sheet, tooltip components
    - Run shadcn-ui CLI to add separator and skeleton components
    - _Requirements: 1.4_

- [ ] 2. Core Component Refactoring - Migrate Button, Card, Input, Badge to shadcn/ui
  - [~] 2.1 Refactor Button component with shadcn/ui primitives
    - Update src/components/ui/Button.js to use shadcn button base
    - Add loading, icon, and iconPosition props to shadcn button
    - Map existing variant props (primary→default, danger→destructive) for backward compatibility
    - Replace emoji icons with lucide-react icons in all button usages
    - _Requirements: 4.1, 4.6, 2.4_

  - [ ]* 2.2 Write unit tests for refactored Button component
    - Test all button variants render correctly
    - Test loading state displays spinner
    - Test icon positioning (left/right)
    - Test backward compatibility with old prop names
    - _Requirements: 4.1, 4.7_

  - [~] 2.3 Refactor Card component with shadcn/ui composition pattern
    - Update src/components/ui/Card.js to use shadcn Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
    - Implement variant system (default, elevated, outlined, glass) using class-variance-authority
    - Add padding prop support (none, sm, md, lg)
    - Maintain backward compatibility with existing Card usage
    - _Requirements: 4.2, 4.6, 4.7_

  - [ ]* 2.4 Write unit tests for refactored Card component
    - Test all card variants render correctly
    - Test composition components (CardHeader, CardContent, CardFooter)
    - Test padding variations
    - Test backward compatibility
    - _Requirements: 4.2, 4.7_

  - [~] 2.5 Refactor Input component with shadcn/ui primitives
    - Update src/components/ui/Input.js to use shadcn input base
    - Add label, error, success, loading, icon, iconPosition props
    - Implement clearable functionality with onClear callback
    - Ensure minimum 44px height for touch targets
    - _Requirements: 4.3, 4.6, 3.5, 7.1_

  - [ ]* 2.6 Write unit tests for refactored Input component
    - Test label and error message display
    - Test icon positioning
    - Test clearable functionality
    - Test touch target size (44px minimum)
    - _Requirements: 4.3, 4.7, 7.1_

  - [~] 2.7 Refactor Badge component with shadcn/ui primitives
    - Update src/components/ui/Badge.js to use shadcn badge base
    - Map existing variants (safe→success, caution→warning, danger→destructive)
    - Add size prop support (sm, md, lg)
    - Add icon prop support with lucide-react icons
    - _Requirements: 4.4, 4.6, 2.5_

  - [ ]* 2.8 Write unit tests for refactored Badge component
    - Test all badge variants render correctly
    - Test size variations
    - Test icon rendering
    - Test backward compatibility with old variant names
    - _Requirements: 4.4, 4.7_

- [~] 3. Checkpoint - Ensure all component tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Icon System Migration - Replace all emoji usage with lucide-react SVG icons
  - [~] 4.1 Replace emojis in Landing page components
    - Replace 🔍 with Search icon in hero section and search input
    - Replace ⚡ with Zap icon in performance feature
    - Replace 🔒 with Shield icon in security feature
    - Replace 📍 with MapPin icon in location feature
    - Replace 💾 with Save icon in CTA section
    - _Requirements: 2.2, 2.7_

  - [~] 4.2 Replace emojis in Home page components
    - Replace 🔍 with Search icon in search functionality
    - Replace 📋 with List icon in bulk lookup feature
    - Replace 🗑️ with Trash2 icon in delete buttons
    - Replace 📍 with MapPin icon in geo display
    - Replace 📜 with History icon in history list
    - _Requirements: 2.3, 2.7_

  - [~] 4.3 Replace emojis in utility components
    - Replace ⚠️ with AlertTriangle icon in error states
    - Replace ℹ️ with Info icon in tooltips and info displays
    - Replace ✓ with Check icon in success states
    - Replace ✕ with X icon in close buttons
    - Update RiskBadge, RiskDisplay, EducationalTooltip, TransparencyPanel, LoadingState components
    - _Requirements: 2.5, 2.6, 2.7_

  - [ ]* 4.4 Write integration tests for icon replacements
    - Test that no emoji characters appear in rendered output
    - Test that all icons render with proper aria-labels
    - Test icon sizing and alignment consistency
    - _Requirements: 2.7, 10.2_

- [ ] 5. Mobile Navigation Implementation - Create responsive navigation with Sheet component
  - [~] 5.1 Create MobileNav component with shadcn Sheet
    - Create src/components/layout/MobileNav.js using Sheet, SheetContent, SheetTrigger
    - Add hamburger menu icon (Menu from lucide-react)
    - Implement slide-out drawer with navigation links
    - Ensure touch-friendly link spacing (minimum 44px height)
    - Add smooth animations and backdrop overlay
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [~] 5.2 Update PageHeader for responsive navigation
    - Show MobileNav component when viewport < 640px
    - Show horizontal navigation when viewport >= 640px
    - Implement responsive breakpoint logic with Tailwind classes
    - Maintain navigation state during orientation changes
    - _Requirements: 5.1, 5.5, 5.6_

  - [ ]* 5.3 Write integration tests for mobile navigation
    - Test hamburger menu appears on mobile viewports
    - Test drawer opens and closes correctly
    - Test navigation links are accessible
    - Test horizontal nav appears on desktop viewports
    - _Requirements: 5.1, 5.2, 5.5_

- [~] 6. Checkpoint - Ensure navigation works across breakpoints
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Responsive Layout Refactoring - Implement mobile-first layouts for all pages
  - [~] 7.1 Refactor Landing page with mobile-first layouts
    - Implement single-column layout for mobile (< 640px)
    - Implement two-column layout for tablet (640px-1023px)
    - Implement multi-column layout for desktop (>= 1024px)
    - Ensure cards and panels stack vertically on mobile
    - Use CSS Grid for responsive behavior
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 8.1, 8.2, 8.3, 8.4, 8.5_

  - [~] 7.2 Refactor Home page with mobile-first layouts
    - Apply single-column layout for mobile screens
    - Apply two-column layout for tablet screens
    - Apply multi-column layout for desktop screens
    - Ensure search form and results are mobile-optimized
    - Maintain consistent spacing using Tailwind spacing scale
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 8.1, 8.2, 8.3, 8.6_

  - [~] 7.3 Update PageContainer for responsive behavior
    - Implement flexible container widths with max-width constraints
    - Add responsive padding (mobile: 16px, tablet: 24px, desktop: 32px)
    - Ensure proper content centering at all breakpoints
    - _Requirements: 3.6, 8.6_

  - [ ]* 7.4 Write visual regression tests for responsive layouts
    - Test layouts at mobile (375px), tablet (768px), desktop (1440px) widths
    - Capture snapshots for all major pages
    - Test orientation changes (portrait/landscape)
    - _Requirements: 3.7, 8.1, 8.2, 8.3_

- [ ] 8. Typography and Form Optimization - Implement fluid typography and touch-optimized forms
  - [~] 8.1 Implement responsive typography system
    - Configure fluid typography scale in tailwind.config.js
    - Set base font size to 16px for mobile devices
    - Ensure minimum text size of 14px for body content
    - Apply appropriate line-height ratios (1.5 for body, 1.2 for headings)
    - Limit line length to 65-75 characters for readability
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [~] 8.2 Optimize form inputs for touch interaction
    - Ensure all form inputs have minimum 44px height
    - Add adequate spacing between form elements (minimum 8px)
    - Use appropriate input types (email, url, tel) for mobile keyboards
    - Implement clear focus states for keyboard navigation
    - Add inline validation feedback without requiring scrolling
    - Ensure form labels are clearly associated with inputs
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

  - [ ]* 8.3 Write accessibility tests for typography and forms
    - Test color contrast ratios (4.5:1 for normal text, 3:1 for large text)
    - Test keyboard navigation through forms
    - Test screen reader compatibility with form labels
    - Test focus management in form fields
    - _Requirements: 6.6, 7.4, 10.1, 10.6_

- [ ] 9. Dark Mode Implementation - Add theme toggle and dark mode support
  - [~] 9.1 Create ThemeToggle component
    - Create src/components/ui/ThemeToggle.js with Moon/Sun icons from lucide-react
    - Implement theme state management with localStorage persistence
    - Toggle dark class on document.documentElement
    - Add smooth transition animations
    - _Requirements: 11.2, 11.3_

  - [~] 9.2 Integrate dark mode across all components
    - Ensure all shadcn/ui components support dark mode
    - Test dark mode variants for Button, Card, Input, Badge
    - Verify color contrast ratios in dark mode
    - Test dark mode on all pages (Landing, Home, History)
    - _Requirements: 11.1, 11.4, 11.5_

  - [ ]* 9.3 Write tests for dark mode functionality
    - Test theme toggle switches between light and dark modes
    - Test localStorage persistence of theme preference
    - Test WCAG contrast ratios in both modes
    - _Requirements: 11.2, 11.5_

- [~] 10. Checkpoint - Ensure dark mode works correctly
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Accessibility Compliance - Ensure WCAG 2.1 Level AA compliance
  - [~] 11.1 Add ARIA labels and semantic HTML
    - Add aria-label to all icon-only buttons
    - Use semantic HTML elements (nav, main, article, section)
    - Ensure proper heading hierarchy (h1, h2, h3)
    - Add aria-live regions for dynamic content updates
    - _Requirements: 10.2, 10.5, 10.6_

  - [~] 11.2 Implement focus management
    - Ensure all interactive elements are keyboard accessible
    - Implement focus trapping in modal dialogs and drawers
    - Add visible focus indicators with proper contrast
    - Test tab order follows logical reading order
    - _Requirements: 10.1, 10.3_

  - [~] 11.3 Ensure color is not the only information conveyor
    - Add text labels or icons alongside color-coded elements
    - Ensure error states have text descriptions, not just red color
    - Add patterns or textures to distinguish elements beyond color
    - _Requirements: 10.4_

  - [ ]* 11.4 Write accessibility tests with jest-axe
    - Test all components for accessibility violations
    - Test keyboard navigation through all interactive elements
    - Test screen reader compatibility with NVDA or JAWS
    - Test focus management in modals and drawers
    - _Requirements: 10.1, 10.2, 10.3, 10.6, 10.7_

- [ ] 12. Performance Optimization - Optimize bundle size and loading performance
  - [~] 12.1 Implement lazy loading for components
    - Use React.lazy() for route-level code splitting
    - Lazy load shadcn/ui components not immediately visible
    - Implement skeleton loading states for async content
    - _Requirements: 9.1, 9.5_

  - [~] 12.2 Optimize icon imports and CSS bundle
    - Configure tree-shaking for lucide-react icons (import only used icons)
    - Purge unused Tailwind classes in production build
    - Optimize icon SVG sizes and remove unnecessary attributes
    - _Requirements: 9.2, 9.3_

  - [~] 12.3 Implement responsive image optimization
    - Use responsive images with srcset for different viewports
    - Add lazy loading to images below the fold
    - Optimize image formats (WebP with fallbacks)
    - _Requirements: 9.4_

  - [ ]* 12.4 Run Lighthouse performance audits
    - Test mobile performance score (target > 80)
    - Measure First Contentful Paint (target < 1.5s on 3G)
    - Measure Time to Interactive (target < 3.5s on 3G)
    - Measure bundle size (target < 200KB gzipped)
    - _Requirements: 9.6_

- [ ] 13. Component Documentation - Document refactored components and patterns
  - [~] 13.1 Add JSDoc comments to all refactored components
    - Document Button, Card, Input, Badge components with JSDoc
    - Document MobileNav and ThemeToggle components
    - Document all component props, types, and usage examples
    - _Requirements: 12.1_

  - [~] 13.2 Create component usage documentation
    - Document responsive behavior patterns and breakpoints
    - Create icon replacement mapping reference (emoji → SVG)
    - Document accessibility features and keyboard interactions
    - Create component showcase page for visual reference
    - _Requirements: 12.2, 12.3, 12.4, 12.5, 12.6_

- [ ] 14. Final Integration and Testing - Wire everything together and validate
  - [~] 14.1 Integration testing across all pages
    - Test complete user flows (search, navigation, history) with new components
    - Test responsive behavior at all breakpoints (mobile, tablet, desktop)
    - Test dark mode across all pages and components
    - Test accessibility with keyboard navigation and screen readers
    - _Requirements: 4.7, 3.7, 11.1, 10.7_

  - [ ]* 14.2 Write end-to-end integration tests
    - Test search flow from Landing to Home with results
    - Test mobile navigation drawer functionality
    - Test form submission with new Input components
    - Test theme toggle persistence across page navigation
    - _Requirements: 4.7, 5.2, 7.5, 11.2_

- [~] 15. Final checkpoint - Ensure all tests pass and application is production-ready
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- The migration maintains backward compatibility to minimize disruption
- All icon replacements maintain semantic meaning and visual clarity
- Focus on mobile-first approach: design for mobile, then enhance for larger screens
- Leverage shadcn/ui and Radix UI for accessibility compliance out of the box
- Performance targets: Lighthouse mobile score > 80, bundle < 200KB gzipped
