import prisma from '../db/prisma.js';

/**
 * @openapi
 * /event/dashboard:
 *   get:
 *     summary: Get comprehensive dashboard statistics (Admin)
 *     tags: [Event]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics returned successfully
 */
export const getDashboardStats = async (req, res, next) => {
    try {
        // 1. Core Counts
        const totalRegistered = await prisma.attendee.count();
        const checkedInCount = await prisma.attendee.count({ where: { checkedIn: true } });
        const approvedSpeakers = await prisma.speaker.count({ where: { status: 'APPROVED' } });
        const pendingSpeakers = await prisma.speaker.count({ where: { status: 'PENDING' } });
        const totalSponsors = await prisma.sponsor.count();
        const totalOrganizers = await prisma.organizer.count();
        const approvedVolunteers = await prisma.volunteer.count({ where: { status: 'APPROVED' } });
        const pendingVolunteers = await prisma.volunteer.count({ where: { status: 'PENDING' } });
        
        // 2. Swag & Capacity
        const config = await prisma.eventConfig.findFirst({ where: { id: 'default' } });
        const maxCapacity = config?.maxAttendees || 500;
        
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

        // 3. Recent Activity (Latest 10 items)
        // We'll combine Attendees, Speakers, and maybe Email Logs/Sponsors
        
        const latestAttendees = await prisma.attendee.findMany({
            take: 5,
            orderBy: { registeredAt: 'desc' },
            include: { user: true }
        });

        const latestCheckins = await prisma.attendee.findMany({
            where: { checkedIn: true },
            take: 5,
            orderBy: { checkedInAt: 'desc' },
            include: { user: true }
        });

        const latestSpeakerApps = await prisma.speaker.findMany({
            take: 5,
            orderBy: { submittedAt: 'desc' },
            include: { user: true }
        });

        const latestVolunteerApps = await prisma.volunteer.findMany({
            take: 5,
            orderBy: { submittedAt: 'desc' },
            include: { user: true }
        });

        // Map to a unified activity format
        const activities = [
            ...latestAttendees.map(a => ({
                id: `reg-${a.id}`,
                type: 'registration',
                user: a.user.name,
                time: a.registeredAt,
                status: 'default'
            })),
            ...latestCheckins.map(a => ({
                id: `check-${a.id}`,
                type: 'checkin',
                user: a.user.name,
                time: a.checkedInAt,
                status: 'success'
            })),
            ...latestSpeakerApps.map(s => ({
                id: `speaker-${s.id}`,
                type: 'speaker',
                user: s.user.name,
                time: s.submittedAt,
                status: s.status === 'APPROVED' ? 'success' : 'warning'
            })),
            ...latestVolunteerApps.map(v => ({
                id: `vol-${v.id}`,
                type: 'volunteer',
                user: v.user.name,
                time: v.submittedAt,
                status: v.status === 'APPROVED' ? 'success' : 'warning'
            }))
        ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 10);

        // 4. Time-based Growth (Mock growth for now or calculate last 24h)
        const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const registeredLast24h = await prisma.attendee.count({
            where: { registeredAt: { gte: last24h } }
        });
        const growthRate = totalRegistered > 0 ? Math.round((registeredLast24h / totalRegistered) * 100) : 0;

        res.status(200).json({
            success: true,
            data: {
                stats: [
                    { label: "Total Registered", value: totalRegistered, target: maxCapacity, icon: "Users", color: "var(--electric)", growth: `+${registeredLast24h}` },
                    { label: "Checked-In", value: checkedInCount, target: totalRegistered || 1, icon: "CheckCircle", color: "var(--success)", growth: `${Math.round((checkedInCount / (totalRegistered || 1)) * 100)}%` },
                    { label: "Approved Speakers", value: approvedSpeakers, target: 20, icon: "Mic2", color: "var(--ember)", growth: `${pendingSpeakers} pending` },
                    { label: "Volunteers", value: approvedVolunteers, target: 50, icon: "Heart", color: "var(--electric-light)", growth: `${pendingVolunteers} pending` },
                    { label: "Verified Captains", value: totalOrganizers, target: 12, icon: "Shield", color: "var(--electric-light)", growth: `${totalOrganizers} active` },
                    { label: "Swag Distributed", value: fullSwagCount, target: checkedInCount || 1, icon: "Gift", color: "var(--success)", growth: `${fullSwagCount} packs` },
                ],
                capacity: {
                    filled: totalRegistered,
                    total: maxCapacity,
                    percentage: Math.round((totalRegistered / maxCapacity) * 100)
                },
                activities,
                systemHealth: {
                    dbSync: "Live",
                    lastBackup: new Date().toISOString()
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

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
        const { eventConfigUpdateSchema } = await import('../utils/validation.js');
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
                contactEmail: 'awsstudentcommunitydaycmr@gmail.com',
                ...data
            }
        });

        res.status(200).json({ success: true, data: config });
    } catch (error) {
        if (error.name === 'ZodError') return res.status(400).json({ success: false, errors: error.errors });
        next(error);
    }
};

// Public - Get Stats
export const getPublicStats = async (req, res, next) => {
    try {
        const totalRegistered = await prisma.attendee.count();
        const approvedSpeakers = await prisma.speaker.count({ where: { status: 'APPROVED' } });
        const workshopCount = await prisma.agendaItem.count({ where: { track: 'WORKSHOP' } });

        res.status(200).json({
            success: true,
            data: {
                registrations: totalRegistered,
                speakers: approvedSpeakers,
                workshops: workshopCount,
                days: 1 // Static for now as requested
            }
        });
    } catch (error) {
        next(error);
    }
};
