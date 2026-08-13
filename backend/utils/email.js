// utils/email.js
import { sendEmail } from './SendEmail.js';

export const sendNewsletterEmail = async(toEmail, propertyData) => {
    const {
        propertyTitle,
        propertyPrice,
        propertyLocation,
        propertyImage,
        propertyId,
    } = propertyData;

    // Build the HTML content
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc; border-radius: 12px;">
      <div style="background: #0d6e59; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0;">🏠 RealEstate</h1>
      </div>
      <div style="padding: 30px; background: white; border-radius: 0 0 12px 12px;">
        <h2 style="color: #0d6e59;">New Property Alert! 🔥</h2>
        <div style="margin: 20px 0; padding: 15px; background: #f1f5f9; border-radius: 8px;">
          <h3 style="margin: 0 0 8px 0; color: #1e293b;">${propertyTitle}</h3>
          <p style="margin: 4px 0; color: #64748b;">📍 ${propertyLocation}</p>
          <p style="margin: 8px 0 0 0; font-size: 20px; font-weight: bold; color: #0d6e59;">
            ₹${Number(propertyPrice).toLocaleString()}
          </p>
        </div>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/property/${propertyId}" 
           style="display: inline-block; background: #0d6e59; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold;">
          View Property →
        </a>
        <p style="margin-top: 20px; color: #94a3b8; font-size: 12px;">
          You're receiving this because you subscribed to our newsletter. 
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/unsubscribe" style="color: #0d6e59;">Unsubscribe</a>
        </p>
      </div>
    </div>
  `;

    // Use the generic sendEmail function
    return sendEmail({
        email: toEmail,
        subject: `🏠 New Property: ${propertyTitle}`,
        message: htmlContent,
    });
};