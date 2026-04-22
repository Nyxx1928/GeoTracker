import React from 'react';
import RiskBadge from './RiskBadge';
import CopyButton from './CopyButton';
import GeoMap from './GeoMap';
import {
  countryCodeToFlag,
  timezoneToLocalTime,
  formatDateTime,
} from '../utils/formatters';

/**
 * ResultCard - Displays a complete lookup result with all enriched data.
 * 
 * This is the main display component for LinkGuard. It shows:
 * - Target and resolved IP
 * - Risk level badge
 * - Geographic location with map
 * - Network intelligence (ISP, org, ASN)
 * - Proxy/hosting/mobile flags
 * - Local time at target location
 * - Shareable public link (if available)
 * 
 * Teaching Point: This is a "container component" that composes multiple
 * smaller components (RiskBadge, CopyButton, GeoMap). This composition
 * pattern makes the UI modular and maintainable.
 */
const ResultCard = ({ result, showShareLink = true }) => {
  if (!result) {
    return null;
  }

  const { target, type, resolved_ip, geo, risk_level, uuid, created_at } = result;

  // Build the shareable public URL
  const shareUrl = uuid
    ? `${window.location.origin}/lookup/${uuid}`
    : null;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-white text-lg font-semibold mb-1">
              {target}
            </h3>
            <p className="text-blue-100 text-sm">
              Type: {type.toUpperCase()}
            </p>
          </div>
          <RiskBadge level={risk_level} />
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* IP Address Section */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            Resolved IP Address
          </h4>
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-mono text-gray-900">
              {resolved_ip}
            </span>
            <CopyButton text={resolved_ip} label="Copy IP" />
          </div>
        </div>

        {/* Location Section */}
        {geo && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              Location
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Location Details */}
              <div className="space-y-2">
                {geo.city && (
                  <div className="flex items-center">
                    <span className="text-gray-600 w-24">City:</span>
                    <span className="font-medium text-gray-900">{geo.city}</span>
                  </div>
                )}
                {geo.regionName && (
                  <div className="flex items-center">
                    <span className="text-gray-600 w-24">Region:</span>
                    <span className="font-medium text-gray-900">{geo.regionName}</span>
                  </div>
                )}
                {geo.country && (
                  <div className="flex items-center">
                    <span className="text-gray-600 w-24">Country:</span>
                    <span className="font-medium text-gray-900">
                      {geo.countryCode && (
                        <span className="mr-2">
                          {countryCodeToFlag(geo.countryCode)}
                        </span>
                      )}
                      {geo.country}
                    </span>
                  </div>
                )}
                {geo.zip && (
                  <div className="flex items-center">
                    <span className="text-gray-600 w-24">Postal:</span>
                    <span className="font-medium text-gray-900">{geo.zip}</span>
                  </div>
                )}
                {geo.timezone && (
                  <div className="flex items-center">
                    <span className="text-gray-600 w-24">Local Time:</span>
                    <span className="font-medium text-gray-900">
                      {timezoneToLocalTime(geo.timezone)}
                    </span>
                  </div>
                )}
              </div>

              {/* Map */}
              {geo.lat && geo.lon && (
                <div className="h-48 rounded-lg overflow-hidden border border-gray-200">
                  <GeoMap lat={geo.lat} lon={geo.lon} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Network Intelligence Section */}
        {geo && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              Network Intelligence
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {geo.isp && (
                <div>
                  <span className="text-gray-600 text-sm">ISP:</span>
                  <p className="font-medium text-gray-900">{geo.isp}</p>
                </div>
              )}
              {geo.org && (
                <div>
                  <span className="text-gray-600 text-sm">Organization:</span>
                  <p className="font-medium text-gray-900">{geo.org}</p>
                </div>
              )}
              {geo.as && (
                <div>
                  <span className="text-gray-600 text-sm">ASN:</span>
                  <p className="font-medium text-gray-900 font-mono text-sm">
                    {geo.as}
                  </p>
                </div>
              )}
            </div>

            {/* Network Flags */}
            <div className="mt-4 flex flex-wrap gap-2">
              {geo.proxy !== undefined && (
                <span
                  className={`
                    inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                    ${geo.proxy
                      ? 'bg-red-100 text-red-800 border border-red-300'
                      : 'bg-gray-100 text-gray-600 border border-gray-300'
                    }
                  `}
                >
                  {geo.proxy ? '⚠️ Proxy Detected' : '✓ No Proxy'}
                </span>
              )}
              {geo.hosting !== undefined && (
                <span
                  className={`
                    inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                    ${geo.hosting
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-gray-100 text-gray-600 border border-gray-300'
                    }
                  `}
                >
                  {geo.hosting ? '🖥️ Hosting Provider' : '✓ Not Hosting'}
                </span>
              )}
              {geo.mobile !== undefined && (
                <span
                  className={`
                    inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                    ${geo.mobile
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'bg-gray-100 text-gray-600 border border-gray-300'
                    }
                  `}
                >
                  {geo.mobile ? '📱 Mobile Connection' : '✓ Not Mobile'}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Timestamp */}
        {created_at && (
          <div className="mb-4 text-sm text-gray-500">
            Looked up {formatDateTime(created_at)}
          </div>
        )}

        {/* Share Link Section */}
        {showShareLink && shareUrl && (
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">
                  Share this lookup
                </h4>
                <p className="text-xs text-gray-500">
                  Anyone with this link can view the results
                </p>
              </div>
              <CopyButton text={shareUrl} label="Copy Link" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultCard;

