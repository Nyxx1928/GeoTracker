# Implementation Plan: LinkGuard Pivot

## Overview

This implementation plan transforms GeoTracker into LinkGuard by adding support for email/URL/domain resolution, risk scoring, persistent lookup history, public sharing, and bulk lookup capabilities. The implementation follows a phased approach: backend foundation → history persistence → frontend updates → public features → bulk lookup.

## Tasks

- [ ] 1. Backend Foundation: Database and Core Services
  - [x] 1.1 Create lookup_history migration
    - Create migration file with schema: id, user_id (foreign key), type, target, resolved_ip, result (JSON), risk_level, uuid (unique), label (nullable), timestamps
    - Add indexes on (user_id, created_at) and uuid
    - Add foreign key constraint on user_id with cascade delete
    - _Requirements: 4.1, 5.1, 6.1_
  
  - [x] 1.2 Create LookupHistory Eloquent model
    - Define fillable fields, casts (result as array, created_at as datetime)
    - Add boot method to auto-generate UUID v4 on creation
    - Define user() relationship (belongsTo)
    - Add forUser() and recent() query scopes
    - _Requirements: 4.1, 6.1_
  
  - [x] 1.3 Implement Resolver service
    - Create ResolverInterface and ResolverResult classes
    - Implement target type detection (IP, domain, URL, email) using regex
    - Implement IPv4/IPv6 validation and pass-through
    - Implement URL hostname extraction
    - Implement email domain extraction and MX record resolution
    - Implement domain A-record resolution using dns_get_record()
    - Add private IP range validation (10.x, 172.16-31.x, 192.168.x, 127.x)
    - Return structured ResolverResult with type, resolvedIp, dnsRecords, error
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 10.5_
  
  - [ ]* 1.4 Write property tests for Resolver service
    - **Property 1: Input Format Acceptance** - Test that all valid IPv4, IPv6, domain, URL, email formats are accepted
    - **Property 2: URL Hostname Extraction** - Test hostname extraction from URLs with various schemes, paths, query params
    - **Property 3: Email Domain Extraction** - Test domain extraction from email addresses
    - **Property 4: Invalid Input Rejection** - Test that invalid formats return validation errors
    - **Property 31: Private IP Range Rejection** - Test that private IP ranges (10.x, 172.16-31.x, 192.168.x, 127.x) are rejected
    - _Requirements: 1.1, 1.2, 1.4, 1.6, 10.5_
  
  - [x] 1.5 Implement GeoProvider abstraction
    - Create GeoProviderInterface and GeoResult classes
    - Implement IpApiProvider with lookup() method
    - Make HTTP request to ip-api.com with fields parameter
    - Parse response into GeoResult with all required fields (isp, org, as, proxy, hosting, mobile, timezone, country, city, lat, lon, etc.)
    - Handle API failures and return status=fail with message
    - _Requirements: 2.1, 2.4_
  
  - [ ]* 1.6 Write unit tests for GeoProvider
    - Mock HTTP responses from ip-api.com with specific examples (google.com, example.com)
    - Test successful response parsing
    - Test API failure handling (status=fail)
    - Test timeout handling
    - _Requirements: 2.1, 2.4_
  
  - [x] 1.7 Implement RiskScorer service
    - Create RiskScorer class with score() method
    - Implement deterministic scoring algorithm: HIGH if proxy=true, MEDIUM if hosting=true AND proxy=false, LOW if proxy=false AND hosting=false, UNKNOWN otherwise
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.6_
  
  - [ ]* 1.8 Write property test for RiskScorer
    - **Property 8: Deterministic Risk Scoring** - Test that identical inputs produce identical outputs and verify algorithm correctness
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.6_
  
  - [x] 1.9 Create AnalyzeController with POST /api/analyze endpoint
    - Add route in routes/api.php under auth:sanctum middleware
    - Validate request body (target field required)
    - Call Resolver to resolve target to IP
    - Call GeoProvider to fetch geo data for resolved IP
    - Call RiskScorer to compute risk level
    - Return unified response with target, type, resolved_ip, geo, risk_level, dns_records
    - Handle errors: 422 for validation, 404 for DNS failure, 500 for API failure
    - _Requirements: 1.7, 10.1, 10.2, 10.3_
  
  - [ ]* 1.10 Write integration test for AnalyzeController
    - Test POST /api/analyze with known domains (google.com, example.com)
    - Test authentication requirement
    - Test error responses (invalid format, DNS failure, private IP)
    - _Requirements: 10.1, 10.2, 10.3_

