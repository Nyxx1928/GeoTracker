import { useState, useCallback } from 'react';
import Map, { Marker, NavigationControl, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

// Free CARTO Voyager style — clean, modern, no API key needed
const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';

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

function StaticMap({ lat, lon }) {
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.05},${lat - 0.05},${lon + 0.05},${lat + 0.05}&layer=mapnik&marker=${lat},${lon}`;
  const osmLink = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=13/${lat}/${lon}`;

  return (
    <div className="w-full h-64 sm:h-80 rounded-xl overflow-hidden border border-gray-700 shadow-lg relative">
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
        className="absolute bottom-2 right-2 bg-white/90 text-blue-600 text-xs px-2 py-1 rounded shadow hover:bg-white transition-colors"
      >
        View larger ↗
      </a>
    </div>
  );
}

export default function GeoMap({ lat, lon }) {
  const [popupOpen, setPopupOpen] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [webglSupported] = useState(() => checkWebGL());

  const handleMarkerClick = useCallback(() => setPopupOpen(v => !v), []);
  const handleMapError = useCallback((e) => {
    console.error('Map error:', e);
    setMapError(true);
  }, []);

  if (!webglSupported || mapError) {
    return <StaticMap lat={lat} lon={lon} />;
  }

  return (
    <div className="w-full h-64 sm:h-80 rounded-xl overflow-hidden border border-gray-200 shadow-lg shadow-cyan-900/10">
      <Map
        initialViewState={{ longitude: lon, latitude: lat, zoom: 11 }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={MAP_STYLE}
        onError={handleMapError}
        attributionControl={false}
      >
        <NavigationControl position="top-right" />

        <Marker longitude={lon} latitude={lat} anchor="bottom" onClick={handleMarkerClick}>
          <div className="flex flex-col items-center cursor-pointer group">
            <div className="w-8 h-8 bg-cyan-500 rounded-full border-2 border-white shadow-lg shadow-cyan-500/50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <div className="w-2.5 h-2.5 bg-white rounded-full" />
            </div>
            <div className="w-0.5 h-3 bg-cyan-500" />
          </div>
        </Marker>

        {popupOpen && (
          <Popup
            longitude={lon}
            latitude={lat}
            anchor="top"
            offset={[0, -48]}
            onClose={() => setPopupOpen(false)}
            closeOnClick={false}
            className="rounded-lg"
          >
            <div className="px-1 py-0.5 text-xs font-mono text-gray-700">
              {lat.toFixed(4)}, {lon.toFixed(4)}
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
