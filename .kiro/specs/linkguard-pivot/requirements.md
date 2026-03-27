# Requirements Document

## Introduction

LinkGuard is a pivot of the existing GeoTracker application (React + Laravel). Instead of accepting only raw IP addresses, LinkGuard accepts emails, URLs, and domains, resolves them to IPs, enriches the result with ISP/proxy/hosting intelligence, scores them for risk, and persists lookup history in the database. Authenticated users can save, label, and share results via public URLs. A public landing page allows unauthenticated visitors to perform a single lookup without signing in.

## Glossary

- **Analyzer**: The backend subsystem responsible for accepting a target input, resolving it to an IP, and returning enriched geo and risk data.
- **Resolver**: The component within the Analyzer that converts a URL, domain, or email address into one or more IP addresses via DNS.
- **GeoProvider**: The external API (ip-api.com or ipinfo.io) used to retrieve geolocation and network metadata for a resolved IP.
- **RiskScorer**: The frontend component that evaluates GeoProvider flags (proxy, hosting, mobile, ISP type) and assigns a risk level.
- **LookupHistory**: The persistent database record of past lookups associated with a user.
- **LookupRecord**: A single entry in LookupHistory containing the original target, resolved IP, geo data, risk level, UUID, and timestamp.
- **PublicLookup**: A read-only, unauthenticated view of a LookupRecord identified by its UUID.
- **Target**: The raw user input — an email address, a URL, a domain, or a raw IP address.
- **RiskLevel**: One of four values: `LOW`, `MEDIUM`, `HIGH`, or `UNKNOWN`.
- **User**: An authenticated account holder in the system.

---

## Requirements

### Requirement 1: Target Input & Resolution

**User Story:** As a user, I want to paste an email address, URL, or domain into the search bar, so that I can investigate any internet target without needing to know its IP address first.

#### Acceptance Criteria

1. THE Analyzer SHALL accept a Target that is a raw IPv4 address, IPv6 address, domain name, URL, or email address.
2. WHEN a URL is submitted as a Target, THE Resolver SHALL extract the hostname from the URL before performing DNS resolution.
3. WHEN a domain or extracted hostname is submitted, THE Resolver SHALL resolve it to at least one IPv4 address using DNS A-record lookup.
4. WHEN an email address is submitted as a Target, THE Resolver SHALL extract the domain part of the email address and resolve it via DNS MX-record lookup to obtain the mail server hostname, then resolve that hostname to an IP address.
5. IF DNS resolution returns no records for a Target, THEN THE Analyzer SHALL return an error response with a human-readable message indicating the domain could not be resolved.
6. IF the submitted Target does not match any recognised format (IPv4, IPv6, domain, URL, or email), THEN THE Analyzer SHALL return a 422 validation error with a descriptive message.
7. WHEN resolution succeeds, THE Analyzer SHALL pass the resolved IP to the GeoProvider and return a unified response containing: original target, resolved IP, geo data, DNS records, and risk flags.

---

### Requirement 2: Enriched Geo & Network Intelligence

**User Story:** As a user, I want to see ISP, organisation, ASN, proxy/hosting/mobile flags, timezone, and local time alongside the location, so that I can understand the full network context of a target.

#### Acceptance Criteria

1. WHEN the GeoProvider returns a successful response, THE Analyzer SHALL include the following fields in the unified response: `isp`, `org`, `as` (ASN), `proxy`, `hosting`, `mobile`, `timezone`, `countryCode`, `city`, `regionName`, `country`, `lat`, `lon`, `query` (resolved IP).
2. WHEN `countryCode` is present in the GeoProvider response, THE Analyzer SHALL include a country flag emoji derived from the `countryCode` in the unified response.
3. WHEN `timezone` is present in the unified response, THE Frontend SHALL display the current local time at the target location, updated at the time of the lookup.
4. IF the GeoProvider returns a `status` of `fail`, THEN THE Analyzer SHALL return an error response with the GeoProvider's `message` field.

---

### Requirement 3: Risk Scoring

**User Story:** As a user, I want a clear risk badge on every result, so that I can immediately understand whether a target is safe, suspicious, or high-risk.

