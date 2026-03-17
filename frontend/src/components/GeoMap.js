import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function GeoMap({ lat, lon }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Destroy previous map instance before creating a new one
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    mapRef.current = new maplibregl.Map({
      container: containerRef.current,
      // Free CARTO dark matter tiles — no API key needed
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: [lon, lat],
      zoom: 10,
    });

    // Add navigation controls
    mapRef.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Add a marker at the location
    new maplibregl.Marker({ color: '#06b6d4' })
      .setLngLat([lon, lat])
      .addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lon]);

  return (
    <div
      ref={containerRef}
      className="w-full h-64 sm:h-80 rounded-xl overflow-hidden border border-gray-700 shadow-lg shadow-cyan-900/20"
    />
  );
}
