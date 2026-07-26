# JWT + Cookie Demo
 
A minimal Node.js/Express app built to understand — hands-on, in the browser — how a JWT stored in an **httpOnly cookie** actually works: how it's set, how it's sent automatically on requests, why client-side JavaScript can't read it, and how it expires.
 
Built as a learning project while studying authentication & authorization patterns in backend development.
 
## What it demonstrates
 
- Signing a JWT on login and sending it back via `Set-Cookie` (`httpOnly`, `sameSite`)
- The browser automatically attaching the cookie to subsequent requests — no manual `Authorization` header needed
- `httpOnly` blocking JavaScript from reading the token (XSS protection) — verifiable via `document.cookie` in devtools
- Stateless token verification: a short (60s) expiry shows a valid session becoming a 401 with zero server-side session storage
- Clearing the cookie on logout
- 
## Tech stack
- Node.js / Express
- `jsonwebtoken` for signing & verifying JWTs
- `cookie-parser` for reading cookies from incoming requests
- Plain HTML/JS frontend (no framework) to keep the focus on the auth flow
- 
## Getting started
```bash
git clone https://github.com/Kumar-Shivam01/jwt-cookie-demo
cd jwt-cookie-demo
npm install
node server.js
```
 
Then open `http://localhost:3000` in your browser.
 
**Demo login:** `kumar shivam` / `shivam@123`
 
## Try it yourself
 
1. Log in and check DevTools → Application → Cookies — you'll see the `token` cookie marked `HttpOnly`.
2. Click "Call /profile" — no token is attached manually, the browser sends the cookie for you.
3. Click "Try reading cookie via JS" — the token won't show up in `document.cookie`.
4. Wait 60 seconds and call `/profile` again — the token has expired, and the server rejects it.
5. Log out — the cookie is cleared.
## Notes
 
This is a learning/demo project, not production-ready code:
- JWT secret is hardcoded (should be an environment variable)
- Only one hardcoded user (no real database or signup flow)
- `secure: false` on the cookie (would be `true` behind HTTPS in production)
- 
## Author
Built by kumar shivam as part of a backend development learning journey.
