import { useState, useCallback, useEffect } from 'react';
import Map, { Marker, NavigationControl, Popup } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import StaticMap from './StaticMap';

// Free CARTO Voyager style - clean, modern, no API key needed
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

export default function GeoMap({ lat, lon }) {
  const [popupOpen, setPopupOpen] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [webglSupported] = useState(() => checkWebGL());
  const [mapInstanceKey, setMapInstanceKey] = useState(0);

  const handleMarkerClick = useCallback(() => setPopupOpen((open) => !open), []);
  const handleMapError = useCallback((e) => {
    console.error('Map error:', e);
    setMapError(true);
  }, []);
  const handleRetryMap = useCallback(() => {
    setMapError(false);
    setPopupOpen(false);
    setMapInstanceKey((key) => key + 1);
  }, []);

  useEffect(() => {
    // Reset transient map and popup state when the selected coordinates change.
    setMapError(false);
    setPopupOpen(false);
    setMapInstanceKey((key) => key + 1);
  }, [lat, lon]);

  if (!webglSupported) {
    return <StaticMap lat={lat} lon={lon} />;
  }

  if (mapError) {
    return <StaticMap lat={lat} lon={lon} showRetry onRetry={handleRetryMap} />;
  }

  return (
    <div className="w-full h-64 sm:h-80 rounded-xl overflow-hidden border border-gray-200 shadow-lg shadow-cyan-900/10">
      <Map
        key={mapInstanceKey}
        initialViewState={{ longitude: lon, latitude: lat, zoom: 11 }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={MAP_STYLE}
        onError={handleMapError}
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
