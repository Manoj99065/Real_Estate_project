//process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // optional – disable SSL verify (test only)

import 'dotenv/config';
import axios from 'axios'; // ← required

export const sendEmail = async(options) => {
    try {
        // 1. Get API key (no trim – just as-is)
        const BREVO_API_KEY = process.env.BREVO_API_KEY;
        console.log('🔑 BREVO_API_KEY present?', BREVO_API_KEY ? '✅ Yes' : '❌ No');
        if (!BREVO_API_KEY) {
            throw new Error('Missing BREVO_API_KEY in .env');
        }

        // 2. Get sender email
        const senderEmail = process.env.EMAIL_USER;
        console.log('📧 Sender email:', senderEmail);
        if (!senderEmail) {
            throw new Error('Missing EMAIL_USER in .env');
        }

        // 3. Prepare payload
        const data = {
            sender: { name: 'Real Estate Platform', email: senderEmail },
            to: [{ email: options.email }],
            subject: options.subject,
            htmlContent: options.message,
        };

        console.log(`📨 Sending to: ${options.email}, Subject: ${options.subject}`);

        // 4. Send via axios
        const response = await axios.post(
            'https://api.brevo.com/v3/smtp/email',
            data, {
                headers: {
                    'api-key': BREVO_API_KEY,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            }
        );

        // 5. Handle success
        if (response.status === 201) {
            const msgId = response.data.messageId || 'no ID';
            console.log(`✅ Email sent successfully. Message ID: ${msgId}`);
            return { success: true, messageId: msgId };
        } else {
            throw new Error(response.data.message || 'Brevo API error');
        }
    } catch (error) {
        console.error('❌ Email error:', error.message);
        throw new Error(`Could not send email: ${error.message}`);
    }
};