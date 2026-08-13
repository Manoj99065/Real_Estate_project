const nodemailer = require('nodemailer');

// Create transporter (using Gmail example, adjust for your provider)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendResetEmail = async(toEmail, resetLink) => {
    const mailOptions = {
        from: `"Your App" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: 'Password Reset',
        html: `
      <h3>Reset Your Password</h3>
      <p>Click the link below to reset your password. It expires in 15 minutes.</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>If you didn't request this, ignore this email.</p>
    `,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendResetEmail };