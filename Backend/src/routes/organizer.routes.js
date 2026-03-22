import { Router } from 'express';
import { 
    getOrganizers, 
    createOrganizer, 
    updateOrganizer, 
    deleteOrganizer,
    uploadOrganizerImage
} from '../controllers/organizer.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

// Public routes
router.get('/', getOrganizers);

// Admin routes
router.post('/', requireAuth, requireAdmin, createOrganizer);
router.patch('/:id', requireAuth, requireAdmin, updateOrganizer);
router.delete('/:id', requireAuth, requireAdmin, deleteOrganizer);
router.post('/:id/upload-image', requireAuth, requireAdmin, uploadOrganizerImage);

export default router;
