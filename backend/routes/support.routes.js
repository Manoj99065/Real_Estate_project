import express from 'express';
import {
    createSupportTicket,
    getMyTickets,
    adminGetStats,
    adminGetAllTickets,
    adminUpdateStatus,
} from '../controllers/support.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// User routes
router.post('/create', protect, createSupportTicket);
router.get('/my-tickets', protect, getMyTickets);

// Admin routes
router.use(protect, authorize('admin')); // all routes after this require admin
router.get('/admin/stats', adminGetStats);
router.get('/admin/all', adminGetAllTickets);
router.put('/admin/update/:id', adminUpdateStatus);

export default router;