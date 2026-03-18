import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

function checkWebGL() {
  try {
    return maplibregl.supported({ failIfMajorPerformanceCaveat: false });
  } catch {
    return false;
  }
}

export default function GeoMap({ lat, lon }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [error, setError] = useState(null);
  const webglSupportedRef = useRef(checkWebGL());

  useEffect(() => {
    if (!webglSupportedRef.current || !containerRef.current) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    try {
      mapRef.current = new maplibregl.Map({
        container: containerRef.current,
        style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
        center: [lon, lat],
        zoom: 10,
      });

      mapRef.current.on('error', (e) => {
        console.error('Map error:', e);
        setError('Map failed to load.');
      });

      mapRef.current.addControl(new maplibregl.NavigationControl(), 'top-right');

      new maplibregl.Marker({ color: '#06b6d4' })
        .setLngLat([lon, lat])
        .addTo(mapRef.current);
    } catch (e) {
      console.error('Map init error:', e);
      setError('Map failed to initialize.');
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lon]);

  if (!webglSupportedRef.current || error) {
    return (
      <div className="w-full h-64 sm:h-80 rounded-xl border border-gray-700 flex flex-col items-center justify-center gap-2 text-gray-400 text-sm bg-gray-900">
        <span className="text-2xl">🗺️</span>
        <span>Map unavailable — WebGL not supported.</span>
        <a
          href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=13/${lat}/${lon}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 underline text-xs"
        >
          View on OpenStreetMap instead
        </a>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-64 sm:h-80 rounded-xl overflow-hidden border border-gray-700 shadow-lg shadow-cyan-900/20"
    />
  );
}
