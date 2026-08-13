// createAdmin.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// 1️⃣ Define the User schema (copy your actual schema fields)
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['buyer', 'seller', 'admin'], default: 'buyer' },
    isVerified: { type: Boolean, default: false },
    phone: { type: String },
    // add any other fields your User model has
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// 2️⃣ Connect and create admin
const createAdmin = async() => {
    try {
        const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/realestate'; // 👈 change to your DB name
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existing = await User.findOne({ role: 'admin' });
        if (existing) {
            console.log(`⚠️ Admin already exists: ${existing.email}`);
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash('admin123', 10);
        const admin = new User({
            name: 'Super Admin',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin',
            isVerified: true,
        });
        await admin.save();
        console.log('✅ Admin user created successfully!');
        console.log('📧 Email: admin@example.com');
        console.log('🔑 Password: admin123');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

createAdmin();