import type { Request, Response, NextFunction } from 'express';

export const notFound = (req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({
    success: false,
    error: `Not Found - ${req.originalUrl}`,
  });
};
