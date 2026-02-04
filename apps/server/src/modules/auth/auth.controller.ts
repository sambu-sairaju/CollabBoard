import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { validatePassword } from '../../lib/password';

// Register new user
export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, name } = req.body;

    // Validate required fields
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and name are required',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
      });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        success: false,
        error: passwordValidation.errors[0],
        errors: passwordValidation.errors,
      });
    }

    const result = await authService.register({ email, password, name });

    res.status(201).json({
      success: true,
      ...result,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      return res.status(409).json({
        success: false,
        error: error.message,
      });
    }
    next(error);
  }
}

// Login user
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
    }

    const result = await authService.login({ email, password });

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Invalid')) {
      return res.status(401).json({
        success: false,
        error: error.message,
      });
    }
    next(error);
  }
}

// Refresh token
export async function refreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token is required',
      });
    }

    const result = await authService.refreshToken(refreshToken);

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    if (error instanceof Error && (error.message.includes('Invalid') || error.message.includes('expired'))) {
      return res.status(401).json({
        success: false,
        error: error.message,
      });
    }
    next(error);
  }
}

// Logout
export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
}

// Get current user (requires authentication)
export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    // userId is set by auth middleware
    const userId = (req as Request & { userId?: string }).userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
    }

    const user = await authService.getCurrentUser(userId);

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
}

// Update profile (requires authentication)
export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as Request & { userId?: string }).userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
    }

    const { name, avatar } = req.body;
    const user = await authService.updateProfile(userId, { name, avatar });

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
}
