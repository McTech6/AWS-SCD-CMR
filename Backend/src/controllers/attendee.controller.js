import prisma from '../db/prisma.js';
import { registerSchema, swagUpdateSchema, attendeeUpdateSchema } from '../utils/validation.js';
import { hashPassword, generateToken } from '../utils/auth.js';
import { sendEmail } from '../../lib/email/send.js';
// import { generateTicket } from '../../lib/ticket/generator.js';

// Public/Regisration
export const registerAttendee = async (req, res, next) => {
    console.log(`🎟️ New event registration: ${req.body?.email}`);
    try {
        const validatedData = registerSchema.parse(req.body);
        let { name, email, university, phone, tshirtSize } = validatedData;
        email = email.toLowerCase();

        // 1. Check Event Config for capacity and status
        const config = await prisma.eventConfig.findFirst({
            where: { id: 'default' }
        });

        if (config && !config.registrationOpen) {
            return res.status(403).json({
                success: false,
                message: 'Registration is currently closed'
            });
        }

        const count = await prisma.attendee.count();
        if (config && count >= config.maxAttendees) {
            return res.status(403).json({
                success: false,
                message: 'Event is at full capacity'
            });
        }

        // 2. Check duplicate attendee
        const existingUser = await prisma.user.findUnique({
            where: { email },
            include: { attendee: true }
        });

        if (existingUser && existingUser.attendee) {
            return res.status(409).json({
                success: false,
                message: 'This email is already registered as an attendee for the event'
            });
        }

        // 3. Create records in transaction
        const result = await prisma.$transaction(async (tx) => {
            let user = existingUser;
            
            if (!user) {
                user = await tx.user.create({
                    data: {
                        name,
                        email,
                        role: 'ATTENDEE'
                    }
                });
            }

            const attendee = await tx.attendee.create({
                data: {
                    userId: user.id,
                    university,
                    phone,
                    tshirtSize,
                }
            });

            const swag = await tx.swagRecord.create({
                data: {
                    attendeeId: attendee.id
                }
            });

            return { user, attendee, swag };
        }, {
            maxWait: 5000,
            timeout: 15000
        });

        // compute registrationId same way as other endpoints (match frontend mock)
        const computeRegistrationId = (id) => {
            // Uses the last 8 chars of CUID (random entropy) to generate a short, unique alphanumeric suffix
            const suffix = id.slice(-8).toUpperCase();
            return `AWS-SCD-CMR-2026-${suffix}`;
        };
        const registrationId = computeRegistrationId(result.attendee.id);

        // prepare flattened attendee object consistent with other endpoints
        const attendeeObj = {
            id: result.attendee.id,
            registrationId,
            name: result.user.name,
            email: result.user.email,
            university: result.attendee.university,
            phone: result.attendee.phone,
            tshirtSize: result.attendee.tshirtSize,
            checkedIn: result.attendee.checkedIn,
            checkedInAt: result.attendee.checkedInAt,
            registeredAt: result.attendee.registeredAt,
            status: result.attendee.checkedIn ? 'Confirmed' : 'Pending',
            swag: {
                tshirt: false,
                stickers: false,
                notebook: false,
                badge: false,
                pen: false,
                wristband: false
            },
            user: result.user,
            raw: result.attendee
        };

        res.status(201).json({
            success: true,
            data: {
                user: result.user,
                attendee: attendeeObj
            }
        });

        // Send welcome email
        try {
            await sendEmail({
                to: result.user.email,
                subject: 'Registration Confirmed: AWS Student Community Day (May 23, 2026)',
                template: 'welcome',
                variables: {
                    name: result.user.name,
                    email: result.user.email,
                    university: result.attendee.university,
                    eventDate: "May 23, 2026",
                    eventTime: "09:00 AM — 05:00 PM",
                    eventVenue: "Douala, Cameroon"
                }
            });
            console.log('Welcome email sent');
        } catch (err) {
            console.error('Email send failed:', err);
        }

    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ success: false, errors: error.errors });
        }
        next(error);
    }
};

