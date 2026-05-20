import prisma from './src/db/prisma.js';
import { sendEmail } from './lib/email/send.js';
import dotenv from 'dotenv';
dotenv.config();

const speakers = await prisma.speaker.findMany({
    where: { status: 'APPROVED' },
    include: { user: { select: { name: true, email: true } } }
});

// Add Tidding to the list
const recipients = [
    ...speakers.map(s => ({ name: s.user.name.split(' ')[0], email: s.user.email })),
    { name: 'Tidding', email: 'tiddingramsey@gmail.com' }
];

console.log(`\n📋 Sending to ${recipients.length} recipients\n`);

let sent = 0;
let failed = 0;

for (const recipient of recipients) {
    try {
        await sendEmail({
            to: recipient.email,
            subject: 'Important: Venue Update – AWS Student Community Day Cameroon 2026',
            template: 'venue-change',
            variables: { name: recipient.name }
        });
        console.log(`✅ Sent to: ${recipient.name} <${recipient.email}>`);
        sent++;
    } catch (err) {
        console.error(`❌ Failed: ${recipient.name} <${recipient.email}> — ${err.message}`);
        failed++;
    }
    await new Promise(r => setTimeout(r, 500));
}

console.log(`\n📊 Done! Sent: ${sent} | Failed: ${failed}`);
await prisma.$disconnect();
