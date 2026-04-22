# Skills & Agents Guide

Your Laravel + React development toolkit for learning and building better code.

## 🎓 Learning Skills

### When You Want to Learn While Coding

**`teach-as-you-code`** - Already installed!
- Explains every step as code is written
- Use when: Vibe coding and want to understand what's happening

**`explain-concepts-deeply`**
- Deep dives into concepts with analogies and comparisons
- Use when: Learning new frameworks, patterns, or architecture
- Example: "Explain React hooks" or "Why Eloquent over raw SQL?"

**`socratic-teacher`**
- Asks guiding questions instead of giving direct answers
- Use when: Want to think through problems yourself
- Example: Agent asks "What do you think happens if this API call fails?"

**`learning-summary`**
- Generates end-of-session summaries with practice exercises
- Use when: Finishing a coding session or major feature
- Example: "Summarize what we learned today"

### When You Want to Improve Your Code

**`refactor-with-explanation`**
- Refactors code and explains every improvement
- Use when: Code works but could be better
- Teaches: Performance, readability, maintainability patterns

**`best-practices-enforcer`**
- Applies modern best practices and explains why
- Use when: Want production-ready code
- Covers: Security, performance, accessibility, clean code

**`debug-with-reasoning`**
- Systematic debugging with hypothesis → test → fix
- Use when: Something's broken and you want to learn debugging
- Teaches: Problem-solving methodology

**`test-driven-developer`**
- Encourages writing tests first, explains strategy
- Use when: Building reliable features
- Teaches: Testing mindset, edge cases, TDD workflow

## 🤖 Specialized Agents

### Backend Development

**`laravel-api-builder`**
- Builds complete Laravel API endpoints
- Creates: Controllers, validation, resources, tests
- Best for: RESTful API development

**Example usage:**
```
"Build a posts API with CRUD operations, validation, and tests"
```

### Frontend Development

**`react-component-builder`**
- Builds React components with hooks and best practices
- Includes: Accessibility, performance, tests
- Best for: UI component development

**Example usage:**
```
"Create a UserProfile component that fetches and displays user data"
```

### Full-Stack Development

**`fullstack-feature-builder`**
- Builds complete features from backend to frontend
- Handles: API integration, error handling, authentication
- Best for: End-to-end feature development

**Example usage:**
```
"Build a comment system with Laravel backend and React frontend"
```

### Code Quality

**`code-reviewer`**
- Reviews code like a senior developer
- Checks: Security, performance, best practices, bugs
- Best for: Before committing or when learning

**Example usage:**
```
"Review my PostController for issues"
```

## 🎯 How to Use

### Activate a Skill
```
"Use the explain-concepts-deeply skill to help me understand React Context"
```

### Invoke an Agent
```
"Use the laravel-api-builder agent to create a products API"
```

### Combine Skills and Agents
```
"Use the fullstack-feature-builder agent with the teach-as-you-code skill 
to build a user authentication system"
```

## 📚 Quick Reference

### I want to...

**Learn a new concept**
→ `explain-concepts-deeply`

**Build an API endpoint**
→ `laravel-api-builder` agent

**Create a React component**
→ `react-component-builder` agent

**Build a full feature**
→ `fullstack-feature-builder` agent

**Improve existing code**
→ `refactor-with-explanation` skill

**Fix a bug and learn debugging**
→ `debug-with-reasoning` skill

**Write tests**
→ `test-driven-developer` skill

**Review my code**
→ `code-reviewer` agent

**Understand what I learned**
→ `learning-summary` skill

**Think through problems myself**
→ `socratic-teacher` skill

**Ensure best practices**
→ `best-practices-enforcer` skill

## 💡 Pro Tips

1. **Combine skills**: Use `teach-as-you-code` with any agent for learning
2. **End sessions with summaries**: Always use `learning-summary` before breaks
3. **Review before committing**: Use `code-reviewer` agent
4. **Start with tests**: Use `test-driven-developer` for critical features
5. **Refactor regularly**: Use `refactor-with-explanation` to improve code quality

## 🚀 Example Workflows

### Learning a New Feature
1. Use `explain-concepts-deeply` to understand the concept
2. Use appropriate agent to build it
3. Use `learning-summary` to consolidate knowledge

### Building Production Code
1. Use `test-driven-developer` to write tests first
2. Use appropriate agent to implement
3. Use `best-practices-enforcer` to ensure quality
4. Use `code-reviewer` before committing

### Debugging
1. Use `debug-with-reasoning` to systematically find the issue
2. Fix and learn from the process
3. Use `test-driven-developer` to prevent regression

### Refactoring
1. Use `code-reviewer` to identify issues
2. Use `refactor-with-explanation` to improve
3. Use `best-practices-enforcer` to ensure standards

## 📖 Your Stack-Specific Best Practices

### Laravel Backend
- Use Form Requests for validation
- Use API Resources for responses
- Eager load relationships (prevent N+1)
- Use database transactions
- Write feature tests

### React Frontend
- Functional components with hooks
- Custom hooks for reusable logic
- Handle loading/error states
- Accessibility compliance
- Performance optimization

### Full-Stack Integration
- Consistent error handling
- Proper authentication flow
- CORS configuration
- API versioning
- End-to-end tests

---

**Remember**: These tools are here to help you learn and build better. Don't hesitate to ask questions or request explanations!
