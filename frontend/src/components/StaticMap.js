function buildOsmData(lat, lon) {
  const latNum = Number(lat);
  const lonNum = Number(lon);
  const bbox = `${lonNum - 0.05},${latNum - 0.05},${lonNum + 0.05},${latNum + 0.05}`;

  return {
    iframeUrl: `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latNum},${lonNum}`,
    linkUrl: `https://www.openstreetmap.org/?mlat=${latNum}&mlon=${lonNum}#map=13/${latNum}/${lonNum}`
  };
}

export default function StaticMap({
  lat,
  lon,
  linkLabel = 'View larger map ->',
  containerClassName = 'w-full h-64 sm:h-80 rounded-xl overflow-hidden border border-gray-700 shadow-lg relative',
  emptyClassName = 'w-full h-64 sm:h-80 rounded-xl border border-gray-700 flex flex-col items-center justify-center gap-2 text-gray-300 text-sm bg-gray-900 p-4',
  linkClassName = 'absolute bottom-2 right-2 bg-white/90 text-blue-600 text-xs px-2 py-1 rounded shadow hover:bg-white transition-colors',
  showRetry = false,
  onRetry
}) {
  if (lat == null || lon == null) {
    return (
      <div className={emptyClassName}>
        <span>Map failed to render in this browser.</span>
        <span className="text-xs text-gray-400 text-center">Location details are still available above.</span>
      </div>
    );
  }

  const { iframeUrl, linkUrl } = buildOsmData(lat, lon);

  return (
    <div className={containerClassName}>
      <iframe
        title="Location map"
        src={iframeUrl}
        width="100%"
        height="100%"
        style={{ border: 0, display: 'block' }}
        loading="lazy"
        referrerPolicy="no-referrer"
        sandbox="allow-scripts allow-same-origin"
      />
      {showRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="absolute top-2 left-2 bg-gray-900/80 text-white text-xs px-2 py-1 rounded border border-white/20 hover:bg-gray-800 transition-colors"
        >
          Retry interactive map
        </button>
      )}
      <a
        href={linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClassName}
      >
        {linkLabel}
      </a>
    </div>
  );
}
