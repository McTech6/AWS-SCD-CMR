import { sendEmail } from './lib/email/send.js';
import dotenv from 'dotenv';
dotenv.config();

await sendEmail({
    to: 'cabrellesage@gmail.com',
    subject: '📍 Important: Venue Update – AWS Student Community Day 2026',
    template: 'venue-change',
    variables: { name: 'Cabrel' }
});

console.log('✅ Sent to cabrellesage@gmail.com');
