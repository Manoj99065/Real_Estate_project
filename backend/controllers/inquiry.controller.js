import Inquiry from "../models/inquiry.model.js";
import Property from "../models/property.model.js";

// Buyer sends an inquiry
export const sendInquiry = async(req, res) => {
    try {
        const { propertyId, message } = req.body;

        if (!propertyId || !message) {
            return res.status(400).json({
                success: false,
                message: "Property ID and message are required",
            });
        }

        const property = await Property.findById(propertyId).populate("seller");
        if (!property) {
            return res.status(404).json({
                success: false,
                message: "Property not found",
            });
        }

        const inquiry = await Inquiry.create({
            property: property._id,
            buyer: req.user._id, // Assumes auth middleware sets req.user
            seller: property.seller._id,
            message,
        });

        res.status(201).json({
            success: true,
            message: "Inquiry sent successfully!",
            inquiry,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Seller views their own inquiries
export const getSellerInquiries = async(req, res) => {
    try {
        // Only fetch inquiries where the seller is the logged-in user
        const inquiries = await Inquiry.find({ seller: req.user._id })
            .populate("buyer", "name email phone")
            .populate("property", "title price images city")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: inquiries.length, // fixed typo
            inquiries,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Mark an inquiry as read (seller only)
export const markAsRead = async(req, res) => {
    try {
        const inquiry = await Inquiry.findById(req.params.id);

        if (!inquiry) {
            return res.status(404).json({
                success: false,
                message: "Inquiry not found",
            });
        }

        // Ensure the inquiry belongs to the logged-in seller
        if (inquiry.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to modify this inquiry",
            });
        }

        inquiry.isRead = true;
        await inquiry.save();

        res.json({
            success: true,
            message: "Marked as read",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};