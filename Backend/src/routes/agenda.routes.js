import { Router } from 'express';
import {
    getAgendaItems,
    createAgendaItem,
    updateAgendaItem,
    deleteAgendaItem
} from '../controllers/agenda.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * @openapi
 * /agenda:
 *   get:
 *     summary: List all agenda items
 *     tags: [Agenda]
 *     parameters:
 *       - in: query
 *         name: track
 *         schema: { type: string, enum: ["MAIN_STAGE", "WORKSHOP", "PANEL", "NETWORKING", "OPENING", "CLOSING"] }
 *     responses:
 *       200:
 *         description: List of scheduled events sorted chronologically
 */
router.get('/', getAgendaItems);

// Admin Routes
router.use(requireAuth, requireAdmin);

/**
 * @openapi
 * /agenda:
 *   post:
 *     summary: Create a new agenda item (Admin)
 *     tags: [Agenda]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title: { type: string, example: "Keynote" }
 *               description: { type: string }
 *               startTime: { type: string, format: "date-time" }
 *               endTime: { type: string, format: "date-time" }
 *               track: { type: string, enum: ["MAIN_STAGE", "WORKSHOP", "PANEL", "NETWORKING", "OPENING", "CLOSING"] }
 *               speakerId: { type: string }
 *               sortOrder: { type: integer }
 *     responses:
 *       201:
 *         description: Agenda item created
 */
router.post('/', createAgendaItem);

/**
 * @openapi
 * /agenda/{id}:
 *   patch:
 *     summary: Update an agenda item (Admin)
 *     tags: [Agenda]
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
 *               title: { type: string }
 *               track: { type: string }
 *               sortOrder: { type: integer }
 *     responses:
 *       200:
 *         description: Agenda item updated successfully
 */
router.patch('/:id', updateAgendaItem);

/**
 * @openapi
 * /agenda/{id}:
 *   delete:
 *     summary: Delete an agenda item (Admin)
 *     tags: [Agenda]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Agenda item deleted
 */
router.delete('/:id', deleteAgendaItem);

export default router;
