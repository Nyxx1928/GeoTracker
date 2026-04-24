import React, { useState } from 'react';
import clsx from 'clsx';
import { Card } from './ui';

const TransparencyPanel = ({ className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const dataSources = [
    {
      name: 'IP-API',
      url: 'https://ip-api.com',
      description: 'Geolocation and network intelligence',
    },
    {
      name: 'DNS Resolution',
      description: 'Standard DNS queries for domain resolution',
    },
  ];

  const analysisSteps = [
    {
      step: 1,
      title: 'Domain Resolution',
      description: 'We resolve the domain or URL to its IP address using standard DNS queries.',
    },
    {
      step: 2,
      title: 'Geolocation Lookup',
      description: 'We query geolocation databases to determine the physical location of the IP address.',
    },
    {
      step: 3,
      title: 'Network Analysis',
      description: 'We analyze network characteristics including ISP, hosting provider, and proxy detection.',
    },
    {
      step: 4,
      title: 'Risk Assessment',
      description: 'We calculate a risk score based on proxy detection, hosting flags, and network patterns.',
    },
  ];

  const limitations = [
    'Geolocation data is approximate and may not reflect the exact physical location.',
    'VPNs and proxies can mask the true origin of connections.',
    'Risk assessments are based on network characteristics and should not be the sole factor in security decisions.',
    'Data accuracy depends on third-party providers and may vary.',
  ];

  return (
    <Card variant="outlined" padding="md" className={clsx('border-2', className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-brand-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">
              How We Analyze Links
            </h3>
            <p className="text-sm text-neutral-600">
              Learn about our methodology and data sources
            </p>
          </div>
        </div>
        <svg
          className={clsx(
            'w-6 h-6 text-neutral-600 transition-transform',
            isExpanded && 'rotate-180'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isExpanded && (
        <div className="mt-6 space-y-6">
          {/* Analysis Steps */}
          <div>
            <h4 className="text-base font-semibold text-neutral-900 mb-4">
              Our Analysis Process
            </h4>
            <div className="space-y-4">
              {analysisSteps.map((item) => (
                <div key={item.step} className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm font-semibold">
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-neutral-900 mb-1">
                      {item.title}
                    </h5>
                    <p className="text-sm text-neutral-600">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Data Sources */}
          <div className="pt-6 border-t border-neutral-200">
            <h4 className="text-base font-semibold text-neutral-900 mb-4">
              Data Sources
            </h4>
            <div className="space-y-3">
              {dataSources.map((source, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between p-3 bg-neutral-50 rounded-lg"
                >
                  <div className="flex-1">
                    <h5 className="font-medium text-neutral-900">
                      {source.name}
                    </h5>
                    <p className="text-sm text-neutral-600 mt-1">
                      {source.description}
                    </p>
                  </div>
                  {source.url && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 text-brand-600 hover:text-brand-700 text-sm font-medium flex items-center"
                      aria-label={`Visit ${source.name} website`}
                    >
                      Visit
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Limitations */}
          <div className="pt-6 border-t border-neutral-200">
            <h4 className="text-base font-semibold text-neutral-900 mb-4">
              Limitations & Disclaimers
            </h4>
            <ul className="space-y-2">
              {limitations.map((limitation, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm text-neutral-600">
                  <svg
                    className="w-5 h-5 text-neutral-400 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span>{limitation}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Last Updated */}
          <div className="pt-6 border-t border-neutral-200 text-xs text-neutral-500">
            Last updated: April 2026
          </div>
        </div>
      )}
    </Card>
  );
};

export default TransparencyPanel;
