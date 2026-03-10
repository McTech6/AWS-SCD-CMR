import { verifyToken } from '../utils/auth.js';
import prisma from '../db/prisma.js';

export const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const cookieToken = req.cookies?.token;

        const token = cookieToken || authHeader?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided, authorization denied',
            });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: 'Token is invalid or expired',
            });
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User no longer exists',
            });
        }

        // Check if session is still valid if sessionId present
        if (decoded.sessionId) {
            const session = await prisma.session.findUnique({
                where: { id: decoded.sessionId }
            });
            if (!session || session.expiresAt < new Date()) {
                return res.status(401).json({
                    success: false,
                    message: 'Session expired, please login again'
                });
            }
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const cookieToken = req.cookies?.token;

        const token = cookieToken || authHeader?.split(' ')[1];

        if (!token) {
            return next();
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return next();
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        if (user) {
            // Optional session check
            if (decoded.sessionId) {
                const session = await prisma.session.findUnique({
                    where: { id: decoded.sessionId }
                });
                if (session && session.expiresAt >= new Date()) {
                    req.user = user;
                }
            } else {
                req.user = user;
            }
        }
        next();
    } catch (error) {
        next();
    }
};

export const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Access denied: Admin role required',
        });
    }
};

export const requireRole = (role) => {
    return (req, res, next) => {
        if (req.user && req.user.role === role) {
            next();
        } else {
            res.status(403).json({
                success: false,
                message: `Access denied: ${role} role required`,
            });
        }
    };
};
