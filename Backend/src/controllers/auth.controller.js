import prisma from '../db/prisma.js';
import { hashPassword, comparePassword, generateToken, verifyToken } from '../utils/auth.js';
import { registerSchema, loginSchema } from '../utils/validation.js';

export const registerAdmin = async (req, res, next) => {
    console.log(`👨‍💼 Registering new admin: ${req.body?.email}`);
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and password are required',
            });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email',
            });
        }

        const hashedPassword = await hashPassword(password);

        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    name,
                    email,
                    passwordHash: hashedPassword,
                    role: 'ADMIN',
                },
            });

            await tx.admin.create({
                data: {
                    userId: user.id,
                },
            });

            return user;
        });

        const token = generateToken({ id: result.id, email: result.email, role: result.role });
        const { passwordHash, ...userResponse } = result;

        res.status(201).json({
            success: true,
            message: 'Admin registered successfully',
            data: {
                user: userResponse,
                token,
            },
        });
    } catch (error) {
        console.error('Admin registration error:', error);
        next(error);
    }
};

export const register = async (req, res, next) => {
    console.log(`📝 Registering new user: ${req.body?.email}`);
    try {
        const validatedData = registerSchema.parse(req.body);
        const { name, email, password, university, phone, tshirtSize } = validatedData;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email',
            });
        }

        const hashedPassword = await hashPassword(password);

        // Create User and Attendee in a transaction
        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    name,
                    email,
                    passwordHash: hashedPassword,
                },
            });

            const attendee = await tx.attendee.create({
                data: {
                    userId: user.id,
                    university,
                    phone,
                    tshirtSize,
                },
            });

            // Also create a SwagRecord as per Phase 2 requirements (best to do it now)
            await tx.swagRecord.create({
                data: {
                    attendeeId: attendee.id,
                },
            });

            return user;
        });

        const token = generateToken({ id: result.id, email: result.email, role: result.role });

        // Remove password hash from response
        const { passwordHash, ...userResponse } = result;

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: userResponse,
                token,
            },
        });
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: error.errors,
            });
        }
        next(error);
    }
};

export const login = async (req, res, next) => {
    console.log(`🔑 Login attempt: ${req.body?.email}`);
    try {
        const { email, password } = loginSchema.parse(req.body);

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || !user.passwordHash) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        const isMatch = await comparePassword(password, user.passwordHash);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Create session
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 1); // 1 day session

        const session = await prisma.session.create({
            data: {
                userId: user.id,
                expiresAt,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
            },
        });

        const token = generateToken({
            id: user.id,
            email: user.email,
            role: user.role,
            sessionId: session.id
        });

        const { passwordHash, ...userResponse } = user;

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: userResponse,
                token,
                sessionToken: session.token,
            },
        });
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: error.errors,
            });
        }
        next(error);
    }
};

export const logout = async (req, res, next) => {
    console.log('🚪 Logout requested');
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

        if (token) {
            const decoded = verifyToken(token);
            if (decoded && decoded.sessionId) {
                await prisma.session.delete({
                    where: { id: decoded.sessionId },
                }).catch(() => { }); // Ignore if session already deleted or doesn't exist
            }
        }

        res.clearCookie('token');
        res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        });
    } catch (error) {
        next(error);
    }
};

export const getMe = async (req, res, next) => {
    console.log(`👤 Fetching profile for user: ${req.user?.email}`);
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            include: {
                attendee: true,
                speaker: true,
                admin: true,
            },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        const { passwordHash, ...userResponse } = user;

        res.status(200).json({
            success: true,
            data: userResponse,
        });
    } catch (error) {
        next(error);
    }
};

export const refresh = async (req, res, next) => {
    console.log('🔄 Refreshing session token');
    try {
        const { sessionToken } = req.body;

        if (!sessionToken) {
            return res.status(400).json({
                success: false,
                message: 'Session token is required',
            });
        }

        const session = await prisma.session.findUnique({
            where: { token: sessionToken },
            include: { user: true },
        });

        if (!session || session.expiresAt < new Date()) {
            return res.status(401).json({
                success: false,
                message: 'Session expired or invalid',
            });
        }

        const { user } = session;
        const newToken = generateToken({
            id: user.id,
            email: user.email,
            role: user.role,
            sessionId: session.id
        });

        res.status(200).json({
            success: true,
            data: {
                token: newToken,
            },
        });
    } catch (error) {
        next(error);
    }
};
