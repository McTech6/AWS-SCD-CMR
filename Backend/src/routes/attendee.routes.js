import { Router } from 'express';
import {
    registerAttendee,
    getAttendees,
    getAttendeeById,
    checkInAttendee,
    updateSwag,
    deleteAttendee,
    getAttendeeStats,
    getAttendeesForUI,
    getAttendeeByEmail
} from '../controllers/attendee.controller.js';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * @openapi
 * /attendees/register:
 *   post:
 *     summary: Register an attendee for the event
 *     tags: [Attendees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, university]
 *             properties:
 *               name: { type: string, example: "Jane Doe" }
 *               email: { type: string, example: "jane@example.com" }
 *               university: { type: string, example: "Stanford" }
 *               phone: { type: string, example: "+1234567890" }
 *               tshirtSize: { type: string, enum: ["XS", "S", "M", "L", "XL", "XXL"], default: "M" }
 *     responses:
 *       201:
 *         description: Registered successfully
 *       403:
 *         description: Registration closed or capacity full
 */
router.post('/register', registerAttendee);

// Check if email is already registered (for payment flow)
router.post('/lookup', getAttendeeByEmail);

// Admin only routes
router.use(requireAuth, requireAdmin);

// UI-specific listing (same as / but provided as distinct path for frontend)
router.get('/ui', getAttendeesForUI);

/**
 * @openapi
 * /attendees:
 *   get:
 *     summary: List all attendees (Admin)
 *     tags: [Attendees]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: university
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: export
 *         schema: { type: boolean, default: false }
 *     responses:
 *       200:
 *         description: Paginated list or CSV stream
 */
router.get('/', getAttendees);

/**
 * @openapi
 * /attendees/stats:
 *   get:
 *     summary: Get attendee metrics (Admin)
 *     tags: [Attendees]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Metrics for registrations, check-ins, and swag
 */
router.get('/stats', getAttendeeStats);

/**
 * @openapi
 * /attendees/{id}:
 *   get:
 *     summary: Get attendee details (Admin)
 *     tags: [Attendees]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Attendee details with swag and certificate info
 */
router.get('/:id', getAttendeeById);

/**
 * @openapi
 * /attendees/{id}/checkin:
 *   patch:
 *     summary: Toggle attendee check-in status (Admin)
 *     tags: [Attendees]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Check-in toggled successfully
 */
router.patch('/:id/checkin', checkInAttendee);

/**
 * @openapi
 * /attendees/{id}/swag:
 *   patch:
 *     summary: Update swag collection record (Admin)
 *     tags: [Attendees]
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
 *               tshirt: { type: boolean }
 *               stickers: { type: boolean }
 *               notebook: { type: boolean }
 *               badge: { type: boolean }
 *               pen: { type: boolean }
 *               wristband: { type: boolean }
 *     responses:
 *       200:
 *         description: Swag record updated
 */
router.patch('/:id/swag', updateSwag);

/**
 * @openapi
 * /attendees/{id}:
 *   delete:
 *     summary: Delete an attendee and associated user (Admin)
 *     tags: [Attendees]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Attendee deleted successfully
 */
router.delete('/:id', deleteAttendee);

export default router;
