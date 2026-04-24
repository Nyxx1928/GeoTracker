<?php

namespace App\Services;

/**
 * Data class representing the result of a geolocation lookup.
 *
 * Contains all enriched geolocation and network intelligence data
 * returned by the GeoProvider, including ISP information, proxy/hosting flags,
 * geographic coordinates, and timezone data.
 */
class GeoResult
{
    /**
     * @param  string  $status  API response status: 'success' or 'fail'
     * @param  string|null  $message  Error message if status is 'fail'
     * @param  string|null  $query  The queried IP address
     * @param  string|null  $country  Full country name
     * @param  string|null  $countryCode  ISO 3166-1 alpha-2 country code
     * @param  string|null  $region  Region/state code
     * @param  string|null  $regionName  Full region/state name
     * @param  string|null  $city  City name
     * @param  string|null  $zip  ZIP/postal code
     * @param  float|null  $lat  Latitude coordinate
     * @param  float|null  $lon  Longitude coordinate
     * @param  string|null  $timezone  IANA timezone identifier
     * @param  string|null  $isp  Internet Service Provider name
     * @param  string|null  $org  Organization name
     * @param  string|null  $as  Autonomous System Number and name
     * @param  bool|null  $proxy  Whether the IP is a proxy
     * @param  bool|null  $hosting  Whether the IP is a hosting/datacenter IP
     * @param  bool|null  $mobile  Whether the IP is a mobile connection
     */
    public function __construct(
        public string $status,
        public ?string $message = null,
        public ?string $query = null,
        public ?string $country = null,
        public ?string $countryCode = null,
        public ?string $region = null,
        public ?string $regionName = null,
        public ?string $city = null,
        public ?string $zip = null,
        public ?float $lat = null,
        public ?float $lon = null,
        public ?string $timezone = null,
        public ?string $isp = null,
        public ?string $org = null,
        public ?string $as = null,
        public ?bool $proxy = null,
        public ?bool $hosting = null,
        public ?bool $mobile = null
    ) {}

    /**
     * Check if the lookup was successful.
     *
     * @return bool True if status is 'success', false otherwise
     */
    public function isSuccessful(): bool
    {
        return $this->status === 'success';
    }

    /**
     * Convert the GeoResult to an array for JSON serialization.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'status' => $this->status,
            'message' => $this->message,
            'query' => $this->query,
            'country' => $this->country,
            'countryCode' => $this->countryCode,
            'region' => $this->region,
            'regionName' => $this->regionName,
            'city' => $this->city,
            'zip' => $this->zip,
            'lat' => $this->lat,
            'lon' => $this->lon,
            'timezone' => $this->timezone,
            'isp' => $this->isp,
            'org' => $this->org,
            'as' => $this->as,
            'proxy' => $this->proxy,
            'hosting' => $this->hosting,
            'mobile' => $this->mobile,
        ];
    }
}
