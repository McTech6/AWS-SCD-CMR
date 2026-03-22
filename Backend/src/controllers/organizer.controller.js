import prisma from '../db/prisma.js';
import { organizerSchema, organizerUpdateSchema } from '../utils/validation.js';
import { uploadImage } from '../utils/cloudinary.js';

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

export const deleteOrganizer = async (req, res, next) => {
    try {
        await prisma.organizer.delete({ where: { id: req.params.id } });
        res.status(200).json({ success: true, message: 'Organizer profile deleted' });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /organizers/:id/upload-image
 * Accepts a base64-encoded image, uploads it to Cloudinary, and stores the URL.
 */
export const uploadOrganizerImage = async (req, res, next) => {
    try {
        const { imageBase64 } = req.body;
        if (!imageBase64) {
            return res.status(400).json({ success: false, message: 'No image data provided' });
        }

        const { url } = await uploadImage(imageBase64, 'organizers');

        const organizer = await prisma.organizer.update({
            where: { id: req.params.id },
            data: { imageUrl: url }
        });

        res.status(200).json({ success: true, data: { imageUrl: url, organizer } });
    } catch (error) {
        next(error);
    }
};