#### Acceptance Criteria

1. THE RiskScorer SHALL assign `RiskLevel` `HIGH` when the GeoProvider response indicates `proxy` is `true` or `hosting` is `true` and `proxy` is `true`.
2. THE RiskScorer SHALL assign `RiskLevel` `MEDIUM` when the GeoProvider response indicates `hosting` is `true` and `proxy` is `false`.
3. THE RiskScorer SHALL assign `RiskLevel` `LOW` when `proxy` is `false`, `hosting` is `false`, and geo data is present.
4. THE RiskScorer SHALL assign `RiskLevel` `UNKNOWN` when the GeoProvider returns no usable geo data for the resolved IP.
5. THE Frontend SHALL display a coloured badge for each result: green for `LOW`, amber for `MEDIUM`, red for `HIGH`, and grey for `UNKNOWN`.
6. WHEN the same Target is scored twice with identical GeoProvider flags, THE RiskScorer SHALL produce the same `RiskLevel` both times (deterministic scoring).

---

### Requirement 4: Persistent Lookup History

**User Story:** As a user, I want my lookup history to survive page refreshes and be stored in the database, so that I can review past investigations at any time.

#### Acceptance Criteria

1. WHEN an authenticated User submits a Target and the Analyzer returns a successful response, THE System SHALL persist a LookupRecord to the `lookup_history` table containing: `user_id`, `type` (email/url/domain/ip), `target`, `resolved_ip`, `result` (JSON), `risk_level`, `uuid`, and `created_at`.
2. WHEN an authenticated User requests `GET /api/history`, THE System SHALL return the User's 50 most recent LookupRecords ordered by `created_at` descending.
3. WHEN an authenticated User requests `DELETE /api/history/{id}`, THE System SHALL delete the LookupRecord with the given `id` belonging to that User and return a 200 response.
4. IF a `DELETE /api/history/{id}` request references a LookupRecord that does not belong to the authenticated User, THEN THE System SHALL return a 403 response.
5. WHEN an authenticated User requests `DELETE /api/history`, THE System SHALL delete all LookupRecords belonging to that User and return a 200 response.
6. THE Frontend SHALL load LookupHistory from `GET /api/history` on page mount and display the original Target (not the resolved IP) as the primary label for each history entry.
7. WHEN displaying a LookupRecord in history, THE Frontend SHALL show the city, country flag emoji, risk badge, and a relative timestamp (e.g. "2 hours ago").

---

### Requirement 5: History Entry Labels

**User Story:** As a user, I want to tag a history entry with a custom label, so that I can remember why I looked up a particular target.

#### Acceptance Criteria

1. THE System SHALL store an optional `label` field (string, max 100 characters) on each LookupRecord.
2. WHEN an authenticated User submits a `PATCH /api/history/{id}` request with a `label` field, THE System SHALL update the `label` on the matching LookupRecord belonging to that User and return the updated record.
3. IF a `PATCH /api/history/{id}` request references a LookupRecord that does not belong to the authenticated User, THEN THE System SHALL return a 403 response.
4. THE Frontend SHALL display the label (if set) alongside the Target in the history list.
5. WHEN a label is not set, THE Frontend SHALL display the raw Target string in place of the label.

---

### Requirement 6: Shareable Public Lookup URLs

**User Story:** As a user, I want to share a lookup result via a public URL, so that colleagues can view the full result card without needing an account.

#### Acceptance Criteria

1. WHEN a LookupRecord is created, THE System SHALL generate a UUID v4 and store it in the `uuid` column of the `lookup_history` table.
2. WHEN an unauthenticated request is made to `GET /api/lookup/{uuid}`, THE System SHALL return the full LookupRecord data (target, resolved IP, geo data, risk level, timestamp) without requiring authentication.
3. IF `GET /api/lookup/{uuid}` is called with a UUID that does not exist, THEN THE System SHALL return a 404 response.
4. THE Frontend SHALL render a public result page at `/lookup/{uuid}` displaying the full result card: target, resolved IP, geo data, risk badge, and map.
5. THE Frontend SHALL display a "Copy link" button on every result card that copies the `/lookup/{uuid}` URL to the clipboard.
6. THE Frontend SHALL make the `/lookup/{uuid}` route accessible without authentication.

