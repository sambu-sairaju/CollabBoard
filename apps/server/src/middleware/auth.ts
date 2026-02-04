import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, extractTokenFromHeader } from '../lib/jwt';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  userEmail?: string;
}

// Middleware to verify JWT and attach user info to request
export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = extractTokenFromHeader(req.headers.authorization);

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'No authentication token provided',
    });
  }

  const payload = verifyAccessToken(token);

  if (!payload) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
    });
  }

  // Attach user info to request
  req.userId = payload.userId;
  req.userEmail = payload.email;

  next();
}

// Optional authentication - doesn't fail if no token
export function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = extractTokenFromHeader(req.headers.authorization);

  if (token) {
    const payload = verifyAccessToken(token);
    if (payload) {
      req.userId = payload.userId;
      req.userEmail = payload.email;
    }
  }

  next();
}
