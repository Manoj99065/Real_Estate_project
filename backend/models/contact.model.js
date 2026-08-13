import mongoose from 'mongoose'; // (or const mongoose = require('mongoose') if using CommonJS)

const contactSchema = new mongoose.Schema({
    // ... your existing schema fields here ...
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    // etc...
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);

// 🔥 THIS LINE RIGHT HERE is the critical part:
export default Contact;