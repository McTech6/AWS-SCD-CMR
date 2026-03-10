import { Router } from 'express';
import {
    register,
    login,
    logout,
    getMe,
    refresh
} from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, university]
 *             properties:
 *               name: { type: string, example: "John Doe" }
 *               email: { type: string, example: "john@example.com" }
 *               password: { type: string, example: "securepassword123" }
 *               university: { type: string, example: "Makerere University" }
 *               phone: { type: string, example: "+25600000000" }
 *               tshirtSize: { type: string, enum: ["XS", "S", "M", "L", "XL", "XXL"], default: "M" }
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation failed or User exists
 */
router.post('/register', register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login for access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: "john@example.com" }
 *               password: { type: string, example: "securepassword123" }
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', login);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Logout current user
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', logout);

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     summary: Refresh JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [sessionToken]
 *             properties:
 *               sessionToken: { type: string }
 *     responses:
 *       200:
 *         description: Token refreshed
 *       401:
 *         description: Session expired
 */
router.post('/refresh', refresh);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Get current logged-in user details
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile returned
 *       401:
 *         description: Unauthorized
 */
router.get('/me', requireAuth, getMe);

export default router;
