import prisma from '../db/prisma.js';
import { agendaSchema, agendaUpdateSchema } from '../utils/validation.js';

// Public - List
export const getAgendaItems = async (req, res, next) => {
    try {
        const { track } = req.query;

        const items = await prisma.agendaItem.findMany({
            where: track ? { track } : {},
            orderBy: [
                { startTime: 'asc' },
                { sortOrder: 'asc' }
            ]
        });

        res.status(200).json({ success: true, data: items });
    } catch (error) {
        next(error);
    }
};

// Admin - Create
export const createAgendaItem = async (req, res, next) => {
    try {
        const validated = agendaSchema.parse(req.body);

        const item = await prisma.agendaItem.create({
            data: {
                ...validated,
                startTime: validated.startTime ? new Date(validated.startTime) : null,
                endTime: validated.endTime ? new Date(validated.endTime) : null,
            }
        });

        res.status(201).json({ success: true, data: item });
    } catch (error) {
        if (error.name === 'ZodError') return res.status(400).json({ success: false, errors: error.errors });
        next(error);
    }
};

// Admin - Update
export const updateAgendaItem = async (req, res, next) => {
    try {
        const validated = agendaUpdateSchema.parse(req.body);

        const data = { ...validated };
        if (validated.startTime) data.startTime = new Date(validated.startTime);
        if (validated.endTime) data.endTime = new Date(validated.endTime);

        const item = await prisma.agendaItem.update({
            where: { id: req.params.id },
            data
        });

        res.status(200).json({ success: true, data: item });
    } catch (error) {
        if (error.name === 'ZodError') return res.status(400).json({ success: false, errors: error.errors });
        next(error);
    }
};

// Admin - Delete
export const deleteAgendaItem = async (req, res, next) => {
    try {
        await prisma.agendaItem.delete({
            where: { id: req.params.id }
        });

        res.status(200).json({ success: true, message: 'Agenda item deleted' });
    } catch (error) {
        next(error);
    }
};
