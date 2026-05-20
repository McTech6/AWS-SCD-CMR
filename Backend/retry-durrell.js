import { sendEmail } from './lib/email/send.js';
import dotenv from 'dotenv';
dotenv.config();

await sendEmail({
    to: 'durrell.gemuh.a@gmail.com',
    subject: 'Important: Venue Update – AWS Student Community Day Cameroon 2026',
    template: 'venue-change',
    variables: { name: 'Durrell' }
});
console.log('✅ Sent to Durrell');
