<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('lookup_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('type', 20);           // 'ip', 'domain', 'url', 'email'
            $table->string('target', 500);        // Original input
            $table->string('resolved_ip', 45);    // IPv4 or IPv6
            $table->json('result');               // Full GeoResult + dns_records
            $table->string('risk_level', 20);     // 'LOW', 'MEDIUM', 'HIGH', 'UNKNOWN'
            $table->uuid('uuid')->unique();       // For public sharing
            $table->string('label', 100)->nullable();  // User-defined label
            $table->timestamps();
            
            // Indexes for fast history retrieval and public lookup
            $table->index(['user_id', 'created_at']);
            $table->index('uuid');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lookup_history');
    }
};
