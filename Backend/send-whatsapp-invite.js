import prisma from './src/db/prisma.js';
import { sendEmail } from './lib/email/send.js';
import dotenv from 'dotenv';
dotenv.config();

const WHATSAPP_LINK = 'https://chat.whatsapp.com/FpAXQxiJmIV9kKLzLAKvWN';

const speakers = await prisma.speaker.findMany({
    where: { status: 'APPROVED' },
    include: { user: { select: { name: true, email: true } } }
});

console.log(`\n📋 Found ${speakers.length} approved speakers\n`);

let sent = 0;
let failed = 0;

for (const speaker of speakers) {
    const { name, email } = speaker.user;
    try {
        await sendEmail({
            to: email,
            subject: '🎤 Join the Speakers WhatsApp Group – AWS SCD Cameroon 2026',
            template: 'speaker-whatsapp',
            variables: {
                name: name.split(' ')[0], // First name only
                whatsappLink: WHATSAPP_LINK
            }
        });
        console.log(`✅ Sent to: ${name} <${email}>`);
        sent++;
    } catch (err) {
        console.error(`❌ Failed for: ${name} <${email}> — ${err.message}`);
        failed++;
    }

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 500));
}

console.log(`\n📊 Done! Sent: ${sent} | Failed: ${failed}`);
await prisma.$disconnect();
