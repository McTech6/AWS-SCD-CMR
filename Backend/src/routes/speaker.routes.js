import { Router } from 'express';
import {
    applySpeaker,
    getSpeakers,
    getAllSpeakers,
    getSpeakerById,
    approveSpeaker,
    rejectSpeaker,
    updateSpeaker,
    featureSpeaker,
    deleteSpeaker
} from '../controllers/speaker.controller.js';
import { requireAuth, requireAdmin, optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * @openapi
 * /speakers/apply:
 *   post:
 *     summary: Apply as a speaker for the event
 *     tags: [Speakers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, topic, talkTitle, bio, linkedinUrl]
 *             properties:
 *               name: { type: string, example: "Dr. Cloud" }
 *               email: { type: string, example: "dr.cloud@gmail.com" }
 *               password: { type: string, example: "securepw123" }
 *               topic: { type: string, example: "Architecting serverless apps" }
 *               talkTitle: { type: string, example: "Mastering AWS Lambda in 2026" }
 *               bio: { type: string, example: "AWS Community Hero with 10+ years exp..." }
 *               linkedinUrl: { type: string, example: "https://linkedin.com/in/drcloud" }
 *               twitterHandle: { type: string, example: "@drcloud" }
 *               githubUrl: { type: string, example: "https://github.com/drcloud" }
 *               track: { type: string, enum: ["CLOUD_FUNDAMENTALS", "DEVOPS", "AI_ML", "SECURITY", "OPEN_SOURCE"] }
 *               experienceLevel: { type: string, enum: ["ZERO_TO_ONE", "ONE_TO_THREE", "THREE_TO_FIVE", "FIVE_PLUS"] }
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *       403:
 *         description: Speaker applications are closed
 */
router.post('/apply', applySpeaker);

/**
 * @openapi
 * /speakers:
 *   get:
 *     summary: List all approved speakers (Public)
 *     tags: [Speakers]
 *     parameters:
 *       - in: query
 *         name: track
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: featured
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: List of approved speakers with names and social links
 */
router.get('/', getSpeakers);

// Admin Routes - MUST come before /:id route
router.get('/all', requireAuth, requireAdmin, getAllSpeakers);

/**
 * @openapi
 * /speakers/{id}:
 *   get:
 *     summary: Get speaker details
 *     tags: [Speakers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Speaker details
 *       404:
 *         description: Speaker not found or not approved
 */
router.get('/:id', optionalAuth, getSpeakerById);

// Other Admin Routes
router.use(requireAuth, requireAdmin);

router.patch('/:id/approve', approveSpeaker);

router.patch('/:id/reject', rejectSpeaker);

router.patch('/:id/feature', featureSpeaker);

router.patch('/:id', updateSpeaker);

router.delete('/:id', deleteSpeaker);

export default router;
