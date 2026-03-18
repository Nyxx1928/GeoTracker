import React from 'react';

export default class MapErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('Map boundary error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-64 sm:h-80 rounded-xl border border-gray-700 flex flex-col items-center justify-center gap-2 text-gray-300 text-sm bg-gray-900 p-4">
          <span className="text-2xl">🗺️</span>
          <span>Map failed to render in this browser.</span>
          <span className="text-xs text-gray-400 text-center">Location details are still available above.</span>
        </div>
      );
    }

    return this.props.children;
  }
}
