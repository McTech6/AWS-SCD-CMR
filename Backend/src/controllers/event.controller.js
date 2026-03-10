import prisma from '../db/prisma.js';
import { eventConfigUpdateSchema } from '../utils/validation.js';

// Public - Get Config
export const getEventConfig = async (req, res, next) => {
    try {
        const config = await prisma.eventConfig.findFirst({
            where: { id: 'default' }
        });

        if (!config) {
            return res.status(404).json({ success: false, message: 'Event configuration not found' });
        }

        res.status(200).json({ success: true, data: config });
    } catch (error) {
        next(error);
    }
};

// Admin - Update Config
export const updateEventConfig = async (req, res, next) => {
    try {
        const validated = eventConfigUpdateSchema.parse(req.body);

        const data = { ...validated };
        if (validated.eventDate) data.eventDate = new Date(validated.eventDate);
        if (validated.eventEndDate) data.eventEndDate = new Date(validated.eventEndDate);

        const config = await prisma.eventConfig.upsert({
            where: { id: 'default' },
            update: data,
            create: {
                id: 'default',
                eventName: 'AWS Cloud Club Student Community Day',
                eventDate: new Date(),
                venue: 'TBD',
                contactEmail: 'admin@example.com',
                ...data
            }
        });

        res.status(200).json({ success: true, data: config });
    } catch (error) {
        if (error.name === 'ZodError') return res.status(400).json({ success: false, errors: error.errors });
        next(error);
    }
};
