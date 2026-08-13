import mongoose from 'mongoose';

const supportTicketSchema = new mongoose.Schema({
    user: { // Changed from 'seller' to 'user'
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    userType: { type: String, enum: ['buyer', 'seller', 'admin'], required: true }, // Track the role
    subject: { type: String, required: true },
    message: { type: String, required: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' },
}, { timestamps: true });

const SupportTicket = mongoose.model('SupportTicket', supportTicketSchema);
export default SupportTicket;