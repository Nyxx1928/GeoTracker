import React from 'react';
import StaticMap from './StaticMap';

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

  componentDidUpdate(prevProps) {
    const resetKeyChanged = this.props.resetKey !== prevProps.resetKey;
    const coordsChanged = this.props.lat !== prevProps.lat || this.props.lon !== prevProps.lon;

    if (this.state.hasError && (resetKeyChanged || coordsChanged)) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      const { lat, lon } = this.props;
      return (
        <StaticMap
          lat={lat}
          lon={lon}
          containerClassName="w-full h-64 sm:h-80 rounded-xl overflow-hidden border border-gray-700 shadow-lg shadow-cyan-900/20 relative"
          emptyClassName="w-full h-64 sm:h-80 rounded-xl border border-gray-700 flex flex-col items-center justify-center gap-2 text-gray-300 text-sm bg-gray-900 p-4"
          linkClassName="absolute bottom-2 right-2 bg-gray-900/80 text-cyan-400 text-xs px-2 py-1 rounded hover:bg-gray-800 transition-colors"
        />
      );
    }

    return this.props.children;
  }
}
