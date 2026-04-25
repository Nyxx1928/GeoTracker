import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

const EducationalTooltip = ({
  children,
  content,
  learnMoreUrl = null,
  position = 'top',
  trigger = 'hover',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowStyles = {
    top: 'top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-900',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-neutral-900',
    left: 'left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-neutral-900',
    right: 'right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-neutral-900',
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsVisible(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsVisible(false);
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isVisible]);

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      setIsVisible(false);
    }
  };

  const handleClick = () => {
    if (trigger === 'click') {
      setIsVisible(!isVisible);
    }
  };

  const handleFocus = () => {
    setIsVisible(true);
  };

  const handleBlur = () => {
    if (trigger === 'hover') {
      setIsVisible(false);
    }
  };

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        tabIndex={0}
        role="button"
        aria-describedby={isVisible ? 'tooltip' : undefined}
        className="inline-flex items-center cursor-help"
      >
        {children}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          id="tooltip"
          role="tooltip"
          className={clsx(
            'absolute z-50 w-64 px-4 py-3 bg-neutral-900 text-white text-sm rounded-lg shadow-xl',
            'transition-opacity duration-200',
            positionStyles[position]
          )}
        >
          <div className="space-y-2">
            <p className="leading-relaxed">{content}</p>
            
            {learnMoreUrl && (
              <a
                href={learnMoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-brand-300 hover:text-brand-200 font-medium transition-smooth"
                onClick={(e) => e.stopPropagation()}
              >
                Learn More
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

          {/* Tooltip Arrow */}
          <div className={clsx('absolute', arrowStyles[position])} />
        </div>
      )}
    </div>
  );
};

export default EducationalTooltip;
