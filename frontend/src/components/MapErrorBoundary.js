import React from 'react';

function StaticMapFallback({ lat, lon }) {
  if (lat == null || lon == null) {
    return (
      <div className="w-full h-64 sm:h-80 rounded-xl border border-gray-700 flex flex-col items-center justify-center gap-2 text-gray-300 text-sm bg-gray-900 p-4">
        <span className="text-2xl">🗺️</span>
        <span>Map failed to render in this browser.</span>
        <span className="text-xs text-gray-400 text-center">Location details are still available above.</span>
      </div>
    );
  }

  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.05},${lat - 0.05},${lon + 0.05},${lat + 0.05}&layer=mapnik&marker=${lat},${lon}`;
  const osmLink = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=13/${lat}/${lon}`;

  return (
    <div className="w-full h-64 sm:h-80 rounded-xl overflow-hidden border border-gray-700 shadow-lg shadow-cyan-900/20 relative">
      <iframe
        title="Location map"
        src={osmUrl}
        width="100%"
        height="100%"
        style={{ border: 0, display: 'block' }}
        loading="lazy"
        referrerPolicy="no-referrer"
        sandbox="allow-scripts allow-same-origin"
      />
      <a
        href={osmLink}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-2 right-2 bg-gray-900/80 text-cyan-400 text-xs px-2 py-1 rounded hover:bg-gray-800 transition-colors"
      >
        View larger map ↗
      </a>
    </div>
  );
}

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
      const { lat, lon } = this.props;
      return <StaticMapFallback lat={lat} lon={lon} />;
    }

    return this.props.children;
  }
}
