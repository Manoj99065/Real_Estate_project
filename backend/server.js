import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import http from 'http';
import { Server } from 'socket.io';
import { connectDB } from './config/db.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import propertyRouter from './routes/property.routes.js';
import inquiryRouter from './routes/inquiry.routes.js';
import wishlistRouter from './routes/wishlist.routes.js';
import chatRouter from './routes/chat.routes.js';
import contactRouter from './routes/contact.routes.js';
import adminRouter from './routes/admin.routes.js';
import purchaseRoutes from './routes/purchase.routes.js';
import newsletterRoutes from './routes/newsletter.routes.js';
import supportRoutes from './routes/support.routes.js';




const app = express();


// CORS - Localhost ke liye sab allow (403 fix)
app.use(cors({ origin: true, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/property', propertyRouter);
app.use('/api/inquiry', inquiryRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/contact', contactRouter);
app.use('/api/admin', adminRouter);
app.use('/api/chat', chatRouter);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/support', supportRoutes);





app.get('/', (req, res) => res.send('API WORKING'));

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Socket.IO setup
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: true, credentials: true },
});

// ✅ CRITICAL: Attach 'io' to the app so chat.controller can use it
app.set('io', io);

io.on('connection', (socket) => {
    console.log(`🟢 Client connected: ${socket.id}`);

    socket.on('joinChat', (chatId) => {
        socket.join(chatId);
        console.log(`📩 Socket ${socket.id} joined chat: ${chatId}`);
    });

    // This keeps a backup direct socket connection for real-time
    socket.on('sendMessage', (data) => {
        io.to(data.chatId).emit('receiveMessage', data);
    });

    socket.on('disconnect', () => console.log(`🔴 Client disconnected: ${socket.id}`));
});

// Server start
const PORT = process.env.PORT || 5000;
try {
    await connectDB();
    server.listen(PORT, () => console.log(`🚀 Server started on http://localhost:${PORT}`));
} catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
}