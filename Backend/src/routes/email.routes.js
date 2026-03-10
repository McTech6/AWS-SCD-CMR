import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';
import { sendEmails, listEmailLogs, getEmailLog, previewTemplate } from '../controllers/email.controller.js';

const router = Router();

router.post('/send', requireAuth, requireAdmin, sendEmails);
router.get('/', requireAuth, requireAdmin, listEmailLogs);
router.get('/:id', requireAuth, requireAdmin, getEmailLog);
router.post('/preview', requireAuth, requireAdmin, previewTemplate);

export default router;
