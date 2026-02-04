import { Router, Request, Response } from 'express';
import passport from '../../lib/passport';
import * as authController from './auth.controller';
import { authenticate } from '../../middleware/auth';
import { generateTokens } from '../../lib/jwt';
import { query } from '../../lib/db';
import { randomUUID } from 'crypto';

const router: Router = Router();

// Check if OAuth strategies are configured
const isGoogleConfigured = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
const isGitHubConfigured = !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);

// ==========================================
// Email/Password Authentication Routes
// ==========================================

// Register new user
router.post('/register', authController.register);

// Login with email/password
router.post('/login', authController.login);

// Refresh access token
router.post('/refresh', authController.refreshToken);

// Logout
router.post('/logout', authController.logout);

// ==========================================
// Protected Routes (require authentication)
// ==========================================

// Get current user
router.get('/me', authenticate, authController.getMe);

// Update profile
router.patch('/profile', authenticate, authController.updateProfile);

// ==========================================
// Google OAuth Routes
// ==========================================

// Initiate Google OAuth
router.get('/google', (req: Request, res: Response, next) => {
  if (!isGoogleConfigured) {
    return res.status(501).json({
      success: false,
      error: 'Google OAuth is not configured',
      message: 'Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to your .env file',
    });
  }
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })(req, res, next);
});

// Google OAuth callback
router.get('/google/callback', (req: Request, res: Response, next) => {
  if (!isGoogleConfigured) {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=google_not_configured`);
  }
  
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=google_auth_failed`,
  })(req, res, async () => {
    try {
      const user = req.user as { id: string; email: string; name: string | null; avatar: string | null };
      
      // Generate tokens
      const tokens = generateTokens({ userId: user.id, email: user.email });

      // Create session
      await query(
        `INSERT INTO "Session" (id, "userId", token, "expiresAt", "createdAt") 
         VALUES ($1, $2, $3, $4, $5)`,
        [randomUUID(), user.id, tokens.refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), new Date()]
      );

      // Redirect to frontend with tokens
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(
        `${frontendUrl}/auth/callback?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`
      );
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=auth_failed`);
    }
  });
});

// ==========================================
// GitHub OAuth Routes
// ==========================================

// Initiate GitHub OAuth
router.get('/github', (req: Request, res: Response, next) => {
  if (!isGitHubConfigured) {
    return res.status(501).json({
      success: false,
      error: 'GitHub OAuth is not configured',
      message: 'Please add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET to your .env file',
    });
  }
  passport.authenticate('github', {
    scope: ['user:email'],
    session: false,
  })(req, res, next);
});

// GitHub OAuth callback
router.get('/github/callback', (req: Request, res: Response, next) => {
  if (!isGitHubConfigured) {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=github_not_configured`);
  }
  
  passport.authenticate('github', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=github_auth_failed`,
  })(req, res, async () => {
    try {
      const user = req.user as { id: string; email: string; name: string | null; avatar: string | null };
      
      // Generate tokens
      const tokens = generateTokens({ userId: user.id, email: user.email });

      // Create session
      await query(
        `INSERT INTO "Session" (id, "userId", token, "expiresAt", "createdAt") 
         VALUES ($1, $2, $3, $4, $5)`,
        [randomUUID(), user.id, tokens.refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), new Date()]
      );

      // Redirect to frontend with tokens
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      res.redirect(
        `${frontendUrl}/auth/callback?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`
      );
    } catch (error) {
      console.error('GitHub OAuth callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/login?error=auth_failed`);
    }
  });
});

// ==========================================
// OAuth Status Endpoint (for frontend)
// ==========================================
router.get('/oauth-status', (_req: Request, res: Response) => {
  res.json({
    success: true,
    google: isGoogleConfigured,
    github: isGitHubConfigured,
  });
});

export default router;
