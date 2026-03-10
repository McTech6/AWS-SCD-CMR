import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🗑️ Emptying speakers table...');
    try {
        const deleted = await prisma.speaker.deleteMany({});
        console.log(`✅ Success! Deleted ${deleted.count} speakers.`);
    } catch (error) {
        console.error('❌ Error deleting speakers:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
