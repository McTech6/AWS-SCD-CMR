import prisma from '../db/prisma.js';
import { speakerApplySchema, speakerUpdateSchema } from '../utils/validation.js';
import { hashPassword } from '../utils/auth.js';
import { sendEmail } from '../../lib/email/send.js';
import { uploadBuffer } from '../utils/s3.js';
import { v4 as uuidv4 } from 'uuid';

// Public - Apply
export const applySpeaker = async (req, res, next) => {
    console.log(`🎤 New speaker application: ${req.body?.email}`);
    try {
        const validated = speakerApplySchema.parse(req.body);
        const {
            name, email, topic, talkTitle, bio,
            linkedinUrl, twitterHandle, githubUrl, track, experienceLevel, photoBase64
        } = validated;

        // 1. Check Event Config
        const config = await prisma.eventConfig.findFirst({ where: { id: 'default' } });
        if (config && !config.speakerAppsOpen) {
            return res.status(403).json({ success: false, message: 'Speaker applications are currently closed' });
        }

        // 2. Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            const speakerExists = await prisma.speaker.findUnique({ where: { userId: existingUser.id } });
            if (speakerExists) {
                return res.status(400).json({ success: false, message: 'You have already submitted a speaker application' });
            }
        }

        // 3. Create records
        const result = await prisma.$transaction(async (tx) => {
            let user = existingUser;
            if (!user) {
                user = await tx.user.create({
                    data: {
                        name,
                        email,
                        role: 'SPEAKER'
                    }
                });
            } else if (user.role === 'ATTENDEE') {
                // Upgrade attendee to speaker role
                user = await tx.user.update({
                    where: { id: user.id },
                    data: { role: 'SPEAKER' }
                });
            }

            let photoUrl = null;
            let photoKey = null;

            if (photoBase64) {
                console.log(`[SPEAKER APPLY] Received photoBase64. Length: ${photoBase64.length}`);
                try {
                    const match = photoBase64.match(/^data:(image\/\w+);base64,(.+)$/);
                    if (match) {
                        const contentType = match[1];
                        console.log(`[SPEAKER APPLY] Extracted contentType: ${contentType}`);
                        const buffer = Buffer.from(match[2], 'base64');
                        photoKey = `speaker-photos/${Date.now()}_${uuidv4()}`;
                        console.log(`[SPEAKER APPLY] Uploading photo to S3 with key: ${photoKey}`);
                        await uploadBuffer({ key: photoKey, buffer, contentType, acl: 'public-read' });
                        photoUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${photoKey}`;
                        console.log(`[SPEAKER APPLY] Successfully uploaded photo. URL: ${photoUrl}`);
                    } else {
                        console.log(`[SPEAKER APPLY] photoBase64 format did not match expected regex. Sample: ${photoBase64.substring(0, 50)}...`);
                    }
                } catch (s3err) {
                    console.error('[SPEAKER APPLY] Failed to upload speaker photo to S3:', s3err);
                }
            } else {
                console.log(`[SPEAKER APPLY] No photoBase64 provided in the request.`);
            }

            const speaker = await tx.speaker.create({
                data: {
                    userId: user.id,
                    topic,
                    talkTitle,
                    bio,
                    linkedinUrl,
                    twitterHandle,
                    githubUrl,
                    track,
                    experienceLevel,
                    photoUrl,
                    photoKey,
                    status: 'PENDING'
                }
            });

            return speaker;
        });

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            data: result
        });

    } catch (error) {
        console.error("❌ Error in applySpeaker:", error);
        if (error.name === 'ZodError') return res.status(400).json({ success: false, errors: error.errors });
        next(error);
    }
};

// Public - List Approved
export const getSpeakers = async (req, res, next) => {
    try {
        const { track, featured, search } = req.query;

        const where = {
            status: 'APPROVED',
            AND: [
                track ? { track } : {},
                featured === 'true' ? { featured: true } : {},
                search ? {
                    OR: [
                        { user: { name: { contains: search, mode: 'insensitive' } } },
                        { talkTitle: { contains: search, mode: 'insensitive' } },
                        { topic: { contains: search, mode: 'insensitive' } }
                    ]
                } : {}
            ]
        };

        const speakers = await prisma.speaker.findMany({
            where,
            include: {
                user: {
                    select: { name: true, avatarUrl: true }
                }
            },
            orderBy: [
                { featured: 'desc' },
                { sortOrder: 'asc' },
                { submittedAt: 'desc' }
            ]
        });

        res.status(200).json({ success: true, data: speakers });
    } catch (error) {
        next(error);
    }
};

// Admin - List All
export const getAllSpeakers = async (req, res, next) => {
    try {
        const { status, track, search, page = 1, limit = 20 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        const where = {
            AND: [
                status ? { status } : {},
                track ? { track } : {},
                search ? {
                    OR: [
                        { user: { name: { contains: search, mode: 'insensitive' } } },
                        { user: { email: { contains: search, mode: 'insensitive' } } },
                        { talkTitle: { contains: search, mode: 'insensitive' } }
                    ]
                } : {}
            ]
        };

        const [speakers, total] = await prisma.$transaction([
            prisma.speaker.findMany({
                where,
                skip,
                take,
                include: { user: true },
                orderBy: { submittedAt: 'desc' }
            }),
            prisma.speaker.count({ where })
        ]);

        res.status(200).json({
            success: true,
            data: speakers,
            meta: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / take) }
        });
    } catch (error) {
        next(error);
    }
};

// Public/Admin - Single
export const getSpeakerById = async (req, res, next) => {
    try {
        const speaker = await prisma.speaker.findUnique({
            where: { id: req.params.id },
            include: { user: true }
        });

        if (!speaker) return res.status(404).json({ success: false, message: 'Speaker not found' });

        // If not admin and not approved, hide
        if (req.user?.role !== 'ADMIN' && speaker.status !== 'APPROVED') {
            return res.status(404).json({ success: false, message: 'Speaker not found' });
        }

        res.status(200).json({ success: true, data: speaker });
    } catch (error) {
        next(error);
    }
};

// Admin - Approve
export const approveSpeaker = async (req, res, next) => {
    try {
        const speaker = await prisma.speaker.update({
            where: { id: req.params.id },
            data: {
                status: 'APPROVED',
                reviewedAt: new Date(),
                reviewedBy: req.user.id
            },
            include: { user: true }
        });

        console.log(`\n========================================`);
        console.log(`[SPEAKER APPROVAL] Initiated for Speaker ID: ${req.params.id}`);
        console.log(`[SPEAKER APPROVAL] Found and updated speaker: ${speaker.user.name} (${speaker.user.email})`);

        // Send approval email
        try {
            console.log(`[SPEAKER EMAIL] Attempting to send approval email to: ${speaker.user.email}`);
            await sendEmail({
                to: speaker.user.email,
                subject: 'Speaker Application Approved - AWS Student Community Day',
                template: 'speaker-approved',
                variables: {
                    name: speaker.user.name,
                    talkTitle: speaker.talkTitle
                }
            });
            console.log(`[SPEAKER EMAIL] Successfully sent email to: ${speaker.user.email}`);

            await prisma.emailLog.create({
                data: {
                    subject: 'Speaker Application Approved - AWS Student Community Day',
                    body: `Talk: ${speaker.talkTitle}`,
                    target: 'CUSTOM',
                    status: 'SENT',
                    recipientCount: 1,
                    successCount: 1,
                    sentAt: new Date(),
                    sentBy: req.user.id,
                    recipients: {
                        create: {
                            recipientEmail: speaker.user.email,
                            recipientName: speaker.user.name,
                            delivered: true,
                            deliveredAt: new Date()
                        }
                    }
                }
            });
        } catch (emailError) {
            console.error(`[SPEAKER EMAIL ERROR] Failed to send/log approval email to ${speaker.user.email}`, emailError);
        }
        console.log(`========================================\n`);

        res.status(200).json({ success: true, message: 'Speaker approved and notified', data: speaker });
    } catch (error) {
        next(error);
    }
};

// Admin - Reject
export const rejectSpeaker = async (req, res, next) => {
    try {
        const { reviewNote } = req.body;
        if (!reviewNote) return res.status(400).json({ success: false, message: 'Review note is required for rejection' });

        const speaker = await prisma.speaker.update({
            where: { id: req.params.id },
            data: {
                status: 'REJECTED',
                reviewNote,
                reviewedAt: new Date(),
                reviewedBy: req.user.id
            },
            include: { user: true }
        });

        console.log(`\n========================================`);
        console.log(`[SPEAKER REJECTION] Initiated for Speaker ID: ${req.params.id}`);
        console.log(`[SPEAKER REJECTION] Found and updated speaker: ${speaker.user.name} (${speaker.user.email})`);

        // Send rejection email
        try {
            console.log(`[SPEAKER EMAIL] Attempting to send rejection email to: ${speaker.user.email}`);
            await sendEmail({
                to: speaker.user.email,
                subject: 'Speaker Application Update - AWS Student Community Day',
                template: 'speaker-rejected',
                variables: {
                    name: speaker.user.name,
                    reviewNote: reviewNote
                }
            });
            console.log(`[SPEAKER EMAIL] Successfully sent email to: ${speaker.user.email}`);

            await prisma.emailLog.create({
                data: {
                    subject: 'Speaker Application Update - AWS Student Community Day',
                    body: `Reviewer Note: ${reviewNote}`,
                    target: 'CUSTOM',
                    status: 'SENT',
                    recipientCount: 1,
                    successCount: 1,
                    sentAt: new Date(),
                    sentBy: req.user.id,
                    recipients: {
                        create: {
                            recipientEmail: speaker.user.email,
                            recipientName: speaker.user.name,
                            delivered: true,
                            deliveredAt: new Date()
                        }
                    }
                }
            });
        } catch (emailError) {
            console.error(`[SPEAKER EMAIL ERROR] Failed to send/log rejection email to ${speaker.user.email}`, emailError);
        }
        console.log(`========================================\n`);

        res.status(200).json({ success: true, message: 'Speaker rejected and notified', data: speaker });
    } catch (error) {
        next(error);
    }
};

// Admin - Update
export const updateSpeaker = async (req, res, next) => {
    try {
        const validated = speakerUpdateSchema.parse(req.body);
        const speaker = await prisma.speaker.update({
            where: { id: req.params.id },
            data: validated
        });

        res.status(200).json({ success: true, data: speaker });
    } catch (error) {
        if (error.name === 'ZodError') return res.status(400).json({ success: false, errors: error.errors });
        next(error);
    }
};

// Admin - Feature Toggle
export const featureSpeaker = async (req, res, next) => {
    try {
        const speaker = await prisma.speaker.findUnique({ where: { id: req.params.id } });
        if (!speaker) return res.status(404).json({ success: false, message: 'Speaker not found' });

        const updated = await prisma.speaker.update({
            where: { id: req.params.id },
            data: { featured: !speaker.featured }
        });

        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        next(error);
    }
};

// Admin - Delete
export const deleteSpeaker = async (req, res, next) => {
    try {
        // We delete the speaker record. 
        // Note: We might want to keep the user record if they are also an attendee,
        // but the Phase 3 requirement says "Delete speaker + cascade cleanup".
        // In schema, User -> Speaker is Cascade.
        // If we delete the user, the speaker is deleted.
        // If we delete the speaker, the user remains.

        const speaker = await prisma.speaker.findUnique({ where: { id: req.params.id } });
        if (!speaker) return res.status(404).json({ success: false, message: 'Speaker not found' });

        await prisma.speaker.delete({ where: { id: req.params.id } });

        res.status(200).json({ success: true, message: 'Speaker deleted successfully' });
    } catch (error) {
        next(error);
    }
};
