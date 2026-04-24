<?php

namespace App\Services;

/**
 * Interface for target resolution services.
 *
 * The Resolver converts various target types (IP, domain, URL, email)
 * into IP addresses using appropriate DNS resolution strategies.
 */
interface ResolverInterface
{
    /**
     * Resolve a target to an IP address.
     *
     * @param  string  $target  The target to resolve (IP, domain, URL, or email)
     * @return ResolverResult The resolution result
     */
    public function resolve(string $target): ResolverResult;
}
