---
name: learning-summary
description: At the end of any session or major change, generate a clean "What You Learned Today" summary with suggested practice exercises and next experiments.
---

## Learning Summary Generation

### When to Generate
- End of coding session
- After implementing a major feature
- When user asks "what did we learn?"
- After debugging a complex issue
- When switching contexts or taking a break

### Summary Structure

#### 1. Session Overview
Brief 1-2 sentence summary of what was accomplished.

#### 2. Key Concepts Learned
List 3-5 main concepts, patterns, or techniques covered:
- **Concept name**: Brief explanation and why it matters
- **Where used**: Specific file/function where applied
- **Key insight**: The "aha!" moment or most important takeaway

#### 3. Technical Skills Practiced
- Languages/frameworks used
- Tools and techniques applied
- Debugging methods employed
- Best practices followed

#### 4. Code Highlights
Show 1-3 code snippets that represent the most important learning:
```javascript
// Example: Custom hook for API calls
const useApi = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [url]);
  
  return { data, loading };
};

// Why this matters: Reusable logic, separation of concerns, clean components
```

#### 5. Problems Solved
- Bugs fixed and root causes
- Challenges overcome
- Decisions made and rationale

#### 6. Practice Exercises
Suggest 2-4 hands-on exercises to reinforce learning:

**Beginner level:**
- Modify existing code with small variations
- Implement similar feature in different context

**Intermediate level:**
- Build related feature from scratch
- Refactor code using learned patterns

**Advanced level:**
- Combine multiple concepts
- Optimize or extend functionality

#### 7. Next Steps
Suggest logical progression:
- **Immediate next**: Natural continuation of current work
- **Related topics**: Complementary concepts to explore
- **Deeper dive**: Advanced aspects of what was learned
- **Resources**: Docs, articles, or tutorials for further learning

#### 8. Questions to Ponder
2-3 thought-provoking questions to deepen understanding:
- "How would this pattern scale with 1000x more data?"
- "What security concerns should we consider?"
- "How could we test this more thoroughly?"

### Example Summary Format

---

## 🎓 Learning Summary: User Authentication Flow

### What We Built
Implemented complete user authentication with Laravel Sanctum backend and React frontend, including login, registration, and protected routes.

### Key Concepts Learned

**1. Token-based Authentication**
- How: Backend issues token, frontend stores and sends with requests
- Why: Stateless, scalable, works great for SPAs
- Used in: `AuthController.php`, `api.js`

**2. React Context for Global State**
- How: Created AuthContext to share user state across components
- Why: Avoids prop drilling, centralized auth logic
- Used in: `AuthContext.js`, `App.js`

**3. Protected Routes Pattern**
- How: Wrapper component checks auth before rendering
- Why: Prevents unauthorized access, better UX
- Used in: `ProtectedRoute.js`

**4. Laravel API Resources**
- How: Transform model data for API responses
- Why: Consistent format, hide sensitive fields
- Used in: `UserResource.php`

### Technical Skills Practiced
- ✅ Laravel Sanctum configuration
- ✅ React hooks (useState, useEffect, useContext)
- ✅ Async/await for API calls
- ✅ Error handling (frontend + backend)
- ✅ CORS configuration
- ✅ Token storage and management

### Code Highlight
```javascript
// Custom hook that encapsulates all auth logic
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (credentials) => {
    const response = await api.post('/login', credentials);
    setUser(response.data.user);
    localStorage.setItem('token', response.data.token);
  };

  // Why this is powerful: Single source of truth for auth,
  // reusable across components, easy to test
  
  return { user, loading, login, logout };
};
```

### Problems Solved
- ✅ CORS errors: Configured Laravel sanctum.php with correct frontend URL
- ✅ Token not persisting: Added localStorage for token storage
- ✅ Protected routes accessible: Implemented route guard with redirect
- ✅ User state lost on refresh: Added token validation on app load

### Practice Exercises

**Beginner:**
1. Add a "Remember Me" checkbox that extends token expiration
2. Create a user profile page that displays authenticated user info
3. Add loading spinners during login/logout

**Intermediate:**
4. Implement password reset flow (forgot password email)
5. Add role-based access control (admin vs regular user)
6. Create a "My Account" page with editable profile fields

**Advanced:**
7. Implement refresh token rotation for better security
8. Add OAuth login (Google/GitHub)
9. Build activity log showing user's recent actions

### Next Steps

**Immediate:**
- Add email verification flow
- Implement "remember me" functionality
- Create user settings page

**Related Topics:**
- Authorization (roles & permissions)
- Session management strategies
- JWT vs Sanctum tradeoffs

**Deeper Dive:**
- OAuth 2.0 protocol
- Security best practices (XSS, CSRF)
- Token refresh strategies

**Resources:**
- [Laravel Sanctum Docs](https://laravel.com/docs/sanctum)
- [React Authentication Patterns](https://kentcdodds.com/blog/authentication-in-react-applications)
- [OWASP Auth Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

### Questions to Ponder
1. How would you handle authentication if the app needed to work offline?
2. What happens if a user's token is stolen? How can we mitigate this?
3. Should we store tokens in localStorage or cookies? What are the tradeoffs?
4. How would this auth system scale to millions of users?

---

### Tone
- Celebratory and encouraging
- Focus on progress and growth
- Make learning feel rewarding
- Inspire continued exploration
