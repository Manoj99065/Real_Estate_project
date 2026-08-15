import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { sendEmail } from '../utils/sendEmail.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// ---------- REGISTER ----------
export const register = async(req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            isVerified: false,
            verificationToken,
        });

        try {
            await sendEmail({
                email,
                subject: 'Verify Your Email - Real Estate Platform',
                message: `
          <p>Your email verification code is: <strong>${verificationToken}</strong></p>
          <p>Please enter this code on the verification page to activate your account.</p>
        `,
            });
        } catch (emailError) {
            console.error('Failed to send verification email:', emailError);
        }

        res.status(201).json({
            message: 'User registered. Please check your email for the verification code.',
            user: {
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: error.message });
    }
};

// ---------- LOGIN ----------
export const login = async(req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                message: 'Please verify your email before logging in.',
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        if (user.isBlocked) {
            return res.status(403).json({
                message: 'Your account has been blocked by an admin.',
            });
        }

        const token = jwt.sign({ id: user._id, role: user.role },
            process.env.JWT_SECRET, { expiresIn: '7d' }
        );

        const { password: _, ...userWithoutPassword } = user.toObject();

        res.json({
            message: 'Login successful',
            token,
            user: userWithoutPassword,
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: error.message });
    }
};

// ---------- GET PROFILE ----------
export const getMe = async(req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.error('GetMe error:', error);
        res.status(500).json({ message: error.message });
    }
};

// ---------- VERIFY EMAIL ----------
export const verifyEmail = async(req, res) => {
    try {
        console.log('📩 verifyEmail called with body:', req.body);

        const { email, code } = req.body;
        if (!email || !code) {
            console.log('❌ Missing email or code');
            return res.status(400).json({ message: 'Email and code are required.' });
        }

        console.log(`🔍 Looking for user with email: ${email}`);
        const user = await User.findOne({ email });
        if (!user) {
            console.log('❌ User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('👤 User found:', user.email, 'isVerified:', user.isVerified);

        if (user.isVerified) {
            console.log('✅ Already verified');
            return res.status(400).json({ message: 'Email already verified.' });
        }

        console.log(`🔢 Stored token: ${user.verificationToken}, Received code: ${code}`);
        if (String(user.verificationToken) !== String(code)) {
            console.log('❌ Token mismatch');
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        console.log('✅ Token matches, updating user...');
        user.isVerified = true;
        user.verificationToken = undefined;

        console.log('💾 Saving user...');
        await user.save();

        console.log('✅ User saved successfully');
        res.status(200).json({
            message: 'Email verified successfully',
            success: true,
        });
    } catch (error) {
        console.error('🔥 ERROR in verifyEmail:', error);
        res.status(500).json({
            message: error.message,
            success: false,
        });
    }
};

// ---------- FORGOT PASSWORD ----------
export const forgotPassword = async(req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'No user found with that email address' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetPasswordExpire = Date.now() + 15 * 60 * 1000;

        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = resetPasswordExpire;
        await user.save();

        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

        const message = `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset. Please click the link below:</p>
      <a href="${resetUrl}" clicktracking="off">${resetUrl}</a>
      <p>This link will expire in 15 minutes.</p>
    `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset - Real Estate Platform',
                message,
            });
            res.status(200).json({ message: 'Password reset email sent', success: true });
        } catch (emailError) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return res.status(500).json({ message: 'Could not send email', success: false });
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: error.message, success: false });
    }
};

// ---------- RESET PASSWORD ----------
// export const resetPassword = async(req, res) => {
//     try {
//         const { token } = req.params;
//         const { password } = req.body;

//         const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

//         const user = await User.findOne({
//             resetPasswordToken,
//             resetPasswordExpire: { $gt: Date.now() },
//         });

//         if (!user) {
//             return res.status(400).json({
//                 message: 'Invalid or expired password reset token',
//                 success: false,
//             });
//         }

//         user.password = await bcrypt.hash(password, 10);
//         user.resetPasswordToken = undefined;
//         user.resetPasswordExpire = undefined;
//         await user.save();

//         res.status(200).json({
//             message: 'Password updated successfully',
//             success: true,
//         });
//     } catch (error) {
//         console.error('Reset password error:', error);
//         res.status(500).json({ message: error.message, success: false });
//     }
// };
export const resetPassword = async(req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        console.log("🔑 Received token:", token);

        const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
        console.log("🔐 Hashed token:", resetPasswordToken);
        console.log("⏰ Current time:", Date.now());

        // 👇 1. User search
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        console.log("👤 User found:", user ? user.email : "NOT FOUND");

        // 👇 2. Agar user nahi mila
        if (!user) {
            console.log("❌ User NOT FOUND - returning error");
            return res.status(400).json({
                message: 'Invalid or expired password reset token',
                success: false,
            });
        }

        console.log("✅ User found, updating password...");

        // 👇 3. Password hash karo
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("🔒 Password hashed successfully");

        // 👇 4. User update karo
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        // 👇 5. Save karo
        await user.save();
        console.log("💾 User saved successfully");

        // 👇 6. Success response
        console.log("✅ Password reset successful!");
        return res.status(200).json({
            message: 'Password updated successfully',
            success: true,
        });

    } catch (error) {
        console.error('❌ Reset password error:', error);
        return res.status(500).json({
            message: error.message || 'Server error',
            success: false,
        });
    }
};