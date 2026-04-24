<?php

namespace Tests\Unit;

use App\Services\GeoResult;
use App\Services\RiskScorer;
use Tests\TestCase;

/**
 * Unit tests for the RiskScorer service.
 *
 * These tests verify the deterministic risk scoring algorithm with specific examples.
 * The RiskScorer assigns risk levels based on network characteristics:
 * - HIGH: Proxy IPs (can hide true origin)
 * - MEDIUM: Hosting/datacenter IPs (often used for automated activities)
 * - LOW: Residential IPs (typical user connections)
 * - UNKNOWN: No usable geo data or indeterminate flags
 *
 * Teaching Point: Deterministic algorithms should always produce the same output
 * for the same input. This makes them predictable, testable, and reliable.
 */
class RiskScorerTest extends TestCase
{
    private RiskScorer $scorer;

    protected function setUp(): void
    {
        parent::setUp();
        $this->scorer = new RiskScorer;
    }

    /**
     * Test HIGH risk when proxy flag is true.
     * Proxy IPs are high risk because they can hide the true origin.
     */
    public function test_scores_high_when_proxy_is_true(): void
    {
        $geo = new GeoResult(
            status: 'success',
            query: '8.8.8.8',
            proxy: true,
            hosting: false,
            mobile: false
        );

        $result = $this->scorer->score($geo);

        $this->assertEquals('HIGH', $result);
    }

    /**
     * Test HIGH risk when both proxy and hosting are true.
     * Proxy flag takes precedence.
     */
    public function test_scores_high_when_proxy_and_hosting_are_true(): void
    {
        $geo = new GeoResult(
            status: 'success',
            query: '8.8.8.8',
            proxy: true,
            hosting: true,
            mobile: false
        );

        $result = $this->scorer->score($geo);

        $this->assertEquals('HIGH', $result);
    }

    /**
     * Test MEDIUM risk when hosting is true and proxy is false.
     * Hosting/datacenter IPs are medium risk because they're often used for automated activities.
     */
    public function test_scores_medium_when_hosting_is_true_and_proxy_is_false(): void
    {
        $geo = new GeoResult(
            status: 'success',
            query: '8.8.8.8',
            proxy: false,
            hosting: true,
            mobile: false
        );

        $result = $this->scorer->score($geo);

        $this->assertEquals('MEDIUM', $result);
    }

    /**
     * Test LOW risk when both proxy and hosting are false.
     * Residential IPs are low risk because they're typical user connections.
     */
    public function test_scores_low_when_proxy_and_hosting_are_false(): void
    {
        $geo = new GeoResult(
            status: 'success',
            query: '8.8.8.8',
            proxy: false,
            hosting: false,
            mobile: false
        );

        $result = $this->scorer->score($geo);

        $this->assertEquals('LOW', $result);
    }

    /**
     * Test UNKNOWN risk when status is fail.
     * If the geolocation lookup failed, we can't determine risk.
     */
    public function test_scores_unknown_when_status_is_fail(): void
    {
        $geo = new GeoResult(
            status: 'fail',
            message: 'API error'
        );

        $result = $this->scorer->score($geo);

        $this->assertEquals('UNKNOWN', $result);
    }

    /**
     * Test UNKNOWN risk when query is null.
     * If no IP was queried, we can't determine risk.
     */
    public function test_scores_unknown_when_query_is_null(): void
    {
        $geo = new GeoResult(
            status: 'success',
            query: null,
            proxy: false,
            hosting: false
        );

        $result = $this->scorer->score($geo);

        $this->assertEquals('UNKNOWN', $result);
    }

    /**
     * Test UNKNOWN risk when proxy flag is null.
     * If flags are indeterminate, we can't score accurately.
     */
    public function test_scores_unknown_when_proxy_is_null(): void
    {
        $geo = new GeoResult(
            status: 'success',
            query: '8.8.8.8',
            proxy: null,
            hosting: false,
            mobile: false
        );

        $result = $this->scorer->score($geo);

        $this->assertEquals('UNKNOWN', $result);
    }

    /**
     * Test UNKNOWN risk when hosting flag is null.
     * If flags are indeterminate, we can't score accurately.
     */
    public function test_scores_unknown_when_hosting_is_null(): void
    {
        $geo = new GeoResult(
            status: 'success',
            query: '8.8.8.8',
            proxy: false,
            hosting: null,
            mobile: false
        );

        $result = $this->scorer->score($geo);

        $this->assertEquals('UNKNOWN', $result);
    }

    /**
     * Test UNKNOWN risk when both flags are null.
     */
    public function test_scores_unknown_when_both_flags_are_null(): void
    {
        $geo = new GeoResult(
            status: 'success',
            query: '8.8.8.8',
            proxy: null,
            hosting: null,
            mobile: false
        );

        $result = $this->scorer->score($geo);

        $this->assertEquals('UNKNOWN', $result);
    }

    /**
     * Test deterministic behavior: same input produces same output.
     * This is a critical property of the scoring algorithm.
     */
    public function test_deterministic_scoring(): void
    {
        $geo = new GeoResult(
            status: 'success',
            query: '8.8.8.8',
            proxy: false,
            hosting: true,
            mobile: false
        );

        $result1 = $this->scorer->score($geo);
        $result2 = $this->scorer->score($geo);

        $this->assertEquals($result1, $result2);
        $this->assertEquals('MEDIUM', $result1);
    }

    /**
     * Test that mobile flag doesn't affect scoring.
     * Mobile flag is informational but doesn't change risk level.
     */
    public function test_mobile_flag_does_not_affect_scoring(): void
    {
        $geoMobileTrue = new GeoResult(
            status: 'success',
            query: '8.8.8.8',
            proxy: false,
            hosting: false,
            mobile: true
        );

        $geoMobileFalse = new GeoResult(
            status: 'success',
            query: '8.8.8.8',
            proxy: false,
            hosting: false,
            mobile: false
        );

        $result1 = $this->scorer->score($geoMobileTrue);
        $result2 = $this->scorer->score($geoMobileFalse);

        $this->assertEquals($result1, $result2);
        $this->assertEquals('LOW', $result1);
    }

    /**
     * Test scoring with complete GeoResult including all fields.
     * Verify that only proxy and hosting flags affect the score.
     */
    public function test_scores_with_complete_geo_result(): void
    {
        $geo = new GeoResult(
            status: 'success',
            message: null,
            query: '8.8.8.8',
            country: 'United States',
            countryCode: 'US',
            region: 'CA',
            regionName: 'California',
            city: 'Mountain View',
            zip: '94043',
            lat: 37.4192,
            lon: -122.0574,
            timezone: 'America/Los_Angeles',
            isp: 'Google LLC',
            org: 'Google LLC',
            as: 'AS15169 Google LLC',
            proxy: false,
            hosting: true,
            mobile: false
        );

        $result = $this->scorer->score($geo);

        $this->assertEquals('MEDIUM', $result);
    }
}
