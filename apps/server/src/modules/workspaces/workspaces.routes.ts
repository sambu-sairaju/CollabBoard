import { Router } from 'express';

const router = Router();

// GET /api/workspaces - Get all user's workspaces
router.get('/', (req, res) => {
  res.json({ message: 'Get all workspaces endpoint - TODO' });
});

// POST /api/workspaces - Create new workspace
router.post('/', (req, res) => {
  res.json({ message: 'Create workspace endpoint - TODO' });
});

// GET /api/workspaces/:id - Get workspace by ID
router.get('/:id', (req, res) => {
  res.json({ message: `Get workspace ${req.params.id} endpoint - TODO` });
});

// PATCH /api/workspaces/:id - Update workspace
router.patch('/:id', (req, res) => {
  res.json({ message: `Update workspace ${req.params.id} endpoint - TODO` });
});

// DELETE /api/workspaces/:id - Delete workspace
router.delete('/:id', (req, res) => {
  res.json({ message: `Delete workspace ${req.params.id} endpoint - TODO` });
});

// POST /api/workspaces/:id/invite - Invite member
router.post('/:id/invite', (req, res) => {
  res.json({ message: `Invite to workspace ${req.params.id} endpoint - TODO` });
});

// GET /api/workspaces/:id/members - Get workspace members
router.get('/:id/members', (req, res) => {
  res.json({ message: `Get members of workspace ${req.params.id} endpoint - TODO` });
});

export default router;
