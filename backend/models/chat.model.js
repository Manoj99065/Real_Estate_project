import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    image: {
        type: String, // URL to uploaded image
    },
}, { timestamps: true });

const chatSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
    },
    messages: [messageSchema],
    lastMessage: {
        type: String,
    },
}, { timestamps: true });

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;