# Lesson: Building History CRUD Endpoints with Laravel

## Task Context

We needed to create a complete set of CRUD (Create, Read, Update, Delete) endpoints for managing user lookup history in the LinkGuard application. Users should be able to:
- View their lookup history
- Share lookups via public URLs
- Add custom labels to lookups
- Delete individual or all lookups

This task implements the "History Persistence" phase of the LinkGuard pivot, transforming GeoTracker from a stateless tool into one with persistent user data.

## Files Modified

- `backend/app/Http/Controllers/HistoryController.php` (created)
- `backend/routes/api.php` (modified)

## Step-by-Step Changes

### Step 1: Created the HistoryController

We created a new controller at `backend/app/Http/Controllers/HistoryController.php` with five methods:

1. **index()** - GET /api/history
   - Fetches the user's 50 most recent lookups
   - Uses the `forUser()` and `recent()` scopes from the LookupHistory model
   - Returns paginated response with data and meta fields

2. **show()** - GET /api/lookup/{uuid}
   - Public endpoint (no authentication required)
   - Finds a lookup by its UUID
   - Returns 404 if not found
   - Powers the shareable public lookup URLs

3. **update()** - PATCH /api/history/{id}
   - Updates the label field on a lookup
   - Validates label (max 100 characters)
   - Verifies ownership before allowing update
   - Returns 403 if user doesn't own the record

4. **destroy()** - DELETE /api/history/{id}
   - Deletes a single lookup record
   - Verifies ownership before deletion
   - Returns 403 if user doesn't own the record

5. **destroyAll()** - DELETE /api/history
   - Deletes all lookups for the authenticated user
   - Returns count of deleted records
   - Provides a "clear history" feature

### Step 2: Added Routes

We updated `backend/routes/api.php` to register all the new endpoints:

**Public route** (no authentication):
```php
Route::get('/lookup/{uuid}', [HistoryController::class, 'show']);
```

**Authenticated routes** (inside auth:sanctum middleware):
```php
Route::get('/history', [HistoryController::class, 'index']);
Route::patch('/history/{id}', [HistoryController::class, 'update']);
Route::delete('/history/{id}', [HistoryController::class, 'destroy']);
Route::delete('/history', [HistoryController::class, 'destroyAll']);
```

### Step 3: Imported the Controller

We added the HistoryController import at the top of the routes file:
```php
use App\Http\Controllers\HistoryController;
```

## Why This Approach

### Separation of Concerns
We created a dedicated HistoryController instead of adding these methods to AnalyzeController. This keeps each controller focused on a single responsibility:
- AnalyzeController: Target resolution and enrichment
- HistoryController: History management

### Ownership Authorization Pattern
Every authenticated endpoint verifies ownership using this pattern:
```php
$lookup = LookupHistory::where('id', $id)
    ->where('user_id', $user->id)
    ->first();

if (!$lookup) {
    return response()->json(['error' => true, ...], 403);
}
```

This prevents users from accessing or modifying other users' data. It's a critical security measure.

### Public Sharing via UUID
The `/api/lookup/{uuid}` endpoint is intentionally unauthenticated. The UUID acts as a "capability" - anyone with the UUID can view the lookup. This enables sharing without requiring recipients to create accounts.

UUIDs are 36 characters long with 122 bits of randomness, making them practically impossible to guess. This is called "security through unguessability" or "capability-based security".

### Eloquent Query Scopes
We use the `forUser()` and `recent()` scopes defined in the LookupHistory model:
```php
LookupHistory::forUser($user->id)->recent(50)->get();
```

This keeps the controller code clean and readable. The scopes encapsulate common query patterns, making them reusable across the application.

## Alternatives Considered

### Alternative 1: Policy-Based Authorization
Laravel provides authorization policies that could replace our manual ownership checks:
```php
$this->authorize('update', $lookup);
```

**Why we didn't use it**: For this simple ownership check, the inline verification is more explicit and easier to understand. Policies are better for complex authorization logic.

