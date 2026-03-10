import prisma from '../db/prisma.js';
import { sponsorSchema, sponsorUpdateSchema } from '../utils/validation.js';

// Public - List
export const getSponsors = async (req, res, next) => {
    try {
        const sponsors = await prisma.sponsor.findMany({
            where: { visible: true },
            orderBy: [
                { tier: 'desc' }, // Enums order might need care, but Gold/Silver/Community
                { sortOrder: 'asc' }
            ]
        });

        // Grouping by tier if needed by frontend
        const grouped = {
            GOLD: sponsors.filter(s => s.tier === 'GOLD'),
            SILVER: sponsors.filter(s => s.tier === 'SILVER'),
            COMMUNITY: sponsors.filter(s => s.tier === 'COMMUNITY'),
            OTHER: sponsors.filter(s => !s.tier)
        };

        res.status(200).json({ success: true, data: sponsors, grouped });
    } catch (error) {
        next(error);
    }
};

// Admin - Create
export const createSponsor = async (req, res, next) => {
    try {
        const validated = sponsorSchema.parse(req.body);
        const sponsor = await prisma.sponsor.create({ data: validated });
        res.status(201).json({ success: true, data: sponsor });
    } catch (error) {
        if (error.name === 'ZodError') return res.status(400).json({ success: false, errors: error.errors });
        next(error);
    }
};

// Admin - Update
export const updateSponsor = async (req, res, next) => {
    try {
        const validated = sponsorUpdateSchema.parse(req.body);
        const sponsor = await prisma.sponsor.update({
            where: { id: req.params.id },
            data: validated
        });
        res.status(200).json({ success: true, data: sponsor });
    } catch (error) {
        if (error.name === 'ZodError') return res.status(400).json({ success: false, errors: error.errors });
        next(error);
    }
};

// Admin - Delete
export const deleteSponsor = async (req, res, next) => {
    try {
        await prisma.sponsor.delete({ where: { id: req.params.id } });
        res.status(200).json({ success: true, message: 'Sponsor deleted' });
    } catch (error) {
        next(error);
    }
};
