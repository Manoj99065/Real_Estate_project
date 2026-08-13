import express from 'express';
import {
    register,
    login, // added
    getMe, // added (fixed typo from geMe)
    verifyEmail, // added
    forgotPassword, // added
    resetPassword // added
} from '../controllers/auth.controller.js';


import { protect } from '../middleware/auth.middleware.js';
const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);

authRouter.get("/me", protect, getMe);
authRouter.post("/verify-email", verifyEmail);

authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password/:token", resetPassword);



export default authRouter;