### Alternative 2: Resource Controllers
Laravel's resource controllers provide conventional CRUD routing:
```php
Route::resource('history', HistoryController::class);
```

**Why we didn't use it**: Our endpoints don't follow REST conventions exactly (e.g., `destroyAll` is custom). Explicit routing makes the API clearer.

### Alternative 3: Soft Deletes
We could use Laravel's soft delete feature to mark records as deleted instead of actually deleting them:
```php
$lookup->delete(); // Soft delete (sets deleted_at timestamp)
```

**Why we didn't use it**: The requirements don't specify data retention needs. Hard deletes are simpler and respect user privacy (users expect deleted data to be gone).

## Key Concepts

### 1. CRUD Operations
CRUD stands for Create, Read, Update, Delete - the four basic operations for persistent storage:
- **Create**: Already handled in AnalyzeController when saving lookups
- **Read**: `index()` and `show()` methods
- **Update**: `update()` method for labels
- **Delete**: `destroy()` and `destroyAll()` methods

### 2. RESTful API Design
Our endpoints follow REST principles:
- GET /api/history - List resources
- GET /api/lookup/{uuid} - Show single resource
- PATCH /api/history/{id} - Update resource
- DELETE /api/history/{id} - Delete resource
- DELETE /api/history - Bulk delete (custom endpoint)

### 3. Authorization vs Authentication
- **Authentication**: Verifying who you are (handled by Sanctum middleware)
- **Authorization**: Verifying what you can do (handled by ownership checks)

Both are necessary for secure APIs. Authentication happens at the middleware level, authorization happens in the controller.

### 4. HTTP Status Codes
We use appropriate status codes:
- **200**: Success
- **403**: Forbidden (authenticated but not authorized)
- **404**: Not found

This helps clients understand what went wrong without parsing error messages.

### 5. Eloquent Relationships and Scopes
The LookupHistory model defines:
- **Relationship**: `belongsTo(User::class)` - each lookup belongs to a user
- **Scopes**: `forUser()` and `recent()` - reusable query filters

This demonstrates Laravel's ORM capabilities for clean database interactions.

## Potential Pitfalls

### Pitfall 1: Missing Ownership Checks
**Problem**: Forgetting to verify ownership allows users to access other users' data.

**Solution**: Always check `user_id` matches the authenticated user:
```php
->where('user_id', $user->id)
```

### Pitfall 2: Route Order Matters
**Problem**: If we put the public route inside the auth middleware, it won't work.

**Solution**: Public routes must be defined outside the `auth:sanctum` middleware group.

### Pitfall 3: DELETE vs DELETE with ID
**Problem**: Laravel might confuse `DELETE /api/history` with `DELETE /api/history/{id}`.

**Solution**: Define the more specific route first:
```php
Route::delete('/history/{id}', ...);  // More specific
Route::delete('/history', ...);       // Less specific
```

### Pitfall 4: Returning Sensitive Data
**Problem**: The public lookup endpoint could expose sensitive user information.

**Solution**: The LookupHistory model should hide sensitive fields (like user_id) in its `$hidden` array. We'll verify this in the model.

### Pitfall 5: SQL Injection via UUID
**Problem**: Directly interpolating the UUID into SQL could allow injection.

**Solution**: Laravel's Eloquent automatically escapes parameters:
```php
->where('uuid', $uuid)  // Safe - Eloquent escapes this
```

Never use raw SQL with user input unless you use parameter binding.

## What You Learned

1. **How to build a complete CRUD API** with Laravel controllers and routes
2. **Ownership authorization pattern** for multi-tenant applications
3. **Public sharing via UUIDs** as a security mechanism
4. **RESTful API design principles** and appropriate HTTP status codes
5. **Eloquent query scopes** for clean, reusable database queries
6. **Security considerations** when building APIs (ownership checks, public endpoints)
7. **Route organization** (public vs authenticated routes)

This lesson demonstrates how to build secure, maintainable APIs that respect user ownership and enable sharing. The patterns you learned here apply to any multi-tenant application where users need to manage their own data.

