import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 12);
};

export const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

export const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};