---

### Requirement 7: Public Landing Page

**User Story:** As a visitor, I want to see my own IP and location instantly on the landing page without logging in, so that I can evaluate the tool before creating an account.

#### Acceptance Criteria

1. THE Frontend SHALL render a public landing page at `/` that is accessible without authentication.
2. WHEN an unauthenticated visitor loads the landing page, THE Frontend SHALL display the visitor's resolved IP and geo data by calling a public endpoint.
3. THE System SHALL expose `GET /api/geo/public` as an unauthenticated endpoint that returns the caller's IP geo data.
4. THE Frontend landing page SHALL include a search bar that accepts a Target and calls `POST /api/analyze/public` without requiring authentication.
5. THE Frontend landing page SHALL include a "What's my IP?" button that auto-fills the search bar with the visitor's resolved IP address.
6. WHEN an unauthenticated visitor performs a lookup on the landing page, THE System SHALL return the full enriched result but SHALL NOT persist a LookupRecord to the database.
7. THE Frontend SHALL prompt unauthenticated visitors to log in or register in order to save lookup history.

---

### Requirement 8: Bulk Lookup

**User Story:** As a user, I want to paste multiple targets at once and get a results table, so that I can investigate a batch of emails or URLs efficiently.

#### Acceptance Criteria

1. THE Frontend SHALL provide a bulk input textarea that accepts multiple Targets separated by newlines.
2. WHEN a bulk lookup is submitted, THE Frontend SHALL send each Target as a separate `POST /api/analyze` request and aggregate the responses into a results table.
3. THE Frontend SHALL display bulk results in a table with columns: Target, Resolved IP, Country (with flag), City, ISP, Risk Badge.
4. WHEN one or more Targets in a bulk lookup fail to resolve, THE Frontend SHALL display an inline error for each failed Target without blocking the display of successful results.
5. THE System SHALL process bulk lookup requests at a rate of no more than 10 concurrent `POST /api/analyze` requests at a time to avoid overloading the GeoProvider.

---

### Requirement 9: UX Utilities

**User Story:** As a user, I want copy-to-clipboard, dark/light mode, and a "What's my IP?" shortcut, so that the app is fast and comfortable to use.

#### Acceptance Criteria

1. THE Frontend SHALL provide a copy-to-clipboard button adjacent to every displayed IP address that copies the IP string to the system clipboard.
2. THE Frontend SHALL provide a dark/light mode toggle that persists the user's preference in `localStorage`.
3. WHEN the dark/light mode preference is stored in `localStorage`, THE Frontend SHALL apply the stored preference on page load without a flash of the wrong theme.
4. THE Frontend SHALL provide a "What's my IP?" button on the authenticated home page that auto-fills the search bar with the user's own resolved IP address.

---

### Requirement 10: New Analyze API Endpoint

**User Story:** As a developer, I want a single unified `POST /api/analyze` endpoint, so that the frontend has one consistent interface for all target types.

#### Acceptance Criteria

1. THE System SHALL expose `POST /api/analyze` as an authenticated endpoint that accepts a JSON body with a `target` field.
2. WHEN `POST /api/analyze` is called, THE Analyzer SHALL resolve the Target, fetch geo data from the GeoProvider, compute the RiskLevel, persist a LookupRecord, and return the unified response in a single HTTP response.
3. THE unified response from `POST /api/analyze` SHALL include: `target`, `type`, `resolved_ip`, `geo` (full GeoProvider fields), `risk_level`, `dns_records`, `uuid`, and `created_at`.
4. THE System SHALL expose `POST /api/analyze/public` as an unauthenticated endpoint with identical resolution and enrichment logic but without persisting a LookupRecord.
5. WHEN `POST /api/analyze` or `POST /api/analyze/public` receives a `target` that resolves to a private or loopback IP range (10.x.x.x, 172.16–31.x.x, 192.168.x.x, 127.x.x.x), THE Analyzer SHALL return a 422 error indicating that private IP ranges are not supported.
