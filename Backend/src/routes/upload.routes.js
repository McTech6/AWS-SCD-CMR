import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';
import { getPresignedUrl, deleteFile, confirmUpload, uploadPublicLogo } from '../controllers/upload.controller.js';

const router = Router();

// generate presigned url
router.post('/presigned-url', requireAuth, getPresignedUrl);

// confirm object exists and update record
router.post('/confirm', requireAuth, confirmUpload);

// public upload for sponsorship logos
router.post('/public', uploadPublicLogo);

// delete by key (admin only)
router.delete('/:key', requireAuth, requireAdmin, deleteFile);

export default router;