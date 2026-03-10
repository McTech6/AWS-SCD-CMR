import { sendEmail } from './lib/email/send.js';
import dotenv from 'dotenv';

dotenv.config();

async function testEmail() {
    console.log('Testing email configuration...');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
    console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
    
    try {
        const result = await sendEmail({
            to: process.env.EMAIL_USER, // Send to yourself
            subject: 'Test Email - AWS Community Day',
            template: 'welcome',
            variables: {
                name: 'Test User',
                email: 'test@example.com',
                university: 'Test University'
            }
        });
        
        console.log('✅ Email sent successfully!');
        console.log('Message ID:', result.messageId);
    } catch (error) {
        console.error('❌ Email failed:', error.message);
        console.error('Full error:', error);
    }
}

testEmail();
