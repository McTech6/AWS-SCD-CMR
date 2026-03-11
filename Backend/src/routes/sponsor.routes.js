import { Router } from 'express';
import { 
    getSponsors, 
    createSponsor, 
    updateSponsor, 
    deleteSponsor, 
    applySponsor,
    approveSponsor,
    rejectSponsor
} from '../controllers/sponsor.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * @openapi
 * /sponsors:
 *   get:
 *     summary: List all sponsors (Public)
 *     tags: [Sponsors]
 */
router.get('/', getSponsors);

/**
 * @openapi
 * /sponsors/apply:
 *   post:
 *     summary: Apply for sponsorship (Public)
 *     tags: [Sponsors]
 */
router.post('/apply', applySponsor);

// Admin Routes
router.use(requireAuth, requireAdmin);

router.post('/', createSponsor);
router.patch('/:id', updateSponsor);
router.delete('/:id', deleteSponsor);

// Review actions
router.patch('/:id/approve', approveSponsor);
router.patch('/:id/reject', rejectSponsor);

export default router;
