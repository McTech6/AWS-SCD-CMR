import { Router } from 'express';
import { getSponsors, createSponsor, updateSponsor, deleteSponsor } from '../controllers/sponsor.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * @openapi
 * /sponsors:
 *   get:
 *     summary: List all sponsors (Public)
 *     tags: [Sponsors]
 *     responses:
 *       200:
 *         description: List of visible sponsors grouped by tier
 */
router.get('/', getSponsors);

// Admin Routes
router.use(requireAuth, requireAdmin);

/**
 * @openapi
 * /sponsors:
 *   post:
 *     summary: Create a new sponsor (Admin)
 *     tags: [Sponsors]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, logoUrl]
 *             properties:
 *               name: { type: string, example: "Amazon Web Services" }
 *               logoUrl: { type: string, example: "https://aws.amazon.com/logo.png" }
 *               website: { type: string, example: "https://aws.amazon.com" }
 *               tier: { type: string, enum: ["GOLD", "SILVER", "COMMUNITY"] }
 *     responses:
 *       201:
 *         description: Sponsor created
 */
router.post('/', createSponsor);

/**
 * @openapi
 * /sponsors/{id}:
 *   patch:
 *     summary: Update sponsor details (Admin)
 *     tags: [Sponsors]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               tier: { type: string }
 *               visible: { type: boolean }
 *     responses:
 *       200:
 *         description: Sponsor updated successfully
 */
router.patch('/:id', updateSponsor);

/**
 * @openapi
 * /sponsors/{id}:
 *   delete:
 *     summary: Delete a sponsor (Admin)
 *     tags: [Sponsors]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Sponsor deleted
 */
router.delete('/:id', deleteSponsor);

export default router;
