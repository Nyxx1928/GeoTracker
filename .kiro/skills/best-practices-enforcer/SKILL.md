---
name: best-practices-enforcer
description: Automatically apply modern best practices for your stack (clean code, security, performance, accessibility) and explain why each rule matters.
---

## Best Practices Enforcement

### Core Principles
- **Explain the "why"**: Don't just enforce rules, teach why they matter
- **Context-aware**: Different rules for different situations
- **Pragmatic**: Balance idealism with real-world constraints
- **Modern standards**: Follow current industry best practices

## React/Frontend Best Practices

### Component Design
✅ **Functional components with hooks** (not class components)
- Why: Modern React standard, simpler, better performance

✅ **Small, focused components** (< 200 lines)
- Why: Easier to test, reuse, and understand

✅ **Props destructuring** with default values
```javascript
// Good
function Button({ label = 'Click me', onClick, disabled = false }) {
  // ...
}
```
- Why: Clear API, prevents undefined errors

✅ **PropTypes or TypeScript** for type safety
- Why: Catches bugs early, self-documenting

### State Management
✅ **useState for local state**, Context/Redux for global
- Why: Don't over-engineer, use simplest solution

✅ **Derived state** instead of duplicating
```javascript
// Bad: Duplicating state
const [users, setUsers] = useState([]);
const [userCount, setUserCount] = useState(0);

// Good: Derive it
const [users, setUsers] = useState([]);
const userCount = users.length;
```
- Why: Single source of truth, no sync issues

✅ **Immutable state updates**
```javascript
// Good
setUsers(prev => [...prev, newUser]);
```
- Why: React relies on reference equality for re-renders

### Performance
✅ **useMemo/useCallback** for expensive operations
- Why: Prevents unnecessary recalculations

✅ **Lazy loading** for routes and heavy components
- Why: Faster initial load, better UX

✅ **Debounce** search inputs
- Why: Reduces API calls, better performance

### Accessibility
✅ **Semantic HTML** (button, nav, main, etc.)
- Why: Screen readers, SEO, keyboard navigation

✅ **Alt text** for images
- Why: Accessibility, SEO

✅ **ARIA labels** when semantic HTML isn't enough
- Why: Screen reader support

✅ **Keyboard navigation** support
- Why: Accessibility requirement

## Laravel/Backend Best Practices

### Security
✅ **Never trust user input** — always validate
```php
$validated = $request->validate([
    'email' => 'required|email',
    'password' => 'required|min:8',
]);
```
- Why: Prevents injection attacks, data corruption

✅ **Use Eloquent/Query Builder** (not raw SQL)
- Why: Automatic SQL injection protection

✅ **Hash passwords** with bcrypt
```php
Hash::make($password);
```
- Why: Security fundamental

✅ **CSRF protection** enabled (Laravel default)
- Why: Prevents cross-site request forgery

✅ **Rate limiting** on API routes
- Why: Prevents abuse, DDoS protection

### Database
✅ **Eager loading** to prevent N+1 queries
```php
// Bad: N+1 query
$users = User::all();
foreach ($users as $user) {
    echo $user->posts->count(); // Query per user!
}

// Good: Eager loading
$users = User::with('posts')->get();
```
- Why: Performance — 1 query instead of N+1

✅ **Database transactions** for multi-step operations
```php
DB::transaction(function () {
    // Multiple operations
});
```
- Why: Data consistency, rollback on failure

✅ **Indexes** on frequently queried columns
- Why: Query performance

✅ **Soft deletes** for important data
- Why: Data recovery, audit trail

### Code Organization
✅ **Fat models, skinny controllers**
- Why: Business logic in models, controllers just coordinate

✅ **Form Requests** for validation
- Why: Keeps controllers clean, reusable validation

✅ **API Resources** for response formatting
- Why: Consistent API responses, separation of concerns

✅ **Service classes** for complex business logic
- Why: Testable, reusable, single responsibility

✅ **Jobs/Queues** for slow operations
- Why: Better UX, scalability

### API Design
✅ **RESTful conventions**
- GET /users (list)
- GET /users/1 (show)
- POST /users (create)
- PUT/PATCH /users/1 (update)
- DELETE /users/1 (destroy)
- Why: Predictable, standard

✅ **Consistent response format**
```json
{
  "data": { ... },
  "message": "Success",
  "errors": []
}
```
- Why: Frontend can handle responses uniformly

✅ **Proper HTTP status codes**
- 200: Success
- 201: Created
- 400: Bad request
- 401: Unauthorized
- 404: Not found
- 500: Server error
- Why: Semantic, helps debugging

✅ **API versioning** (/api/v1/users)
- Why: Backwards compatibility

## Full-Stack Integration

### Authentication
✅ **Laravel Sanctum** for SPA authentication
- Why: Built for Laravel + React, secure, simple

✅ **Store tokens securely** (httpOnly cookies or localStorage with caution)
- Why: XSS protection

✅ **Token expiration** and refresh
- Why: Security best practice

### Error Handling
✅ **Frontend error boundaries**
- Why: Graceful failure, better UX

✅ **Backend exception handling**
```php
try {
    // Operation
} catch (Exception $e) {
    Log::error($e->getMessage());
    return response()->json(['error' => 'Something went wrong'], 500);
}
```
- Why: Don't expose internal errors to users

✅ **User-friendly error messages**
- Why: UX, helps users fix issues

### Environment & Configuration
✅ **Environment variables** for secrets
- Why: Security, different configs per environment

✅ **Never commit .env** files
- Why: Security fundamental

✅ **CORS properly configured**
- Why: Security, allows frontend to call backend

## Code Quality

### General
✅ **Descriptive naming** (no single letters except loops)
- Why: Self-documenting code

✅ **DRY principle** (Don't Repeat Yourself)
- Why: Easier maintenance, fewer bugs

✅ **Comments for "why", not "what"**
```javascript
// Bad: Increment counter
counter++;

// Good: Track failed login attempts for rate limiting
failedAttempts++;
```
- Why: Code shows what, comments explain why

✅ **Small functions** (< 50 lines)
- Why: Easier to test, understand, reuse

✅ **Consistent formatting** (use Prettier/PHP CS Fixer)
- Why: Readability, no style debates

### Testing
✅ **Write tests** for critical paths
- Why: Confidence in changes, documentation

✅ **Test edge cases** (empty, null, invalid input)
- Why: Most bugs are in edge cases

## When to Break Rules
- **Prototyping**: Skip some best practices for speed
- **Performance critical**: Optimize even if less readable
- **Legacy code**: Gradual improvement, not rewrite
- **Deadlines**: Document technical debt, fix later

## Enforcement Approach
1. **Identify violations** in code
2. **Explain why it matters** (security, performance, maintainability)
3. **Show the better way** with code example
4. **Implement the fix** with explanation
5. **Suggest related improvements** if any
