<?php

namespace App\Services;

/**
 * Data class representing the result of a target resolution.
 *
 * Contains the detected type, resolved IP address, DNS records,
 * and any error messages from the resolution process.
 */
class ResolverResult
{
    /**
     * @param  string  $type  The detected target type: 'ip', 'domain', 'url', or 'email'
     * @param  string|null  $resolvedIp  The primary resolved IP address (null if resolution failed)
     * @param  array  $dnsRecords  Array of DNS records retrieved during resolution
     * @param  string|null  $error  Error message if resolution failed (null if successful)
     */
    public function __construct(
        public string $type,
        public ?string $resolvedIp,
        public array $dnsRecords = [],
        public ?string $error = null
    ) {}

    /**
     * Check if the resolution was successful.
     *
     * @return bool True if an IP was resolved, false otherwise
     */
    public function isSuccessful(): bool
    {
        return $this->resolvedIp !== null && $this->error === null;
    }
}
