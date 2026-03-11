import prisma from '../db/prisma.js';
import { sponsorSchema, sponsorUpdateSchema, sponsorApplySchema } from '../utils/validation.js';
import { sendEmail } from '../../lib/email/send.js';

/**
 * @openapi
 * /sponsors:
 *   get:
 *     summary: List all sponsors (Public defaults to Approved)
 *     tags: [Sponsors]
 */
export const getSponsors = async (req, res, next) => {
    try {
        const { all, status } = req.query;
        const where = {};
        
        // Admin view can filter by status or see all
        if (all === 'true') {
            if (status) where.status = status;
        } else {
            // Public view only sees APPROVED and VISIBLE sponsors
            where.status = 'APPROVED';
            where.visible = true;
        }

        const sponsors = await prisma.sponsor.findMany({
            where,
            orderBy: [
                { tier: 'asc' },
                { sortOrder: 'asc' }
            ]
        });

        // If not admin, hide sensitive contact info
        const safeSponsors = all === 'true' ? sponsors : sponsors.map(s => {
            const { contactName, contactEmail, status, ...rest } = s;
            return rest;
        });

        // Grouping for landing page logic
        const grouped = {
            GOLD: safeSponsors.filter(s => s.tier === 'GOLD'),
            SILVER: safeSponsors.filter(s => s.tier === 'SILVER'),
            COMMUNITY: safeSponsors.filter(s => s.tier === 'COMMUNITY'),
            OTHER: safeSponsors.filter(s => !s.tier)
        };

        res.status(200).json({ success: true, data: safeSponsors, grouped });
    } catch (error) {
        next(error);
    }
};

/**
 * @openapi
 * /sponsors/apply:
 *   post:
 *     summary: Apply for sponsorship (Public)
 *     tags: [Sponsors]
 */
export const applySponsor = async (req, res, next) => {
    try {
        const validated = sponsorApplySchema.parse(req.body);
        const sponsor = await prisma.sponsor.create({
            data: {
                ...validated,
                status: 'PENDING',
                visible: false // Hidden until approved
            }
        });
        res.status(201).json({ 
            success: true, 
            message: 'Application received. We will contact you soon!',
            data: sponsor 
        });
    } catch (error) {
        if (error.name === 'ZodError') return res.status(400).json({ success: false, errors: error.errors });
        next(error);
    }
};

// Admin - Create (Directly approved)
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

// Admin - Update (Handles status changes too)
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
        res.status(200).json({ success: true, message: 'Sponsor record removed' });
    } catch (error) {
        next(error);
    }
};

// Admin - Review Actions
export const approveSponsor = async (req, res, next) => {
    try {
        const { tier } = req.body;
        const sponsor = await prisma.sponsor.update({
            where: { id: req.params.id },
            data: { 
                status: 'APPROVED', 
                visible: true,
                tier: tier || 'COMMUNITY'
            }
        });

        // Send Email if contact info exists
        if (sponsor.contactEmail) {
            try {
                await sendEmail({
                    to: sponsor.contactEmail,
                    subject: `Welcome to the Hub - Partnership Approved for ${sponsor.name}`,
                    template: 'sponsor-approved',
                    variables: {
                        name: sponsor.name,
                        contactName: sponsor.contactName || 'Partner',
                        tier: sponsor.tier,
                        website: sponsor.website || '#'
                    }
                });
            } catch (emailErr) {
                console.error('Failed to send approval email:', emailErr);
            }
        }

        res.status(200).json({ success: true, message: 'Sponsor approved and notified', data: sponsor });
    } catch (error) {
        next(error);
    }
};

export const rejectSponsor = async (req, res, next) => {
    try {
        const sponsor = await prisma.sponsor.update({
            where: { id: req.params.id },
            data: { status: 'REJECTED', visible: false }
        });

        // Send Email if contact info exists
        if (sponsor.contactEmail) {
            try {
                await sendEmail({
                    to: sponsor.contactEmail,
                    subject: `Update on your Sponsorship Application: ${sponsor.name}`,
                    template: 'sponsor-rejected',
                    variables: {
                        name: sponsor.name,
                        contactName: sponsor.contactName || 'Partner'
                    }
                });
            } catch (emailErr) {
                console.error('Failed to send rejection email:', emailErr);
            }
        }

        res.status(200).json({ success: true, message: 'Application rejected and notified', data: sponsor });
    } catch (error) {
        next(error);
    }
};
