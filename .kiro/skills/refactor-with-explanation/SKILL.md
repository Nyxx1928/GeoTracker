---
name: refactor-with-explanation
description: When refactoring code, explain every change made and why it improves the code. Teaches better patterns for performance, readability, and maintainability.
---

## Refactoring with Teaching

### Before Refactoring
1. **Analyze current code**: Point out what works and what could be better
2. **Identify issues**: Performance, readability, maintainability, security, or scalability concerns
3. **Propose approach**: Explain the refactoring strategy before making changes

### During Refactoring
For each change, explain:

#### Code Quality Improvements
- **Readability**: "Renamed `x` to `userData` — descriptive names make code self-documenting"
- **DRY Principle**: "Extracted repeated logic into `validateInput()` — reduces duplication and bugs"
- **Single Responsibility**: "Split this function into two — each now does one thing well"

#### Performance Optimizations
- **React**: "Added `useMemo` here — prevents expensive recalculation on every render"
- **Laravel**: "Changed N+1 query to eager loading — reduces database calls from 100 to 1"
- **Caching**: "Memoized this result — avoids redundant API calls"

#### Security Enhancements
- **Input validation**: "Added sanitization — prevents XSS attacks"
- **SQL injection**: "Switched to parameterized queries — protects against SQL injection"
- **Authentication**: "Added middleware check — ensures only authorized users access this"

#### Maintainability
- **Type safety**: "Added TypeScript types — catches errors at compile time"
- **Error handling**: "Wrapped in try-catch with specific error messages — easier debugging"
- **Documentation**: "Added JSDoc comments — helps future developers (including you!)"

#### Modern Patterns
- **React**: "Converted class to functional component with hooks — modern React standard"
- **Laravel**: "Used resource classes for API responses — consistent data formatting"
- **Async/await**: "Replaced promise chains with async/await — more readable async code"

### After Refactoring
1. **Summary**: List all improvements made
2. **Impact**: Explain the real-world benefits (faster, safer, easier to extend)
3. **Before/After comparison**: Show key differences
4. **Next steps**: Suggest further improvements if any

### Refactoring Categories

#### Quick Wins (Low effort, high impact)
- Variable/function naming
- Extract magic numbers to constants
- Remove dead code
- Add missing error handling

#### Medium Refactors
- Extract reusable components/functions
- Optimize database queries
- Improve state management
- Add input validation

#### Major Refactors
- Restructure component hierarchy
- Implement design patterns
- Migrate to new architecture
- Add comprehensive error boundaries

## Example Output Format

```javascript
// BEFORE: Hard to read, potential bugs
function f(d) {
  return d.map(x => x.n * 2).filter(x => x > 10);
}

// AFTER: Clear, maintainable, performant
function getDoubledValuesAboveThreshold(data) {
  const THRESHOLD = 10;
  
  return data
    .map(item => item.value * 2)  // Double each value
    .filter(value => value > THRESHOLD);  // Keep only values above threshold
}

// IMPROVEMENTS:
// 1. Descriptive function name - immediately clear what it does
// 2. Named constant for threshold - easy to adjust, self-documenting
// 3. Descriptive variable names - 'item' and 'value' vs 'x'
// 4. Inline comments - explain the "why" for each step
// 5. Formatted for readability - easier to scan and understand
```

### Tone
- Positive and constructive, never critical
- Focus on learning, not "fixing bad code"
- Explain the "why" behind every change
- Encourage questions about any refactoring decision
