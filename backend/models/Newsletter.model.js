import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    subscribedAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['active', 'unsubscribed'],
        default: 'active',
    },
}, { timestamps: true });

const Newsletter = mongoose.model('Newsletter', newsletterSchema);
export default Newsletter;