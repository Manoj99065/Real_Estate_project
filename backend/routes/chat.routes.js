// import express from 'express';
// import {
//     startChat,
//     getUserChats,
//     getChatById,
//     sendMessage,
//     deleteChat,
//     deleteMessage
// } from '../controllers/chat.controller.js';
// import { authMiddleware } from '../middleware/auth.middleware.js'; // Assuming you have this

// const router = express.Router();

// // All routes require authentication
// router.use(authMiddleware);

// router.post('/start', startChat);
// router.get('/user', getUserChats);
// router.get('/:chatId', getChatById);
// router.post('/send', sendMessage);
// router.delete('/:chatId', deleteChat);
// router.delete('/:chatId/message/:messageId', deleteMessage);

// export default router;

import express from 'express';
import {
    startChat,
    getUserChats,
    getChatById,
    sendMessage,
    deleteChat,
    deleteMessage
} from '../controllers/chat.controller.js';
// ✅ FIXED: import 'protect' because it is named 'protect' in auth.middleware.js
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.post('/start', startChat);
router.get('/user', getUserChats);
router.get('/:chatId', getChatById);
router.post('/send', sendMessage);
router.delete('/:chatId', deleteChat);
router.delete('/:chatId/message/:messageId', deleteMessage);

export default router;