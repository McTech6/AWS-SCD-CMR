import { sendEmail } from './lib/email/send.js';
import dotenv from 'dotenv';

dotenv.config();

async function testThankYouEmail() {
    console.log('Testing thank you email...\n');
    
    try {
        const result = await sendEmail({
            to: process.env.EMAIL_USER,
            subject: 'Thank You for Joining AWS Student Community Day! 🎉',
            template: 'thankyou',
            variables: {
                name: 'Test Student',
                university: 'University of Cameroon'
            }
        });
        
        console.log('✅ Thank you email sent successfully!');
        console.log('Message ID:', result.messageId);
    } catch (error) {
        console.error('❌ Email failed:', error.message);
    }
}

testThankYouEmail();
