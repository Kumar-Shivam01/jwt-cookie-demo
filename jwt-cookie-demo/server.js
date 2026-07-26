const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// In real apps this lives in an env variable, never hardcoded.
const JWT_SECRET = 'super-secret-demo-key';

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Fake "database" of one user, just for the demo. 
const DEMO_USER = { id: 1, username: 'kumar shivam', password: 'shivam@123' };

// --- LOGIN ---
// Verifies credentials, signs a JWT, and sends it back as an httpOnly cookie.
// The browser will store this cookie but JS on the page CANNOT read it
// (open devtools console and try `document.cookie` after logging in).
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username !== DEMO_USER.username || password !== DEMO_USER.password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: DEMO_USER.id, username: DEMO_USER.username },
    JWT_SECRET,
    { expiresIn: '60s' } // short expiry so you can SEE it expire during the demo
  );

  res
    .cookie('token', token, {
      httpOnly: true,   // JS can't read it -> protects against XSS stealing the token
      secure: false,    // would be true in production (HTTPS only)
      sameSite: 'lax',  // basic CSRF protection
      maxAge: 60 * 1000 // 60s, matches token expiry
    })
    .json({ message: 'Logged in! Cookie has been set by the server.' });
});

// --- PROTECTED ROUTE ---
// No token is sent manually — the browser automatically attaches the
// cookie to every request to this origin. We just read it from req.cookies.
app.get('/profile', (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'No token found. Please log in.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ message: `Welcome back, ${decoded.username}!`, decoded });
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid or expired.' });
  }
});

// --- LOGOUT ---
// Clears the cookie by telling the browser to expire it immediately.
app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out, cookie cleared.' });
});

app.listen(PORT, () => {
  console.log(`JWT + Cookie demo running at http://localhost:${PORT}`);
});