// Check registration status by email
export const getAttendeeByEmail = async (req, res, next) => {
    try {
        let { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }
        email = email.toLowerCase();

        const user = await prisma.user.findUnique({
            where: { email },
            include: { attendee: true }
        });

        if (!user || !user.attendee) {
            return res.status(404).json({ success: false, message: 'No registered attendee found with that email' });
        }

        res.status(200).json({
            success: true,
            data: {
                id: user.attendee.id,
                name: user.name,
                email: user.email,
                university: user.attendee.university,
                tshirtSize: user.attendee.tshirtSize,
                hasPaid: user.attendee.hasPaid
            }
        });
    } catch (error) {
        next(error);
    }
};

// Admin Only - List

// original admin list endpoint (may remain for internal use)
export const getAttendees = async (req, res, next) => {
    console.log('📋 Admin listing attendees');
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            university,
            checkedIn,
            export: isExport
        } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        const where = {
            AND: [
                search ? {
                    user: {
                        OR: [
                            { name: { contains: search, mode: 'insensitive' } },
                            { email: { contains: search, mode: 'insensitive' } }
                        ]
                    }
                } : {},
                university ? { university } : {},
                checkedIn !== undefined ? { checkedIn: checkedIn === 'true' } : {}
            ]
        };

        if (isExport === 'true') {
            const allAttendees = await prisma.attendee.findMany({
                where,
                include: { user: true, swag: true, certificate: true }
            });

            // Generate CSV
            const csvRows = ['Name,Email,University,Phone,TShirt Size,CheckedIn,CheckedInAt,Swag_TShirt,Swag_Stickers,Swag_Notebook,Swag_Badge,Swag_Pen,Swag_Wristband'];
            allAttendees.forEach(a => {
                const s = a.swag || {};
                csvRows.push([
                    `"${a.user.name}"`, `"${a.user.email}"`, `"${a.university}"`, `"${a.phone || ''}"`, `"${a.tshirtSize}"`,
                    a.checkedIn, `"${a.checkedInAt || ''}"`,
                    s.tshirt ? 'Yes' : 'No', s.stickers ? 'Yes' : 'No', s.notebook ? 'Yes' : 'No',
                    s.badge ? 'Yes' : 'No', s.pen ? 'Yes' : 'No', s.wristband ? 'Yes' : 'No'
                ].join(','));
            });

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="attendees.csv"');
            return res.status(200).send(csvRows.join('\n'));
        }

        const [attendees, total] = await Promise.all([
            prisma.attendee.findMany({
                where,
                skip,
                take,
                include: { user: true, swag: true },
                orderBy: { registeredAt: 'desc' }
            }),
            prisma.attendee.count({ where })
        ]);

        // NOTE: this endpoint returns raw attendee objects (with nested user/sw
        res.status(200).json({
            success: true,
            data: attendees,
            meta: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / take)
            }
        });
    } catch (error) {
        next(error);
    }
};

