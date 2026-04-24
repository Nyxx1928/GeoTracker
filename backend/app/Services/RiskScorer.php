<?php

namespace App\Services;

/**
 * Service for scoring risk levels based on network characteristics.
 *
 * The RiskScorer analyzes GeoProvider response data and assigns a risk level
 * based on proxy, hosting, and other network flags. The algorithm is deterministic -
 * identical inputs always produce identical outputs.
 *
 * Risk Levels:
 * - HIGH: Proxy IPs (can hide true origin)
 * - MEDIUM: Hosting/datacenter IPs (often used for automated activities)
 * - LOW: Residential IPs (typical user connections)
 * - UNKNOWN: No usable geo data or indeterminate flags
 */
class RiskScorer
{
    /**
     * Score a GeoResult and return a risk level.
     *
     * Algorithm:
     * - HIGH if proxy=true (anonymization attempt)
     * - MEDIUM if hosting=true AND proxy=false (datacenter IP)
     * - LOW if proxy=false AND hosting=false (residential IP)
     * - UNKNOWN if no usable geo data or flags are null
     *
     * @param  GeoResult  $geo  The geolocation result to score
     * @return string Risk level: 'HIGH', 'MEDIUM', 'LOW', or 'UNKNOWN'
     */
    public function score(GeoResult $geo): string
    {
        // If the lookup failed or no IP was queried, we can't determine risk
        if ($geo->status !== 'success' || $geo->query === null) {
            return 'UNKNOWN';
        }

        // If proxy flag is true, this is high risk (anonymization)
        if ($geo->proxy === true) {
            return 'HIGH';
        }

        // If hosting is true but proxy is false, this is medium risk (datacenter)
        if ($geo->hosting === true && $geo->proxy === false) {
            return 'MEDIUM';
        }

        // If both proxy and hosting are false, this is low risk (residential)
        if ($geo->proxy === false && $geo->hosting === false) {
            return 'LOW';
        }

        // If flags are null or indeterminate, we can't score accurately
        return 'UNKNOWN';
    }
}
