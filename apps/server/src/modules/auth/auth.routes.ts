import { Router } from 'express';

const router = Router();

// POST /api/auth/register - Register new user
router.post('/register', (req, res) => {
  res.json({ message: 'Register endpoint - TODO' });
});

// POST /api/auth/login - Login user
router.post('/login', (req, res) => {
  res.json({ message: 'Login endpoint - TODO' });
});

// POST /api/auth/logout - Logout user
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout endpoint - TODO' });
});

// POST /api/auth/refresh - Refresh access token
router.post('/refresh', (req, res) => {
  res.json({ message: 'Refresh token endpoint - TODO' });
});

// GET /api/auth/me - Get current user
router.get('/me', (req, res) => {
  res.json({ message: 'Get current user endpoint - TODO' });
});

// GET /api/auth/google - Google OAuth
router.get('/google', (req, res) => {
  res.json({ message: 'Google OAuth endpoint - TODO' });
});

// GET /api/auth/github - GitHub OAuth
router.get('/github', (req, res) => {
  res.json({ message: 'GitHub OAuth endpoint - TODO' });
});

export default router;
