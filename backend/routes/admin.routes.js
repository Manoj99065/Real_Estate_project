import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js'; // correct folder name

import {
    getAllUsers,
    blockUser,
    deleteUser,
    getAllProperties,
    deleteProperty,
    getAllInquiries,
    getDashboardStats,
    getPendingSellers,
    approveSeller
} from '../controllers/admin.controller.js';

const adminRouter = express.Router();

// All routes require authentication + admin role
adminRouter.use(protect, authorize("admin"));

// Users
adminRouter.get("/users", getAllUsers);
adminRouter.patch("/users/:id/block", blockUser);
adminRouter.delete("/users/:id", deleteUser);

// Properties
adminRouter.get("/properties", getAllProperties);
adminRouter.delete("/properties/:id", deleteProperty);

// Inquiries
adminRouter.get("/inquiries", getAllInquiries);

// Dashboard
adminRouter.get("/stats", getDashboardStats);

// Seller approvals
adminRouter.get("/pending-seller", getPendingSellers);
adminRouter.patch("/approve-seller/:id", approveSeller);

export default adminRouter;