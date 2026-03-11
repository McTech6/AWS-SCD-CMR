import prisma from '../db/prisma.js';
import { organizerSchema, organizerUpdateSchema } from '../utils/validation.js';

/**
 * @openapi
 * /organizers:
 *   get:
 *     summary: List all organizers
 *     tags: [Organizers]
 */
export const getOrganizers = async (req, res, next) => {
    try {
        const { all } = req.query;
        const where = all === 'true' ? {} : { visible: true };

        const organizers = await prisma.organizer.findMany({
            where,
            orderBy: { sortOrder: 'asc' }
        });

        res.status(200).json({ success: true, data: organizers });
    } catch (error) {
        next(error);
    }
};

/**
 * @openapi
 * /organizers:
 *   post:
 *     summary: Create an organizer profile (Admin)
 *     tags: [Organizers]
 */
export const createOrganizer = async (req, res, next) => {
    try {
        const validated = organizerSchema.parse(req.body);
        const organizer = await prisma.organizer.create({ data: validated });
        res.status(201).json({ success: true, data: organizer });
    } catch (error) {
        if (error.name === 'ZodError') return res.status(400).json({ success: false, errors: error.errors });
        next(error);
    }
};

/**
 * @openapi
 * /organizers/{id}:
 *   patch:
 *     summary: Update an organizer profile (Admin)
 *     tags: [Organizers]
 */
export const updateOrganizer = async (req, res, next) => {
    try {
        const validated = organizerUpdateSchema.parse(req.body);
        const organizer = await prisma.organizer.update({
            where: { id: req.params.id },
            data: validated
        });
        res.status(200).json({ success: true, data: organizer });
    } catch (error) {
        if (error.name === 'ZodError') return res.status(400).json({ success: false, errors: error.errors });
        next(error);
    }
};

/**
 * @openapi
 * /organizers/{id}:
 *   delete:
 *     summary: Remove an organizer profile (Admin)
 *     tags: [Organizers]
 */
export const deleteOrganizer = async (req, res, next) => {
    try {
        await prisma.organizer.delete({ where: { id: req.params.id } });
        res.status(200).json({ success: true, message: 'Organizer profile deleted' });
    } catch (error) {
        next(error);
    }
};
