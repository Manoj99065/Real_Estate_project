// ✅ Correct imports
import User from "../models/user.model.js"; // ← ensure this file exists
import uploadToCloudinary from "../utils/UploadToCloudinary.js"; // ← default import

// Get Profile
export const getProfile = async(req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Get Public Profile
export const getPublicProfile = async(req, res) => {
    try {
        const user = await User.findById(req.params.id).select("name profilePic role createdAt");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Update Profile
export const updateProfile = async(req, res) => {
    try {
        const { name, phone, address, removeProfilePic } = req.body;

        // ✅ Ensure User model is imported and used correctly
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Handle image upload
        if (req.file) {
            // ✅ uploadToCloudinary is a default import
            const result = await uploadToCloudinary(req.file.buffer, "profiles");
            user.profilePic = result.secure_url;
        } else if (removeProfilePic === "true") {
            user.profilePic = null;
        }

        // Update fields
        if (name !== undefined) user.name = name;
        if (phone !== undefined) user.phone = phone; // ← fixed assignment
        if (address !== undefined) user.address = address;

        const updatedUser = await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (err) {
        console.error("Update Profile Error:", err); // ← log error for debugging
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};