- [x] 2. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. History Persistence: CRUD Operations
  - [x] 3.1 Update AnalyzeController to persist lookups
    - After successful resolution and scoring, create LookupHistory record
    - Store user_id, type, target, resolved_ip, result (full geo + dns_records as JSON), risk_level, uuid
    - Include uuid and created_at in response
    - _Requirements: 4.1, 6.1_
  
  - [ ]* 3.2 Write property test for lookup persistence
    - **Property 10: Lookup Persistence Completeness** - Test that all required fields are persisted for authenticated users
    - _Requirements: 4.1_
  
  - [x] 3.3 Create HistoryController with GET /api/history endpoint
    - Add route in routes/api.php under auth:sanctum middleware
    - Query LookupHistory for authenticated user, order by created_at desc, limit 50
    - Return paginated response with data and meta fields
    - _Requirements: 4.2_
  
  - [ ]* 3.4 Write property test for history ordering
    - **Property 11: History Ordering and Limiting** - Test that history returns at most 50 records ordered by created_at descending
    - _Requirements: 4.2_
  
  - [x] 3.5 Add DELETE /api/history/{id} endpoint
    - Validate that record belongs to authenticated user (403 if not)
    - Delete record and return 200 response
    - _Requirements: 4.3, 4.4_
  
  - [ ]* 3.6 Write property test for record deletion
    - **Property 12: Record Deletion Completeness** - Test that deleted records no longer appear in history
    - **Property 13: Ownership Authorization Enforcement** - Test that users cannot delete other users' records
    - _Requirements: 4.3, 4.4_
  
  - [x] 3.7 Add DELETE /api/history endpoint
    - Delete all LookupHistory records for authenticated user
    - Return 200 response with deleted_count
    - _Requirements: 4.5_
  
  - [ ]* 3.8 Write property test for bulk deletion
    - **Property 14: Bulk Deletion Completeness** - Test that all user records are deleted
    - _Requirements: 4.5_
  
  - [x] 3.9 Add PATCH /api/history/{id} endpoint
    - Validate label field (max 100 characters)
    - Validate that record belongs to authenticated user (403 if not)
    - Update label and return updated record
    - _Requirements: 5.1, 5.2, 5.3_
  
  - [ ]* 3.10 Write property tests for label operations
    - **Property 17: Label Length Validation** - Test that labels ≤100 chars are accepted, >100 chars are rejected
    - **Property 18: Label Update Round-Trip** - Test that updated labels are correctly retrieved
    - _Requirements: 5.1, 5.2_

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Frontend Core Components
  - [x] 5.1 Create RiskBadge component
    - Accept level prop (LOW, MEDIUM, HIGH, UNKNOWN)
    - Render color-coded badge: green for LOW, amber for MEDIUM, red for HIGH, grey for UNKNOWN
    - Add tooltip with risk explanation
    - _Requirements: 3.5_
  
  - [ ]* 5.2 Write property test for RiskBadge
    - **Property 9: Risk Badge Color Mapping** - Test that all risk levels display correct colors
    - _Requirements: 3.5_
  
  - [x] 5.3 Create utility functions for formatters
    - Implement countryCodeToFlag() to convert ISO 3166-1 alpha-2 codes to flag emoji
    - Implement timezoneToLocalTime() to calculate current local time from IANA timezone
    - Implement relativeTimestamp() for "2 hours ago" formatting
    - _Requirements: 2.2, 2.3, 4.7_
  
  - [ ]* 5.4 Write property test for country flag emoji
    - **Property 6: Country Flag Emoji Derivation** - Test that valid country codes produce correct flag emojis
    - _Requirements: 2.2_
  
  - [ ]* 5.5 Write property test for timezone conversion
    - **Property 7: Timezone to Local Time Conversion** - Test that valid IANA timezones produce correct local times
    - _Requirements: 2.3_
  
  - [x] 5.6 Create CopyButton component
    - Accept text prop
    - Render copy icon button
    - Copy text to clipboard on click using navigator.clipboard API
    - Show toast notification on success
    - _Requirements: 9.1_
  
  - [ ]* 5.7 Write property test for CopyButton
    - **Property 29: IP Copy Button Functionality** - Test that button copies exact text to clipboard
    - _Requirements: 9.1_
  
  - [x] 5.8 Create ResultCard component
    - Accept result prop (target, type, resolved_ip, geo, risk_level, uuid, created_at)
    - Display target, resolved IP with CopyButton, geo data (city, country with flag, ISP, org, ASN)
    - Display RiskBadge with risk_level
    - Display local time using timezone from geo data
    - Render GeoMap if lat/lon present
    - Display "Copy link" button that copies /lookup/{uuid} URL to clipboard
    - _Requirements: 1.7, 2.1, 2.2, 2.3, 6.5_
  
  - [ ]* 5.9 Write property test for ResultCard completeness
    - **Property 5: Response Structure Completeness** - Test that ResultCard displays all required fields
    - **Property 22: Public Lookup UI Completeness** - Test that all UI elements are rendered
    - _Requirements: 1.7, 2.1, 6.4_

