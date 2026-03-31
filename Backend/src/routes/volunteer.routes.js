import express from 'express';
import { applyVolunteer, getAllVolunteers, approveVolunteer, rejectVolunteer, deleteVolunteer } from '../controllers/volunteer.controller.js';
import { requireAdmin, requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public apply route
router.post('/apply', applyVolunteer);

// Admin management routes
router.get('/all', requireAuth, requireAdmin, getAllVolunteers);
router.patch('/:id/approve', requireAuth, requireAdmin, approveVolunteer);
router.patch('/:id/reject', requireAuth, requireAdmin, rejectVolunteer);
router.delete('/:id', requireAuth, requireAdmin, deleteVolunteer);

export default router;
