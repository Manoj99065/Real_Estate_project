import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import {
    createRequest,
    checkRequestStatus,
    getBuyerRequests,
    getPendingRequests,
    approveRequest,
    declineRequest,
} from '../controllers/purchase.controller.js';

const router = express.Router();

// Buyer routes
router.post('/request', protect, authorize('buyer'), createRequest);
router.get('/check/:propertyId', protect, authorize('buyer'), checkRequestStatus);
router.get('/my', protect, authorize('buyer'), getBuyerRequests);

// Admin routes
router.get('/admin/pending', protect, authorize('admin'), getPendingRequests);
router.put('/admin/approve/:id', protect, authorize('admin'), approveRequest);
router.put('/admin/decline/:id', protect, authorize('admin'), declineRequest);

export default router;