import React from 'react';

/**
 * BrandLogo - Uses official NG-LOGO-BLUE.png and NG-LOGO-WHITE.png assets.
 * - NG-LOGO-BLUE.png: Displayed on light backgrounds & light mode.
 * - NG-LOGO-WHITE.png: Displayed on dark backgrounds & dark mode (and forced white variants).
 * - showSubtitle: Appends "LEARN" pill badge.
 */
export default function BrandLogo({
  height = 44,
  variant = 'auto', // 'auto' | 'white' | 'blue' | 'teal'
  showSubtitle = true,
  subtitle = 'LEARN',
  className = '',
}) {
  const isWhite = variant === 'white';
  const isBlue = variant === 'blue' || variant === 'teal';

  return (
    <div
      className={`brand-logo-wrap ${isWhite ? 'is-white-forced' : ''} ${isBlue ? 'is-blue-forced' : ''} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        textDecoration: 'none',
        '--logo-height': `${height}px`,
      }}
    >
      {/* Blue Logo for Light Mode & Light surfaces */}
      <img
        src="/NG-LOGO-BLUE.png"
        alt="Nurturing Green"
        className={`brand-logo-img logo-blue ${isWhite ? 'hide-forced' : ''}`}
        style={{
          display: isWhite ? 'none' : undefined,
        }}
      />

      {/* White Logo for Dark Mode & Dark surfaces */}
      <img
        src="/NG-LOGO-WHITE.png"
        alt="Nurturing Green"
        className={`brand-logo-img logo-white ${isBlue ? 'hide-forced' : ''}`}
        style={{
          display: isBlue ? 'none' : (isWhite ? 'block' : undefined),
        }}
      />

      {showSubtitle && (
        <span className="brand-logo-badge">
          {subtitle}
        </span>
      )}
    </div>
  );
}