- [ ] 6. Frontend Home Page Updates
  - [x] 6.1 Update Home.js to use POST /api/analyze endpoint
    - Replace GET /api/geo/{ip} with POST /api/analyze
    - Update handleSearch to send target in request body
    - Display ResultCard instead of inline geo data
    - _Requirements: 10.1, 10.2_
  
  - [x] 6.2 Create HistoryList component
    - Fetch history from GET /api/history on mount
    - Display table with columns: Target, Label, City, Country (flag), Risk Badge, Timestamp
    - Show target field as primary identifier (not resolved_ip)
    - Show label if set, otherwise show target
    - Add inline label editing (PATCH /api/history/{id})
    - Add delete button per row (DELETE /api/history/{id})
    - Add "Copy link" button per row
    - Display relative timestamps
    - _Requirements: 4.2, 4.6, 4.7, 5.4, 5.5, 6.5_
  
  - [ ]* 6.3 Write property tests for HistoryList
    - **Property 15: History Display Field Selection** - Test that target field is displayed as primary identifier
    - **Property 16: History UI Element Completeness** - Test that all required elements are rendered
    - **Property 19: Label Display Fallback** - Test that label is shown if set, otherwise target
    - _Requirements: 4.6, 4.7, 5.4, 5.5_
  
  - [x] 6.4 Integrate HistoryList into Home.js
    - Add HistoryList component below search controls
    - Refresh history after successful lookup
    - _Requirements: 4.2, 4.6_

- [ ] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Public Features: Landing Page and Sharing
  - [x] 8.1 Create POST /api/analyze/public endpoint
    - Add route in routes/api.php WITHOUT auth:sanctum middleware
    - Implement identical resolution and enrichment logic as /api/analyze
    - Do NOT persist LookupHistory record
    - Do NOT include uuid or created_at in response
    - Add rate limiting (10 requests/minute per IP)
    - _Requirements: 7.4, 7.6, 10.4_
  
  - [ ]* 8.2 Write property test for public endpoint non-persistence
    - **Property 24: Public Lookup Non-Persistence** - Test that public lookups do not create database records
    - _Requirements: 7.6, 10.4_
  
  - [x] 8.3 Create GET /api/geo/public endpoint
    - Add route in routes/api.php WITHOUT auth:sanctum middleware
    - Return caller's IP geo data (same as existing /api/geo but unauthenticated)
    - _Requirements: 7.3_
  
  - [x] 8.4 Create Landing.js page component
    - Render public landing page at / route
    - Display visitor's IP and geo data by calling GET /api/geo/public on mount
    - Add search bar that calls POST /api/analyze/public
    - Display ResultCard for lookup results (without uuid/created_at)
    - Add "What's my IP?" button that auto-fills search bar with visitor's IP
    - Add prompt to log in or register to save history
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.7_
  
  - [x] 8.5 Create GET /api/lookup/{uuid} endpoint
    - Add route in routes/api.php WITHOUT auth:sanctum middleware
    - Query LookupHistory by uuid
    - Return full record data (target, resolved_ip, geo, risk_level, created_at)
    - Return 404 if uuid not found
    - _Requirements: 6.2, 6.3_
  
  - [ ]* 8.6 Write property test for public lookup accessibility
    - **Property 21: Public Lookup Accessibility** - Test that valid UUIDs return data without authentication
    - _Requirements: 6.2_
  
  - [x] 8.7 Create PublicLookup.js page component
    - Render public result page at /lookup/:uuid route
    - Fetch data from GET /api/lookup/{uuid} on mount
    - Display ResultCard with full result data
    - Handle 404 errors gracefully
    - _Requirements: 6.4_
  
  - [x] 8.8 Update App.js routing
    - Add / route for Landing.js (public)
    - Add /lookup/:uuid route for PublicLookup.js (public)
    - Update /home route to remain protected
    - Update default redirect to / instead of /login
    - _Requirements: 6.6, 7.1_
  
  - [ ]* 8.9 Write property test for share link URL format
    - **Property 23: Share Link URL Format** - Test that "Copy link" button produces correct URL format
    - _Requirements: 6.5_

