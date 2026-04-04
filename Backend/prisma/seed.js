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
            contactEmail: 'awsstudentcommunitydaycmr@gmail.com',
            maxAttendees: 500,
            sponsorshipOpen: false,
        },
    });
    console.log('✅ Initial event config created');
    
    // Initial Sponsors
    console.log('Seeding sponsors...');
    const sponsors = [
        {
            name: "AWS",
            logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
            tier: "GOLD",
            website: "https://aws.amazon.com",
            sortOrder: 1
        },
        {
            name: "Intel",
            logoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Intel-logo.svg",
            tier: "GOLD",
            website: "https://intel.com",
            sortOrder: 2
        },
        {
            name: "NVIDIA",
            logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg",
            tier: "GOLD",
            website: "https://nvidia.com",
            sortOrder: 3
        },
        {
            name: "MongoDB",
            logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/93/MongoDB_Logo.svg",
            tier: "SILVER",
            website: "https://mongodb.com",
            sortOrder: 1
        },
        {
            name: "Datadog",
            logoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Datadog_logo.svg",
            tier: "SILVER",
            website: "https://datadog.com",
            sortOrder: 2
        },
        {
            name: "GitHub",
            logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
            tier: "COMMUNITY",
            website: "https://github.com",
            sortOrder: 1
        }
    ];

    for (const sponsor of sponsors) {
        await prisma.sponsor.upsert({
            where: { id: `seed-${sponsor.name.toLowerCase()}` },
            update: sponsor,
            create: {
                id: `seed-${sponsor.name.toLowerCase()}`,
                ...sponsor
            }
        });
    }
    console.log('✅ Sponsors seeded');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
