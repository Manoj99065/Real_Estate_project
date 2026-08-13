const mongoose = require('mongoose');

const resetTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    token: {
        type: String,
        required: true,
        unique: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    },
    used: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('ResetToken', resetTokenSchema);