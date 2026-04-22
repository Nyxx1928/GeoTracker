<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Services\Resolver;
use App\Services\ResolverResult;

/**
 * Unit tests for the Resolver service.
 * 
 * These tests verify specific examples of each target type and edge cases.
 * Property-based tests are in a separate file (Task 1.4).
 */
class ResolverTest extends TestCase
{
    private Resolver $resolver;

    protected function setUp(): void
    {
        parent::setUp();
        $this->resolver = new Resolver();
    }

    /**
     * Test IPv4 address resolution (pass-through).
     */
    public function test_resolves_ipv4_address(): void
    {
        $result = $this->resolver->resolve('8.8.8.8');

        $this->assertInstanceOf(ResolverResult::class, $result);
        $this->assertEquals('ip', $result->type);
        $this->assertEquals('8.8.8.8', $result->resolvedIp);
        $this->assertNull($result->error);
        $this->assertTrue($result->isSuccessful());
    }

    /**
     * Test IPv6 address resolution (pass-through).
     */
    public function test_resolves_ipv6_address(): void
    {
        $result = $this->resolver->resolve('2001:4860:4860::8888');

        $this->assertEquals('ip', $result->type);
        $this->assertEquals('2001:4860:4860::8888', $result->resolvedIp);
        $this->assertNull($result->error);
        $this->assertTrue($result->isSuccessful());
    }

    /**
     * Test domain resolution using A-record lookup.
     */
    public function test_resolves_domain(): void
    {
        $result = $this->resolver->resolve('google.com');

        $this->assertEquals('domain', $result->type);
        $this->assertNotNull($result->resolvedIp);
        $this->assertNull($result->error);
        $this->assertTrue($result->isSuccessful());
        $this->assertNotEmpty($result->dnsRecords);
        $this->assertEquals('A', $result->dnsRecords[0]['type']);
    }

    /**
     * Test URL resolution (hostname extraction + A-record lookup).
     */
    public function test_resolves_url(): void
    {
        $result = $this->resolver->resolve('https://www.google.com/search?q=test');

        $this->assertEquals('url', $result->type);
        $this->assertNotNull($result->resolvedIp);
        $this->assertNull($result->error);
        $this->assertTrue($result->isSuccessful());
        $this->assertNotEmpty($result->dnsRecords);
    }

    /**
     * Test email resolution (domain extraction + MX lookup + A-record lookup).
     */
    public function test_resolves_email(): void
    {
        $result = $this->resolver->resolve('test@gmail.com');

        $this->assertEquals('email', $result->type);
        $this->assertNotNull($result->resolvedIp);
        $this->assertNull($result->error);
        $this->assertTrue($result->isSuccessful());
        $this->assertNotEmpty($result->dnsRecords);
        
        // Should have both MX and A records
        $hasMX = false;
        $hasA = false;
        foreach ($result->dnsRecords as $record) {
            if ($record['type'] === 'MX') $hasMX = true;
            if ($record['type'] === 'A') $hasA = true;
        }
        $this->assertTrue($hasMX, 'Should have MX records');
        $this->assertTrue($hasA, 'Should have A records');
    }

    /**
     * Test private IP range rejection (10.x.x.x).
     */
    public function test_rejects_private_ip_10_range(): void
    {
        $result = $this->resolver->resolve('10.0.0.1');

        $this->assertEquals('ip', $result->type);
        $this->assertNull($result->resolvedIp);
        $this->assertNotNull($result->error);
        $this->assertStringContainsString('Private IP', $result->error);
        $this->assertFalse($result->isSuccessful());
    }

    /**
     * Test private IP range rejection (192.168.x.x).
     */
    public function test_rejects_private_ip_192_range(): void
    {
        $result = $this->resolver->resolve('192.168.1.1');

        $this->assertEquals('ip', $result->type);
        $this->assertNull($result->resolvedIp);
        $this->assertNotNull($result->error);
        $this->assertStringContainsString('Private IP', $result->error);
        $this->assertFalse($result->isSuccessful());
    }

    /**
     * Test private IP range rejection (172.16-31.x.x).
     */
    public function test_rejects_private_ip_172_range(): void
    {
        $result = $this->resolver->resolve('172.16.0.1');

        $this->assertEquals('ip', $result->type);
        $this->assertNull($result->resolvedIp);
        $this->assertNotNull($result->error);
        $this->assertStringContainsString('Private IP', $result->error);
        $this->assertFalse($result->isSuccessful());
    }

    /**
     * Test loopback IP range rejection (127.x.x.x).
     */
    public function test_rejects_loopback_ip(): void
    {
        $result = $this->resolver->resolve('127.0.0.1');

        $this->assertEquals('ip', $result->type);
        $this->assertNull($result->resolvedIp);
        $this->assertNotNull($result->error);
        $this->assertStringContainsString('Private IP', $result->error);
        $this->assertFalse($result->isSuccessful());
    }

    /**
     * Test DNS resolution failure for non-existent domain.
     */
    public function test_handles_dns_failure(): void
    {
        $result = $this->resolver->resolve('this-domain-definitely-does-not-exist-12345.com');

        $this->assertEquals('domain', $result->type);
        $this->assertNull($result->resolvedIp);
        $this->assertNotNull($result->error);
        $this->assertStringContainsString('No DNS A records found', $result->error);
        $this->assertFalse($result->isSuccessful());
    }

    /**
     * Test invalid domain format.
     */
    public function test_rejects_invalid_domain(): void
    {
        $result = $this->resolver->resolve('invalid..domain');

        $this->assertEquals('domain', $result->type);
        $this->assertNull($result->resolvedIp);
        $this->assertNotNull($result->error);
        $this->assertStringContainsString('Invalid domain format', $result->error);
        $this->assertFalse($result->isSuccessful());
    }

    /**
     * Test invalid URL format.
     */
    public function test_handles_invalid_url(): void
    {
        $result = $this->resolver->resolve('http://');

        $this->assertEquals('url', $result->type);
        $this->assertNull($result->resolvedIp);
        $this->assertNotNull($result->error);
        $this->assertFalse($result->isSuccessful());
    }

    /**
     * Test invalid email format.
     */
    public function test_rejects_invalid_email(): void
    {
        $result = $this->resolver->resolve('invalid@');

        // This will be treated as domain since it doesn't match email pattern
        $this->assertNotNull($result->error);
        $this->assertFalse($result->isSuccessful());
    }

    /**
     * Test URL with path and query parameters.
     */
    public function test_extracts_hostname_from_complex_url(): void
    {
        $result = $this->resolver->resolve('https://example.com/path/to/page?param=value&other=123#anchor');

        $this->assertEquals('url', $result->type);
        $this->assertNotNull($result->resolvedIp);
        $this->assertNull($result->error);
        $this->assertTrue($result->isSuccessful());
    }

    /**
     * Test that whitespace is trimmed from input.
     */
    public function test_trims_whitespace(): void
    {
        $result = $this->resolver->resolve('  8.8.8.8  ');

        $this->assertEquals('ip', $result->type);
        $this->assertEquals('8.8.8.8', $result->resolvedIp);
        $this->assertTrue($result->isSuccessful());
    }
}
