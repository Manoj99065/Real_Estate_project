import express from 'express';
import { createContact, getAllContacts } from '../controllers/contact.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const contactRouter = express.Router();

// Routes
contactRouter.post("/", createContact); // ✅ no auth required
contactRouter.get("/", protect, authorize("admin"), getAllContacts); // ✅ admin only

export default contactRouter; // ✅ no parentheses