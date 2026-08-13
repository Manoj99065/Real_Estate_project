import mongoose from "mongoose";
import { protect } from '../middleware/auth.middleware.js';


const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
        required: true,
    },
}, {
    timestamps: true, // adds createdAt and updatedAt automatically
});

// Ensure a user can add a property only once to their wishlist
wishlistSchema.index({ user: 1, property: 1 }, { unique: true });

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
export default Wishlist;