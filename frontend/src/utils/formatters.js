/**
 * Utility functions for formatting data in the LinkGuard UI.
 * 
 * These pure functions transform raw data into user-friendly formats:
 * - Country codes → Flag emojis
 * - Timezones → Local times
 * - Timestamps → Relative times ("2 hours ago")
 * 
 * Teaching Point: These are "pure functions" - they always return the same
 * output for the same input, with no side effects. This makes them easy to
 * test and reason about.
 */

/**
 * Convert ISO 3166-1 alpha-2 country code to flag emoji.
 * 
 * How it works:
 * 1. Each letter in the country code (e.g., "US") is converted to a
 *    Unicode Regional Indicator Symbol
 * 2. These symbols combine to form the flag emoji
 * 
 * Example: "US" → 🇺🇸
 * - U (0x55) → 🇺 (0x1F1FA)
 * - S (0x53) → 🇸 (0x1F1F8)
 * 
 * Teaching Point: This is a clever Unicode trick! Regional Indicator Symbols
 * (U+1F1E6 to U+1F1FF) represent letters A-Z. When two are placed together,
 * they form a flag emoji for that country code.
 * 
 * @param {string} countryCode - ISO 3166-1 alpha-2 code (e.g., "US", "GB", "JP")
 * @returns {string} Flag emoji or empty string if invalid
 */
export const countryCodeToFlag = (countryCode) => {
  if (!countryCode || typeof countryCode !== 'string' || countryCode.length !== 2) {
    return '';
  }

  // Convert to uppercase to handle lowercase input
  const code = countryCode.toUpperCase();

  // Regional Indicator Symbol Letter A starts at 0x1F1E6
  // We add the offset from 'A' (0x41) to get the correct symbol
  const REGIONAL_INDICATOR_A = 0x1F1E6;
  const LETTER_A = 0x41;

  // Convert each letter to its Regional Indicator Symbol
  const codePoints = [...code].map(
    (char) => REGIONAL_INDICATOR_A + (char.charCodeAt(0) - LETTER_A)
  );

  // Combine the code points into a string (the flag emoji)
  return String.fromCodePoint(...codePoints);
};

/**
 * Calculate the current local time at a given timezone.
 * 
 * Uses the Intl.DateTimeFormat API to convert the current time to the
 * target timezone. This is more reliable than manual offset calculations
 * because it handles daylight saving time automatically.
 * 
 * Teaching Point: The Intl API is built into modern browsers and provides
 * robust internationalization features. It's much better than trying to
 * handle timezones manually (which is notoriously error-prone).
 * 
 * @param {string} timezone - IANA timezone identifier (e.g., "America/Los_Angeles")
 * @returns {string} Formatted local time (e.g., "3:45 PM") or error message
 */
export const timezoneToLocalTime = (timezone) => {
  if (!timezone || typeof timezone !== 'string') {
    return 'Unknown';
  }

  try {
    // Create a formatter for the target timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    // Format the current time in that timezone
    return formatter.format(new Date());
  } catch (error) {
    // Invalid timezone identifier
    console.error(`Invalid timezone: ${timezone}`, error);
    return 'Unknown';
  }
};

/**
 * Convert a timestamp to a relative time string.
 * 
 * Examples:
 * - "just now" (< 1 minute ago)
 * - "5 minutes ago"
 * - "2 hours ago"
 * - "3 days ago"
 * - "2 weeks ago"
 * - "1 month ago"
 * - "1 year ago"
 * 
 * Teaching Point: This uses the Intl.RelativeTimeFormat API, which handles
 * pluralization automatically ("1 hour ago" vs "2 hours ago"). It also
 * respects the user's locale for internationalization.
 * 
 * @param {string|Date} timestamp - ISO 8601 timestamp or Date object
 * @returns {string} Relative time string
 */
export const relativeTimestamp = (timestamp) => {
  if (!timestamp) {
    return 'Unknown';
  }

  try {
    // Convert to Date object if it's a string
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Unknown';
    }

    // Calculate the difference in milliseconds
    const now = new Date();
    const diffMs = now - date;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    // Create a relative time formatter
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

    // Choose the appropriate unit based on the time difference
    if (diffSeconds < 60) {
      return 'just now';
    } else if (diffMinutes < 60) {
      return rtf.format(-diffMinutes, 'minute');
    } else if (diffHours < 24) {
      return rtf.format(-diffHours, 'hour');
    } else if (diffDays < 7) {
      return rtf.format(-diffDays, 'day');
    } else if (diffWeeks < 4) {
      return rtf.format(-diffWeeks, 'week');
    } else if (diffMonths < 12) {
      return rtf.format(-diffMonths, 'month');
    } else {
      return rtf.format(-diffYears, 'year');
    }
  } catch (error) {
    console.error('Error formatting relative timestamp:', error);
    return 'Unknown';
  }
};

/**
 * Format a full date and time for display.
 * 
 * Example: "April 21, 2026 at 3:45 PM"
 * 
 * @param {string|Date} timestamp - ISO 8601 timestamp or Date object
 * @returns {string} Formatted date and time
 */
export const formatDateTime = (timestamp) => {
  if (!timestamp) {
    return 'Unknown';
  }

  try {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    
    if (isNaN(date.getTime())) {
      return 'Unknown';
    }

    const formatter = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    return formatter.format(date);
  } catch (error) {
    console.error('Error formatting date time:', error);
    return 'Unknown';
  }
};

/**
 * Validate and format an IP address for display.
 * 
 * This doesn't change the IP, but validates it and ensures consistent formatting.
 * 
 * @param {string} ip - IP address (IPv4 or IPv6)
 * @returns {string} Formatted IP or "Invalid IP"
 */
export const formatIP = (ip) => {
  if (!ip || typeof ip !== 'string') {
    return 'Invalid IP';
  }

  // Basic validation (not exhaustive, but catches obvious errors)
  const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Pattern = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;

  if (ipv4Pattern.test(ip) || ipv6Pattern.test(ip)) {
    return ip.trim();
  }

  return 'Invalid IP';
};

