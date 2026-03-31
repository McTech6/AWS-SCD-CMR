import prisma from '../db/prisma.js'
import { volunteerApplySchema, volunteerUpdateSchema } from '../utils/validation.js'
import { sendEmail } from '../../lib/email/send.js'

// ===============================
// APPLY VOLUNTEER
// ===============================
export const applyVolunteer = async (req, res, next) => {
    try {
        // Check if volunteer applications are open
        const config = await prisma.eventConfig.findFirst({
            where: { id: 'default' }
        });

        if (config && !config.volunteerAppsOpen) {
            return res.status(403).json({
                success: false,
                message: 'Volunteer applications are currently closed',
            });
        }

        const validated = volunteerApplySchema.parse(req.body);

        const {
            name,
            email,
            phone,
            university,
            cloudClub,
            skills
        } = validated;

        // check existing user or create
        let user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    name,
                    email,
                    role: "ATTENDEE" // Volunteers start as attendees unless upgraded
                }
            });
        }

        // check if already a volunteer
        const existingVolunteer = await prisma.volunteer.findUnique({
            where: { userId: user.id }
        });

        if (existingVolunteer) {
            return res.status(400).json({
                success: false,
                message: "You have already applied as a volunteer"
            });
        }

        const volunteer = await prisma.volunteer.create({
            data: {
                userId: user.id,
                phone,
                university,
                cloudClub,
                skills,
                status: "PENDING"
            }
        });

        res.status(201).json({
            success: true,
            message: "Volunteer application submitted",
            data: volunteer
        });

    } catch (error) {
        next(error);
    }
};

// ===============================
// GET ALL VOLUNTEERS (ADMIN)
// ===============================
export const getAllVolunteers = async (req, res, next) => {
    try {
        const volunteers = await prisma.volunteer.findMany({
            include: { user: true },
            orderBy: { submittedAt: 'desc' }
        });
        res.json({ success: true, data: volunteers });
    } catch (error) {
        next(error);
    }
};

// ===============================
// APPROVE VOLUNTEER
// ===============================
export const approveVolunteer = async (req, res, next) => {
    try {
        const { whatsappLink } = req.body;

        const volunteer = await prisma.volunteer.update({
            where: { id: req.params.id },
            data: {
                status: "APPROVED",
                whatsappLink,
                reviewedAt: new Date(),
                reviewedBy: req.user.id
            },
            include: { user: true }
        });

        // Send acceptance email
        try {
            await sendEmail({
                to: volunteer.user.email,
                subject: "Welcome to AWS SCD Volunteer Team!",
                template: "volunteer-approved",
                variables: {
                    name: volunteer.user.name,
                    whatsappLink: whatsappLink || "Will be shared soon"
                }
            });
        } catch (err) {
            console.error("Email failed:", err);
        }

        res.json({ success: true, message: "Volunteer approved", data: volunteer });
    } catch (error) {
        next(error);
    }
};

// ===============================
// REJECT VOLUNTEER
// ===============================
export const rejectVolunteer = async (req, res, next) => {
    try {
        const { reviewNote } = req.body;
        const volunteer = await prisma.volunteer.update({
            where: { id: req.params.id },
            data: {
                status: "REJECTED",
                reviewNote,
                reviewedAt: new Date(),
                reviewedBy: req.user.id
            }
        });
        res.json({ success: true, data: volunteer });
    } catch (error) {
        next(error);
    }
};

// ===============================
// DELETE VOLUNTEER
// ===============================
export const deleteVolunteer = async (req, res, next) => {
    try {
        await prisma.volunteer.delete({
            where: { id: req.params.id }
        });
        res.json({ success: true, message: "Volunteer deleted successfully" });
    } catch (error) {
        next(error);
    }
};
