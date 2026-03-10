import 'dotenv/config';
import app from './app.js';
import prisma from './db/prisma.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await prisma.$connect();
        console.log('✅ Connected to Database (PostgreSQL/Prisma)');

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📡 Health check: http://localhost:${PORT}/health`);
        });
    } catch (error) {
        console.error('❌ Failed to connect to Database or start server:', error);
        process.exit(1);
    }
};

startServer();