import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';
import { generateCertificates, generateCertificateForAttendee, sendCertificates, getCertificate, getCertificateStats } from '../controllers/certificates.controller.js';

const router = Router();

router.post('/generate', requireAuth, requireAdmin, generateCertificates);
router.post('/generate/:attendeeId', requireAuth, requireAdmin, generateCertificateForAttendee);
router.post('/send', requireAuth, requireAdmin, sendCertificates);
router.get('/:attendeeId', requireAuth, requireAdmin, getCertificate);
router.get('/stats', requireAuth, requireAdmin, getCertificateStats);

export default router;
