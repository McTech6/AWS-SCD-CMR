import { Router } from 'express';
import { getEventConfig, updateEventConfig, getDashboardStats, getPublicStats } from '../controllers/event.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * @openapi
 * /event:
 *   get:
 *     summary: Get public event configuration
 *     tags: [Event]
 *     responses:
 *       200:
 *         description: Event settings returned successfully
 */
router.get('/', getEventConfig);
router.get('/stats', getPublicStats);

// Admin Routes
router.get('/dashboard', requireAuth, requireAdmin, getDashboardStats);
router.patch('/', requireAuth, requireAdmin, updateEventConfig);

export default router;
