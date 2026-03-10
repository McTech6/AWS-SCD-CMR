import 'dotenv/config';
import prisma from '../src/db/prisma.js';
import bcrypt from 'bcryptjs';

async function main() {
    const adminEmail = 'tiddingramsey@gmail.com';
    const adminPassword = 'Assurance@6'; // Custom requested password

    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    console.log('Seeding initial admin...');

    const adminUser = await prisma.user.upsert({
        where: { email: adminEmail },
        update: { passwordHash: hashedPassword },
        create: {
            email: adminEmail,
            name: 'AWS Admin',
            passwordHash: hashedPassword,
            role: 'ADMIN',
        },
    });

    // Ensure the admin profile is also created
    await prisma.admin.upsert({
        where: { userId: adminUser.id },
        update: {},
        create: {
            userId: adminUser.id,
        },
    });

    console.log('✅ Admin user created:', adminEmail);

    // Initial Event Config
    console.log('Seeding event config...');
    await prisma.eventConfig.upsert({
        where: { id: 'default' },
        update: {},
        create: {
            id: 'default',
            eventName: 'AWS Cloud Club Student Community Day',
            eventDate: new Date('2026-05-15T09:00:00Z'),
            venue: 'Main Auditorium',
            contactEmail: 'contact@awscommunity.day',
            maxAttendees: 500,
        },
    });
    console.log('✅ Initial event config created');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
