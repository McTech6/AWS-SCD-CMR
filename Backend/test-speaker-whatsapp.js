import { sendEmail } from './lib/email/send.js';
import dotenv from 'dotenv';
dotenv.config();

await sendEmail({
    to: 'tiddingramsey@gmail.com',
    subject: '🎤 Join the Speakers WhatsApp Group – AWS SCD Cameroon 2026',
    template: 'speaker-whatsapp',
    variables: {
        name: 'Tidding',
        whatsappLink: 'https://chat.whatsapp.com/FpAXQxiJmIV9kKLzLAKvWN'
    }
});

console.log('✅ Email sent!');
