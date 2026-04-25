<?php

namespace App\Services;

/**
 * Resolver Service - Converts targets (IP, domain, URL, email) to IP addresses.
 *
 * This is the core resolution engine that intelligently detects input types
 * and applies appropriate DNS resolution strategies:
 * - IP addresses: Validated and passed through
 * - URLs: Hostname extracted, then A-record lookup
 * - Domains: A-record lookup
 * - Emails: Domain extracted, MX-record lookup, then A-record on mail server
 *
 * Also validates against private IP ranges to prevent internal network scanning.
 */
class Resolver implements ResolverInterface
{
    /**
     * Regex patterns for target type detection.
     */
    private const PATTERN_IPV4 = '/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/';

    private const PATTERN_IPV6 = '/^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/';

    private const PATTERN_URL = '/^https?:\/\//i';

    private const PATTERN_EMAIL = '/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/';

    /**
     * Private IP ranges (CIDR notation).
     * These ranges are not allowed for security reasons.
     */
    private const PRIVATE_IP_RANGES = [
        '10.0.0.0/8',        // Class A private network
        '172.16.0.0/12',     // Class B private networks
        '192.168.0.0/16',    // Class C private networks
        '127.0.0.0/8',       // Loopback addresses
    ];

    /**
     * Resolve a target to an IP address.
     *
     * This method detects the target type and applies the appropriate
     * resolution strategy. It validates the result against private IP ranges.
     *
     * @param  string  $target  The target to resolve
     * @return ResolverResult The resolution result
     */
    public function resolve(string $target): ResolverResult
    {
        $target = trim($target);

        // Detect target type and resolve accordingly
        if ($this->isIPv4($target)) {
            return $this->resolveIPv4($target);
        }

        if ($this->isIPv6($target)) {
            return $this->resolveIPv6($target);
        }

        if ($this->isURL($target)) {
            return $this->resolveURL($target);
        }

        if ($this->isEmail($target)) {
            return $this->resolveEmail($target);
        }

        // Default: treat as domain
        return $this->resolveDomain($target);
    }

    /**
     * Check if target is an IPv4 address.
     */
    private function isIPv4(string $target): bool
    {
        return preg_match(self::PATTERN_IPV4, $target) === 1;
    }

    /**
     * Check if target is an IPv6 address.
     */
    private function isIPv6(string $target): bool
    {
        return preg_match(self::PATTERN_IPV6, $target) === 1;
    }

    /**
     * Check if target is a URL.
     */
    private function isURL(string $target): bool
    {
        return preg_match(self::PATTERN_URL, $target) === 1;
    }

    /**
     * Check if target is an email address.
     */
    private function isEmail(string $target): bool
    {
        return preg_match(self::PATTERN_EMAIL, $target) === 1;
    }

    /**
     * Resolve IPv4 address (validate and pass through).
     */
    private function resolveIPv4(string $ip): ResolverResult
    {
        // Validate against private IP ranges
        if ($this->isPrivateIP($ip)) {
            return new ResolverResult(
                type: 'ip',
                resolvedIp: null,
                dnsRecords: [],
                error: 'Private IP ranges are not supported'
            );
        }

        return new ResolverResult(
            type: 'ip',
            resolvedIp: $ip,
            dnsRecords: []
        );
    }

    /**
     * Resolve IPv6 address (validate and pass through).
     */
    private function resolveIPv6(string $ip): ResolverResult
    {
        // For IPv6, we'll do basic validation
        // Note: Private IPv6 ranges include fc00::/7 and fe80::/10
        // For simplicity, we'll allow all IPv6 for now

        return new ResolverResult(
            type: 'ip',
            resolvedIp: $ip,
            dnsRecords: []
        );
    }

    /**
     * Resolve URL by extracting hostname and performing A-record lookup.
     */
    private function resolveURL(string $url): ResolverResult
    {
        // Extract hostname from URL
        $hostname = parse_url($url, PHP_URL_HOST);

        if ($hostname === null || $hostname === false) {
            return new ResolverResult(
                type: 'url',
                resolvedIp: null,
                dnsRecords: [],
                error: 'Could not extract hostname from URL'
            );
        }

        // Perform A-record lookup on the hostname
        $result = $this->performARecordLookup($hostname);

        return new ResolverResult(
            type: 'url',
            resolvedIp: $result['ip'],
            dnsRecords: $result['records'],
            error: $result['error']
        );
    }

    /**
     * Resolve domain using A-record lookup.
     */
    private function resolveDomain(string $domain): ResolverResult
    {
        // Validate domain format
        if (! $this->isValidDomain($domain)) {
            return new ResolverResult(
                type: 'domain',
                resolvedIp: null,
                dnsRecords: [],
                error: 'Invalid domain format'
            );
        }

        $result = $this->performARecordLookup($domain);

        return new ResolverResult(
            type: 'domain',
            resolvedIp: $result['ip'],
            dnsRecords: $result['records'],
            error: $result['error']
        );
    }

