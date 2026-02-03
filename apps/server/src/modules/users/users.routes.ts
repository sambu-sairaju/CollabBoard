import { Router } from 'express';

const router = Router();

// GET /api/users - Get all users (admin)
router.get('/', (req, res) => {
  res.json({ message: 'Get all users endpoint - TODO' });
});

// GET /api/users/:id - Get user by ID
router.get('/:id', (req, res) => {
  res.json({ message: `Get user ${req.params.id} endpoint - TODO` });
});

// PATCH /api/users/:id - Update user
router.patch('/:id', (req, res) => {
  res.json({ message: `Update user ${req.params.id} endpoint - TODO` });
});

export default router;
