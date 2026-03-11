import { Router } from 'express';
import { 
    getOrganizers, 
    createOrganizer, 
    updateOrganizer, 
    deleteOrganizer 
} from '../controllers/organizer.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes
router.get('/', getOrganizers);

// Admin routes
router.post('/', requireAuth, requireAdmin, createOrganizer);
router.patch('/:id', requireAuth, requireAdmin, updateOrganizer);
router.delete('/:id', requireAuth, requireAdmin, deleteOrganizer);

export default router;
