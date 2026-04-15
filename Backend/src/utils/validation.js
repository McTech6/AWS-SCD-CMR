import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    university: z.string().min(2, 'University must be at least 2 characters'),
    phone: z.string().optional(),
    tshirtSize: z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL']).default('M'),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const refreshSchema = z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
});

export const swagUpdateSchema = z.object({
    tshirt: z.boolean().optional(),
    stickers: z.boolean().optional(),
    notebook: z.boolean().optional(),
    badge: z.boolean().optional(),
    pen: z.boolean().optional(),
    wristband: z.boolean().optional(),
});

export const attendeeUpdateSchema = z.object({
    university: z.string().optional(),
    phone: z.string().optional(),
    tshirtSize: z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL']).optional(),
    checkedIn: z.boolean().optional(),
});

export const speakerApplySchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    topic: z.string().min(5, 'Topic must be at least 5 characters'),
    talkTitle: z.string().min(10, 'Talk title must be at least 10 characters'),
    bio: z.string().min(20, 'Bio must be at least 20 characters'),
    talkAbstract: z.string().optional(),
    role: z.string().optional(),
    company: z.string().optional(),
    linkedinUrl: z.string().url('Invalid LinkedIn URL'),
    twitterHandle: z.string().optional(),
    githubUrl: z.string().optional().or(z.literal('')),
    track: z.enum(['CLOUD_FUNDAMENTALS', 'DEVOPS', 'AI_ML', 'SECURITY', 'OPEN_SOURCE', 'COMMUNITY_FOCUSED']).optional(),
    experienceLevel: z.enum(['ZERO_TO_ONE', 'ONE_TO_THREE', 'THREE_TO_FIVE', 'FIVE_PLUS']).optional(),
    sessionType: z.enum(['TALK', 'DEMO', 'WORKSHOP', 'KEYNOTE']).optional().default('TALK'),
    photoBase64: z.string().optional(),
});

export const speakerUpdateSchema = z.object({
    topic: z.string().optional(),
    talkTitle: z.string().optional(),
    bio: z.string().optional(),
    talkAbstract: z.string().optional(),
    track: z.enum(['CLOUD_FUNDAMENTALS', 'DEVOPS', 'AI_ML', 'SECURITY', 'OPEN_SOURCE', 'COMMUNITY_FOCUSED']).optional(),
    experienceLevel: z.enum(['ZERO_TO_ONE', 'ONE_TO_THREE', 'THREE_TO_FIVE', 'FIVE_PLUS']).optional(),
    sessionType: z.enum(['TALK', 'DEMO', 'WORKSHOP', 'KEYNOTE']).optional(),
    sortOrder: z.number().optional(),
    featured: z.boolean().optional(),
    photoBase64: z.string().optional(),
});

export const volunteerApplySchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    university: z.string().min(2, 'University must be at least 2 characters'),
    cloudClub: z.string().optional(),
    skills: z.string().min(2, 'Area of contribution is required'), // Now a single selected string
});

export const volunteerUpdateSchema = z.object({
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
    reviewNote: z.string().optional(),
    whatsappLink: z.string().url().optional(),
});

export const agendaSchema = z.object({
    title: z.string().min(3, 'Title is required'),
    description: z.string().optional(),
    startTime: z.string().datetime().optional().or(z.literal('')),
    endTime: z.string().datetime().optional().or(z.literal('')),
    track: z.enum(['MAIN_STAGE', 'WORKSHOP', 'PANEL', 'NETWORKING', 'OPENING', 'CLOSING']).optional(),
    speakerId: z.string().optional(),
    sortOrder: z.number().default(0),
});

export const agendaUpdateSchema = agendaSchema.partial();

export const eventConfigUpdateSchema = z.object({
    eventName: z.string().optional(),
    eventDate: z.string().datetime().optional(),
    eventEndDate: z.string().datetime().optional(),
    venue: z.string().optional(),
    venueAddress: z.string().optional(),
    tagline: z.string().optional(),
    registrationOpen: z.boolean().optional(),
    speakerAppsOpen: z.boolean().optional(),
    volunteerAppsOpen: z.boolean().optional(),
    sponsorshipOpen: z.boolean().optional(),
    maxAttendees: z.number().optional(),
    contactEmail: z.string().email().optional(),
}).partial();

export const sponsorSchema = z.object({
    name: z.string().min(2, 'Company/Organization name is required'),
    logoUrl: z.string().url('Invalid Logo URL'),
    website: z.string().url('Invalid Website URL').optional().or(z.literal('')),
    contactName: z.string().optional(),
    contactEmail: z.string().email().optional(),
    tier: z.enum(['GOLD', 'SILVER', 'BRONZE', 'COMMUNITY']).optional(),
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).default('APPROVED'),
    sortOrder: z.number().default(0),
    visible: z.boolean().default(true),
});

export const sponsorApplySchema = z.object({
    name: z.string().min(2, 'Company/Organization name is required'),
    contactName: z.string().min(2, 'Contact person name is required'),
    contactEmail: z.string().email('Invalid contact email'),
    website: z.string().url('Invalid Website URL').min(1, 'Website is required'),
    logoUrl: z.string().url('Invalid Logo URL').min(1, 'Logo URL is required'),
});

export const sponsorUpdateSchema = sponsorSchema.partial().extend({
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
});

// --- file upload schemas (Phase 4)
export const presignedUrlSchema = z.object({
    fileName: z.string().min(1, 'File name is required'),
    fileType: z.string().min(1, 'File type is required'),
    folder: z.enum(['speaker-photos', 'certificates', 'sponsors']),
    fileSize: z.number().max(5 * 1024 * 1024, 'File must be 5MB or smaller').optional(),
});

export const uploadConfirmSchema = z.object({
    fileKey: z.string().min(1, 'File key is required'),
    folder: z.enum(['speaker-photos', 'certificates', 'sponsors']),
    relatedId: z.string().optional(),
});

export const organizerSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    role: z.string().default('Cloud Club Captain'),
    club: z.string().optional(),
    bio: z.string().optional(),
    imageUrl: z.string().url('Invalid Image URL').optional().or(z.literal('')),
    linkedinUrl: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
    twitterUrl: z.string().url('Invalid Twitter URL').optional().or(z.literal('')),
    githubUrl: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
    sortOrder: z.number().default(0),
    visible: z.boolean().default(true),
});

export const organizerUpdateSchema = organizerSchema.partial();
