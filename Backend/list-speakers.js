import prisma from './src/db/prisma.js';
import dotenv from 'dotenv';
dotenv.config();

const speakers = await prisma.speaker.findMany({
    where: { status: 'APPROVED' },
    include: { user: { select: { name: true, email: true } } }
});

console.log('Total approved speakers:', speakers.length);
speakers.forEach((s, i) => {
    console.log(`${i + 1}. ${s.user.name} - ${s.user.email}`);
});

await prisma.$disconnect();