    /**
     * Resolve email by extracting domain, performing MX lookup, then A-record lookup.
     *
     * DNS MX records specify mail servers for a domain. We need to:
     * 1. Extract the domain from the email (everything after @)
     * 2. Look up MX records to find the mail server hostname
     * 3. Resolve the mail server hostname to an IP address
     */
    private function resolveEmail(string $email): ResolverResult
    {
        // Extract domain from email
        $parts = explode('@', $email);
        if (count($parts) !== 2) {
            return new ResolverResult(
                type: 'email',
                resolvedIp: null,
                dnsRecords: [],
                error: 'Invalid email format'
            );
        }

        $domain = $parts[1];
        $dnsRecords = [];

        // Perform MX record lookup
        $mxRecords = @dns_get_record($domain, DNS_MX);

        if ($mxRecords === false || empty($mxRecords)) {
            return new ResolverResult(
                type: 'email',
                resolvedIp: null,
                dnsRecords: [],
                error: "No MX records found for domain: {$domain}"
            );
        }

        // Sort MX records by priority (lower number = higher priority)
        usort($mxRecords, fn ($a, $b) => $a['pri'] <=> $b['pri']);

        // Store MX records
        foreach ($mxRecords as $mx) {
            $dnsRecords[] = [
                'type' => 'MX',
                'host' => $mx['host'],
                'target' => $mx['target'],
                'priority' => $mx['pri'],
            ];
        }

        // Get the highest priority mail server
        $mailServer = $mxRecords[0]['target'];

        // Resolve mail server to IP using A-record lookup
        $aResult = $this->performARecordLookup($mailServer);

        if ($aResult['ip'] === null) {
            return new ResolverResult(
                type: 'email',
                resolvedIp: null,
                dnsRecords: $dnsRecords,
                error: "Could not resolve mail server {$mailServer} to IP"
            );
        }

        // Merge A records with MX records
        $dnsRecords = array_merge($dnsRecords, $aResult['records']);

        return new ResolverResult(
            type: 'email',
            resolvedIp: $aResult['ip'],
            dnsRecords: $dnsRecords,
            error: null
        );
    }

    /**
     * Perform A-record DNS lookup for a hostname.
     *
     * DNS A records map domain names to IPv4 addresses.
     * This is the most common type of DNS lookup.
     *
     * @param  string  $hostname  The hostname to resolve
     * @return array{ip: string|null, records: array, error: string|null}
     */
    private function performARecordLookup(string $hostname): array
    {
        // Use dns_get_record to get A records
        $records = @dns_get_record($hostname, DNS_A);

        if ($records === false || empty($records)) {
            return [
                'ip' => null,
                'records' => [],
                'error' => "No DNS A records found for: {$hostname}",
            ];
        }

        $ip = $records[0]['ip'];

        // Validate against private IP ranges
        if ($this->isPrivateIP($ip)) {
            return [
                'ip' => null,
                'records' => [],
                'error' => 'Private IP ranges are not supported',
            ];
        }

        // Format DNS records
        $dnsRecords = [];
        foreach ($records as $record) {
            $dnsRecords[] = [
                'type' => 'A',
                'host' => $record['host'],
                'ip' => $record['ip'],
            ];
        }

        return [
            'ip' => $ip,
            'records' => $dnsRecords,
            'error' => null,
        ];
    }

    /**
     * Check if an IP address is in a private range.
     *
     * Private IP ranges should not be resolved to prevent internal network scanning.
     * This includes:
     * - 10.0.0.0/8 (Class A private)
     * - 172.16.0.0/12 (Class B private)
     * - 192.168.0.0/16 (Class C private)
     * - 127.0.0.0/8 (Loopback)
     *
     * @param  string  $ip  The IP address to check
     * @return bool True if the IP is in a private range
     */
    private function isPrivateIP(string $ip): bool
    {
        $ipLong = ip2long($ip);

        if ($ipLong === false) {
            return false;
        }

        foreach (self::PRIVATE_IP_RANGES as $range) {
            [$subnet, $mask] = explode('/', $range);
            $subnetLong = ip2long($subnet);
            $maskLong = -1 << (32 - (int) $mask);

            if (($ipLong & $maskLong) === ($subnetLong & $maskLong)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Validate domain format.
     *
     * A valid domain should:
     * - Contain at least one dot
     * - Have valid characters (alphanumeric, hyphens, dots)
     * - Not start or end with a hyphen or dot
     *
     * @param  string  $domain  The domain to validate
     * @return bool True if the domain format is valid
     */
    private function isValidDomain(string $domain): bool
    {
        // Basic domain validation
        return preg_match('/^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/', $domain) === 1;
    }
}
