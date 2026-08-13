import SupportTicket from '../models/SupportTicket.model.js';

// ==================== USER FUNCTIONS ====================

// ---------- Create a support ticket (buyer/seller) ----------
export const createSupportTicket = async(req, res) => {
    try {
        const { subject, message, priority } = req.body;

        // Basic validation
        if (!subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'Subject and message are required.',
            });
        }

        const ticket = await SupportTicket.create({
            user: req.user._id,
            userType: req.user.role, // 'buyer' or 'seller'
            subject,
            message,
            priority: priority || 'medium',
            status: 'Pending',
        });

        res.status(201).json({
            success: true,
            message: 'Support ticket created successfully.',
            ticket,
        });
    } catch (error) {
        console.error('Create ticket error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create ticket.',
        });
    }
};

// ---------- Get all tickets for the logged-in user ----------
export const getMyTickets = async(req, res) => {
    try {
        const tickets = await SupportTicket.find({ user: req.user._id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            tickets,
        });
    } catch (error) {
        console.error('Get my tickets error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch tickets.',
        });
    }
};

// ==================== ADMIN FUNCTIONS ====================

// ---------- Get statistics (total, active, solved, seller/buyer counts) ----------
export const adminGetStats = async(req, res) => {
    try {
        const total = await SupportTicket.countDocuments();
        const active = await SupportTicket.countDocuments({ status: { $ne: 'Resolved' } });
        const solved = await SupportTicket.countDocuments({ status: 'Resolved' });
        const sellerQueries = await SupportTicket.countDocuments({ userType: 'seller' });
        const buyerQueries = await SupportTicket.countDocuments({ userType: 'buyer' });

        res.status(200).json({
            success: true,
            stats: { total, active, solved, sellerQueries, buyerQueries },
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch stats.',
        });
    }
};

// ---------- Get all tickets (admin) ----------
export const adminGetAllTickets = async(req, res) => {
    try {
        const tickets = await SupportTicket.find()
            .populate('user', 'name email phone profilePic')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            tickets,
        });
    } catch (error) {
        console.error('Admin get all tickets error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch tickets.',
        });
    }
};

// ---------- Update ticket status (admin) ----------
export const adminUpdateStatus = async(req, res) => {
    try {
        const { status } = req.body;
        const ticket = await SupportTicket.findByIdAndUpdate(
            req.params.id, { status }, { new: true, runValidators: true }
        );

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found.',
            });
        }

        res.status(200).json({
            success: true,
            message: `Ticket status updated to ${status}.`,
            ticket,
        });
    } catch (error) {
        console.error('Admin update status error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update ticket status.',
        });
    }
};