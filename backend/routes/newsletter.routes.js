import express from 'express';
import {
    subscribe,
    getSubscribers,
    unsubscribe
} from '../controllers/newsletter.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public route
router.post('/subscribe', subscribe);

// Protected routes (Admin only)
router.get('/subscribers', protect, authorize('admin'), getSubscribers);

// Unsubscribe
router.delete('/unsubscribe/:email', unsubscribe);

export default router;