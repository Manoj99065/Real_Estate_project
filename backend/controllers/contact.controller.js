import Contact from '../models/contact.model.js';
import { sendEmail } from '../utils/sendEmail.js';

// Create a new contact message
export const createContact = async(req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body; // changed role → subject

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email, and message',
            });
        }

        const contact = new Contact({ name, email, phone, subject, message });
        await contact.save();

        // Notify admin via Brevo
        const adminEmail = process.env.EMAIL_USER;
        const adminMessage = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
                <h2 style="color: #0d9488;">New Contact Request</h2>
                <p>You have received a new message from the platform.</p>
                <div style="background: #f8fafc; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0;">
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
                    <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
                    <p style="margin-top: 15px;"><strong>Message:</strong></p>
                    <p style="font-style: italic; color: #475569;">"${message}"</p>
                </div>
            </div>
        `;

        try {
            await sendEmail({
                email: adminEmail,
                subject: `New Contact message from ${name}`,
                message: adminMessage, // this will be used as htmlContent in your sendEmail
            });
        } catch (emailErr) {
            console.error('Admin notification email failed:', emailErr.message);
        }

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
        });
    } catch (err) {
        console.error('Contact Error:', err);
        res.status(500).json({
            success: false,
            message: err.message || 'Failed to send message',
        });
    }
};

// Get all contacts (admin only)
export const getAllContacts = async(req, res) => { // ✅ fixed typo
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            contacts,
        });
    } catch (err) {
        console.error('Fetch contacts error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch contacts',
        });
    }
};