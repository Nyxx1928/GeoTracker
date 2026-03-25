import { useEffect, useRef, useState } from 'react';

function checkWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

// Fallback: static OpenStreetMap tile-based map using an iframe
function StaticMap({ lat, lon }) {
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

export default function GeoMap({ lat, lon }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [error, setError] = useState(null);
  const [webglSupported] = useState(() => checkWebGL());

  useEffect(() => {
    if (!webglSupported) return;

    let map = null;

    async function initMap() {
      try {
        const maplibregl = (await import('maplibre-gl')).default;
        await import('maplibre-gl/dist/maplibre-gl.css');

        if (!maplibregl.supported({ failIfMajorPerformanceCaveat: false })) {
          setError('webgl-unsupported');
          return;
        }

        if (!containerRef.current) return;

        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }

        map = new maplibregl.Map({
          container: containerRef.current,
          style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
          center: [lon, lat],
          zoom: 10,
        });

        map.on('error', (e) => {
          console.error('Map error:', e);
          setError('load-failed');
        });

        map.addControl(new maplibregl.NavigationControl(), 'top-right');

        new maplibregl.Marker({ color: '#06b6d4' })
          .setLngLat([lon, lat])
          .addTo(map);

        mapRef.current = map;
      } catch (e) {
        console.error('Map init error:', e);
        setError('init-failed');
      }
    }

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lon, webglSupported]);

  // Use static OSM iframe fallback when WebGL is unavailable or map errors out
  if (!webglSupported || error) {
    return <StaticMap lat={lat} lon={lon} />;
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-64 sm:h-80 rounded-xl overflow-hidden border border-gray-700 shadow-lg shadow-cyan-900/20"
    />
  );
}
