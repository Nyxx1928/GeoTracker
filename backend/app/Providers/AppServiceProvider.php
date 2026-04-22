<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\ResolverInterface;
use App\Services\Resolver;
use App\Services\GeoProviderInterface;
use App\Services\IpApiProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Bind ResolverInterface to Resolver implementation
        $this->app->bind(ResolverInterface::class, Resolver::class);
        
        // Bind GeoProviderInterface to IpApiProvider implementation
        $this->app->bind(GeoProviderInterface::class, IpApiProvider::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