- [ ] 9. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 10. Bulk Lookup Feature
  - [x] 10.1 Create BulkLookup component
    - Add textarea for newline-separated targets
    - Add submit button
    - Parse textarea into array of targets
    - Send separate POST /api/analyze request for each target
    - Implement concurrent request limiter (max 10 simultaneous using Promise.allSettled with chunking)
    - Aggregate responses into results array
    - Display results table with columns: Target, Resolved IP, Country (flag), City, ISP, Risk Badge
    - Display inline error for each failed target
    - Add CSV export button
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [ ]* 10.2 Write property tests for bulk lookup
    - **Property 25: Bulk Request Cardinality** - Test that N targets produce exactly N requests
    - **Property 26: Bulk Results Table Completeness** - Test that all required columns are displayed
    - **Property 27: Bulk Mixed Results Display** - Test that successful and failed results are both displayed
    - **Property 28: Bulk Concurrency Limiting** - Test that max 10 concurrent requests are enforced
    - _Requirements: 8.2, 8.3, 8.4, 8.5_
  
  - [x] 10.3 Integrate BulkLookup into Home.js
    - Add tab or toggle to switch between single and bulk lookup modes
    - _Requirements: 8.1_

- [ ] 11. UX Utilities
  - [ ] 11.1 Implement dark/light mode toggle
    - Create ThemeToggle component
    - Store preference in localStorage
    - Apply theme on page load without flash
    - Add toggle button to header
    - _Requirements: 9.2, 9.3_
  
  - [ ]* 11.2 Write property test for theme persistence
    - **Property 30: Theme Preference Persistence Round-Trip** - Test that theme preference is correctly stored and retrieved
    - _Requirements: 9.2, 9.3_
  
  - [x] 11.3 Add "What's my IP?" button to Home.js
    - Fetch user's IP from GET /api/geo
    - Auto-fill search bar with user's IP on click
    - _Requirements: 9.4_

- [ ] 12. Final Integration and Wiring
  - [ ] 12.1 Run all migrations
    - Execute php artisan migrate to create lookup_history table
    - Verify database schema
    - _Requirements: 4.1_
  
  - [ ] 12.2 Update API routes documentation
    - Document all new endpoints in backend/README.md or API docs
    - Include request/response examples
    - _Requirements: 10.1, 10.4_
  
  - [ ] 12.3 Add error handling and logging
    - Ensure all controllers log errors to Laravel log
    - Add structured error responses for all endpoints
    - _Requirements: 1.5, 1.6, 2.4_
  
  - [ ] 12.4 Verify backward compatibility
    - Test that existing /api/geo and /api/geo/{ip} endpoints still work
    - Ensure existing Home.js functionality is preserved
    - _Requirements: N/A (backward compatibility)_
  
  - [ ]* 12.5 Write integration tests for end-to-end flows
    - Test complete flow: Landing → Lookup → Save → History → Share
    - Test authentication flow: Public → Login → Authenticated lookup
    - Test bulk lookup with mixed results
    - _Requirements: All_

- [ ] 13. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at major milestones
- Property tests validate universal correctness properties (31 total)
- Unit tests validate specific examples and edge cases
- Integration tests validate end-to-end flows
- The implementation follows the migration path: Backend Foundation → History Persistence → Frontend Updates → Public Features → Bulk Lookup
- All property tests must use minimum 100 iterations and include feature/property tags in comments