// new endpoint returning frontend-friendly structure
export const getAttendeesForUI = async (req, res, next) => {
    console.log('📋 Admin listing attendees (UI)');
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            university,
            checkedIn
        } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const take = parseInt(limit);

        const where = {
            AND: [
                search ? {
                    user: {
                        OR: [
                            { name: { contains: search, mode: 'insensitive' } },
                            { email: { contains: search, mode: 'insensitive' } }
                        ]
                    }
                } : {},
                university ? { university } : {},
                checkedIn !== undefined ? { checkedIn: checkedIn === 'true' } : {}
            ]
        };

        const [attendees, total] = await Promise.all([
            prisma.attendee.findMany({
                where,
                skip,
                take,
                include: { user: true, swag: true, certificate: true },
                orderBy: { registeredAt: 'desc' }
            }),
            prisma.attendee.count({ where })
        ]);

        // helper for registrationId matching frontend mock: take 4 chars of second UUID segment, append X7P
        const computeRegistrationId = (id) => {
            // Uses the last 8 chars of CUID (random entropy) to generate a short, unique alphanumeric suffix
            const suffix = id.slice(-8).toUpperCase();
            return `AWS-SCD-CMR-2026-${suffix}`;
        };

        const transformed = attendees.map(a => {
            const registrationId = computeRegistrationId(a.id);
            const swag = a.checkedIn
                ? a.swag
                : {
                    tshirt: false,
                    stickers: false,
                    notebook: false,
                    badge: false,
                    pen: false,
                    wristband: false
                };
            return {
                id: a.id,
                registrationId,
                name: a.user.name,
                email: a.user.email,
                university: a.university,
                checkedIn: a.checkedIn,
                hasPaid: a.hasPaid,
                swag,
                certificateStatus: a.certificate?.status || 'Not Sent'
            };
        });

        res.status(200).json({
            success: true,
            data: transformed,
            meta: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(total / take)
            }
        });
    } catch (error) {
        next(error);
    }
};

// Admin Only - Details
export const getAttendeeById = async (req, res, next) => {
    try {
        const attendee = await prisma.attendee.findUnique({
            where: { id: req.params.id },
            include: { user: true, swag: true, certificate: true }
        });

        if (!attendee) return res.status(404).json({ success: false, message: 'Attendee not found' });

        // compute registration id (same logic as frontend mock)
        const computeRegistrationId = (id) => {
            // Uses the last 8 chars of CUID (random entropy) to generate a short, unique alphanumeric suffix
            const suffix = id.slice(-8).toUpperCase();
            return `AWS-SCD-CMR-2026-${suffix}`;
        };

        const registrationId = computeRegistrationId(attendee.id);

        // if not checked in, ensure swag object has default false values
        const swag = attendee.checkedIn
            ? attendee.swag
            : {
                tshirt: false,
                stickers: false,
                notebook: false,
                badge: false,
                pen: false,
                wristband: false
            };

        const payload = {
            id: attendee.id,
            registrationId,
            name: attendee.user.name,
            email: attendee.user.email,
            university: attendee.university,
            phone: attendee.phone,
            tshirtSize: attendee.tshirtSize,
            checkedIn: attendee.checkedIn,
            hasPaid: attendee.hasPaid,
            checkedInAt: attendee.checkedInAt,
            registeredAt: attendee.registeredAt,
            status: attendee.checkedIn ? 'Confirmed' : 'Pending',
            swag,
            user: attendee.user,
            raw: attendee
        };

        res.status(200).json({ success: true, data: payload });
    } catch (error) {
        next(error);
    }
};

