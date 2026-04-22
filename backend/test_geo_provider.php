<?php

/**
 * Manual test script for GeoProvider implementation.
 * 
 * This script makes a real API call to ip-api.com to verify the implementation
 * works correctly with actual network requests.
 * 
 * Usage: php test_geo_provider.php
 */

require __DIR__ . '/vendor/autoload.php';

use App\Services\IpApiProvider;

// Bootstrap Laravel application
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "Testing GeoProvider with real API call...\n\n";

$provider = new IpApiProvider();

// Test with Google's public DNS (8.8.8.8)
echo "Looking up 8.8.8.8 (Google DNS)...\n";
$result = $provider->lookup('8.8.8.8');

if ($result->isSuccessful()) {
    echo "✓ Lookup successful!\n\n";
    echo "Status: {$result->status}\n";
    echo "Query: {$result->query}\n";
    echo "Country: {$result->country} ({$result->countryCode})\n";
    echo "City: {$result->city}\n";
    echo "Region: {$result->regionName}\n";
    echo "Coordinates: {$result->lat}, {$result->lon}\n";
    echo "Timezone: {$result->timezone}\n";
    echo "ISP: {$result->isp}\n";
    echo "Organization: {$result->org}\n";
    echo "AS: {$result->as}\n";
    echo "Proxy: " . ($result->proxy ? 'Yes' : 'No') . "\n";
    echo "Hosting: " . ($result->hosting ? 'Yes' : 'No') . "\n";
    echo "Mobile: " . ($result->mobile ? 'Yes' : 'No') . "\n";
} else {
    echo "✗ Lookup failed!\n";
    echo "Status: {$result->status}\n";
    echo "Message: {$result->message}\n";
}

echo "\n" . str_repeat('-', 50) . "\n\n";

// Test with example.com IP
echo "Looking up 93.184.216.34 (example.com)...\n";
$result2 = $provider->lookup('93.184.216.34');

if ($result2->isSuccessful()) {
    echo "✓ Lookup successful!\n\n";
    echo "Country: {$result2->country}\n";
    echo "City: {$result2->city}\n";
    echo "ISP: {$result2->isp}\n";
    echo "Proxy: " . ($result2->proxy ? 'Yes' : 'No') . "\n";
    echo "Hosting: " . ($result2->hosting ? 'Yes' : 'No') . "\n";
} else {
    echo "✗ Lookup failed!\n";
    echo "Message: {$result2->message}\n";
}

echo "\n✓ All tests completed!\n";
