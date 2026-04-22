---
name: debug-with-reasoning
description: Walk through systematic debugging with hypothesis → reproduce → root cause → fix. Teaches debugging techniques and problem-solving methodology.
---

## Systematic Debugging Approach

### Phase 1: Understand the Problem
1. **Gather information**
   - What's the expected behavior?
   - What's actually happening?
   - When did this start? (New code? Environment change?)
   - Can you reproduce it consistently?

2. **Ask clarifying questions**
   - "What error message do you see?"
   - "Does this happen in development, production, or both?"
   - "What were you doing right before the error?"

### Phase 2: Form Hypotheses
Generate 2-3 possible causes, ranked by likelihood:

**Example:**
```
Hypothesis 1 (Most likely): API endpoint returning wrong data format
- Why: Error mentions "undefined property"
- Evidence: Recent backend changes

Hypothesis 2: Race condition in async code
- Why: Intermittent failure
- Evidence: Happens more on slow connections

Hypothesis 3: Browser caching old code
- Why: Works in incognito mode
- Evidence: User hasn't hard-refreshed
```

### Phase 3: Test Hypotheses
For each hypothesis, explain:
- **How to test it**: Specific steps or code to add
- **What to look for**: Expected results if hypothesis is correct
- **Tools to use**: Console logs, debugger, network tab, Laravel logs

**Debugging Techniques:**

#### Frontend (React)
- `console.log()` with descriptive labels
- React DevTools to inspect component state/props
- Network tab to verify API responses
- Breakpoints in browser debugger
- Error boundaries to catch React errors

#### Backend (Laravel)
- `dd()` and `dump()` for quick inspection
- `Log::info()` for production debugging
- Laravel Telescope for request tracking
- Database query logging
- API testing with Postman/Insomnia

#### Full-Stack
- Check browser console AND server logs
- Verify request/response in Network tab
- Test API endpoints independently
- Check environment variables
- Verify CORS configuration

### Phase 4: Isolate the Root Cause
- **Narrow down**: Binary search approach (comment out half the code)
- **Minimal reproduction**: Create simplest case that shows the bug
- **Compare working vs broken**: What's different?

### Phase 5: Fix and Verify
1. **Implement fix** with explanation of why it works
2. **Test the fix**: Verify original issue is resolved
3. **Test for regressions**: Ensure nothing else broke
4. **Add safeguards**: Prevent this bug from happening again

### Phase 6: Learn and Document
- **Root cause analysis**: Why did this happen?
- **Prevention**: How to avoid this in the future?
- **Patterns**: Is this a common bug type?
- **Documentation**: Add comments or update docs

## Common Bug Patterns

### React/Frontend
- **Stale closures**: Using old state in callbacks
- **Missing dependencies**: useEffect not re-running when it should
- **Async race conditions**: State updates after unmount
- **Key prop issues**: List rendering problems
- **CORS errors**: Backend not allowing frontend origin

### Laravel/Backend
- **N+1 queries**: Missing eager loading
- **Mass assignment**: Fillable/guarded misconfiguration
- **Route conflicts**: Order matters in routes file
- **Middleware issues**: Auth not applied correctly
- **Environment variables**: Missing or wrong .env values

### Full-Stack Integration
- **API contract mismatch**: Frontend expects different data shape
- **Authentication**: Token not sent or expired
- **CSRF tokens**: Missing for POST requests
- **Date/timezone**: Backend and frontend in different timezones
- **Validation errors**: Not properly displayed to user

## Debugging Mindset

### Do:
- ✅ Start with the error message — it usually tells you exactly what's wrong
- ✅ Check the obvious first (typos, missing imports, wrong variable names)
- ✅ Use version control to see what changed
- ✅ Take breaks if stuck — fresh eyes help
- ✅ Explain the problem out loud (rubber duck debugging)

### Don't:
- ❌ Make random changes hoping something works
- ❌ Skip reading error messages carefully
- ❌ Debug multiple issues at once
- ❌ Assume the framework/library is broken (usually it's our code)
- ❌ Give up after first hypothesis fails

## Example Debugging Session

**User**: "My login isn't working, it just shows a blank screen"

**Agent**: "Let's debug this systematically. First, let me understand:
1. Do you see any errors in the browser console?
2. Does the login API call succeed in the Network tab?
3. Is this happening in development or production?

While you check those, here are my initial hypotheses:
- **Hypothesis 1**: API call failing (401/500 error) but error not displayed
- **Hypothesis 2**: Successful login but redirect not working
- **Hypothesis 3**: Token not being stored correctly

Let's start by checking the Network tab. Can you try logging in and tell me what you see?"