// Admin Only - Check-in
export const checkInAttendee = async (req, res, next) => {
    console.log(`\n========================================`);
    console.log(`[CHECKIN INITIATED] Attendee ID: ${req.params.id}`);

    try {
        const attendee = await prisma.attendee.findUnique({ where: { id: req.params.id }, include: { user: true, swag: true } });
        if (!attendee) {
            console.error(`[CHECKIN ERROR] Attendee NOT FOUND: ${req.params.id}`);
            return res.status(404).json({ success: false, message: 'Attendee not found' });
        }

        console.log(`[CHECKIN DATA] Found attendee: ${attendee.user.name} (${attendee.user.email}). Current status: ${attendee.checkedIn ? 'CHECKED-IN' : 'UNCHECKED'}`);

        const updatedRaw = await prisma.attendee.update({
            where: { id: req.params.id },
            data: {
                checkedIn: !attendee.checkedIn,
                checkedInAt: !attendee.checkedIn ? new Date() : null
            }
        });

        console.log(`[CHECKIN SUCCESS] Status toggled to: ${updatedRaw.checkedIn ? 'CHECKED-IN' : 'UNCHECKED'}`);

        // if checking in (new state is true), send thank you email
        if (updatedRaw.checkedIn && !attendee.checkedIn) {
            console.log(`[CHECKIN EMAIL] Attempting to send thank you email to: ${attendee.user.email}`);
            try {
                await sendEmail({
                    to: attendee.user.email,
                    subject: 'Thank You for Joining AWS Student Community Day! 🎉',
                    template: 'thankyou',
                    variables: {
                        name: attendee.user.name,
                        university: attendee.university
                    }
                });
                console.log(`[CHECKIN EMAIL] Successfully sent thank you email to: ${attendee.user.email}`);
            } catch (err) {
                console.error(`[CHECKIN EMAIL ERROR] Failed to send email to ${attendee.user.email}`, err);
            }
        }
        console.log(`========================================\n`);

        // refresh with included relations for response
        const updated = await prisma.attendee.findUnique({ where: { id: req.params.id }, include: { user: true, swag: true } });

        // compute registrationId helper
        const computeRegistrationId = (id) => {
            // Uses the last 8 chars of CUID (random entropy) to generate a short, unique alphanumeric suffix
            const suffix = id.slice(-8).toUpperCase();
            return `AWS-SCD-CMR-2026-${suffix}`;
        };

        const registrationId = computeRegistrationId(updated.id);
        const swag = updated.checkedIn
            ? updated.swag
            : {
                tshirt: false,
                stickers: false,
                notebook: false,
                badge: false,
                pen: false,
                wristband: false
            };

        const payload = {
            id: updated.id,
            registrationId,
            name: updated.user.name,
            email: updated.user.email,
            university: updated.university,
            phone: updated.phone,
            tshirtSize: updated.tshirtSize,
            checkedIn: updated.checkedIn,
            hasPaid: updated.hasPaid,
            checkedInAt: updated.checkedInAt,
            registeredAt: updated.registeredAt,
            status: updated.checkedIn ? 'Confirmed' : 'Pending',
            swag,
            user: updated.user,
            raw: updated
        };

        res.status(200).json({ success: true, data: payload });
    } catch (error) {
        next(error);
    }
};

// Admin Only - Update Swag
export const updateSwag = async (req, res, next) => {
    try {
        const validated = swagUpdateSchema.parse(req.body);

        const updated = await prisma.swagRecord.update({
            where: { attendeeId: req.params.id },
            data: {
                ...validated,
                updatedBy: req.user.id
            }
        });

        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        if (error.name === 'ZodError') return res.status(400).json({ success: false, errors: error.errors });
        next(error);
    }
};

// Admin Only - Delete
export const deleteAttendee = async (req, res, next) => {
    try {
        const attendee = await prisma.attendee.findUnique({ where: { id: req.params.id } });
        if (!attendee) return res.status(404).json({ success: false, message: 'Attendee not found' });

        // Delete User will cascade delete Attendee, Swag, etc. due to onDelete: Cascade in schema
        await prisma.user.delete({ where: { id: attendee.userId } });

        res.status(200).json({ success: true, message: 'Attendee deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Admin Only - Stats
export const getAttendeeStats = async (req, res, next) => {
    try {
        let totalRegistered = await prisma.attendee.count();
        totalRegistered += 45; // Adding 45 as requested by user
        
        const checkedInCount = await prisma.attendee.count({ where: { checkedIn: true } });

        // Count attendees who got all 6 swag items
        const fullSwagCount = await prisma.swagRecord.count({
            where: {
                tshirt: true,
                stickers: true,
                notebook: true,
                badge: true,
                pen: true,
                wristband: true
            }
        });

        const certsSent = await prisma.certificate.count({ where: { status: 'SENT' } });

        res.status(200).json({
            success: true,
            data: {
                totalRegistered,
                checkedIn: checkedInCount,
                swagDistributed: fullSwagCount,
                certificatesSent: certsSent
            }
        });
    } catch (error) {
        next(error);
    }
};
