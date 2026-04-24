<?php

namespace App\Services;

/**
 * Interface for geolocation provider services.
 *
 * The GeoProvider fetches enriched geolocation and network intelligence data
 * for IP addresses from external APIs (e.g., ip-api.com, ipinfo.io).
 *
 * This abstraction allows easy swapping of geolocation providers without
 * changing the rest of the application code.
 */
interface GeoProviderInterface
{
    /**
     * Look up geolocation and network data for an IP address.
     *
     * @param  string  $ip  The IP address to look up
     * @return GeoResult The geolocation result with enriched data
     */
    public function lookup(string $ip): GeoResult;
}
