// chat.controller.js
import Chat from '../models/chat.model.js';

// 1. Start (or get) a chat – works for both buyer and seller
export const startChat = async(req, res) => {
    try {
        const { propertyId, sellerId } = req.body;
        const buyerId = req.user._id;

        let buyer = buyerId;
        let seller = sellerId;
        if (req.user.role === 'seller') {
            buyer = sellerId;
            seller = buyerId;
        }

        let chat = await Chat.findOne({ buyer, seller, property: propertyId })
            .populate('buyer', 'name profilePic')
            .populate('seller', 'name profilePic');

        if (chat) return res.status(200).json(chat);

        chat = new Chat({ buyer, seller, property: propertyId, messages: [] });
        await chat.save();

        const populated = await Chat.findById(chat._id)
            .populate('buyer', 'name profilePic')
            .populate('seller', 'name profilePic');

        res.status(201).json(populated);
    } catch (error) {
        console.error('Error starting chat:', error);
        res.status(500).json({ message: 'Failed to start chat' });
    }
};

// 2. Get all conversations for the logged-in user
export const getUserChats = async(req, res) => {
    try {
        const userId = req.user._id;
        const chats = await Chat.find({
                $or: [{ buyer: userId }, { seller: userId }],
            })
            .populate('buyer', 'name profilePic')
            .populate('seller', 'name profilePic')
            .sort({ updatedAt: -1 });

        res.status(200).json(chats);
    } catch (error) {
        console.error('Error fetching chats:', error);
        res.status(500).json({ message: 'Failed to fetch conversations' });
    }
};

// 3. Get a single chat with its messages
export const getChatById = async(req, res) => {
    try {
        const { chatId } = req.params;
        const chat = await Chat.findById(chatId)
            .populate('buyer', 'name profilePic')
            .populate('seller', 'name profilePic');

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        res.status(200).json(chat);
    } catch (error) {
        console.error('Error fetching chat:', error);
        res.status(500).json({ message: 'Failed to fetch chat' });
    }
};

// 4. Send a message via REST and broadcast via Socket.IO
export const sendMessage = async(req, res) => {
    try {
        const { chatId, text } = req.body;
        const senderId = req.user._id;

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        const newMessage = {
            sender: senderId,
            text: text,
        };

        chat.messages.push(newMessage);
        chat.lastMessage = text;
        await chat.save();

        const savedMessage = chat.messages[chat.messages.length - 1];

        const io = req.app.get('io');
        if (io) {
            io.to(chatId).emit('receiveMessage', {
                chatId,
                ...savedMessage.toObject(),
            });
        }

        res.status(201).json({ newMessage: savedMessage });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Failed to send message' });
    }
};

// 5. Delete an entire chat
export const deleteChat = async(req, res) => {
    try {
        const { chatId } = req.params;
        await Chat.findByIdAndDelete(chatId);
        res.status(200).json({ message: 'Chat deleted successfully' });
    } catch (error) {
        console.error('Error deleting chat:', error);
        res.status(500).json({ message: 'Failed to delete chat' });
    }
};

// 6. Delete a single message
export const deleteMessage = async(req, res) => {
    try {
        const { chatId, messageId } = req.params;
        const chat = await Chat.findById(chatId);

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        chat.messages = chat.messages.filter(
            (msg) => msg._id.toString() !== messageId
        );

        if (chat.messages.length > 0) {
            chat.lastMessage = chat.messages[chat.messages.length - 1].text;
        } else {
            chat.lastMessage = '';
        }

        await chat.save();
        res.status(200).json({ chat });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ message: 'Failed to delete message' });
    }
};