import PurchaseRequest from '../models/purchaserequest.model.js';
import Property from '../models/property.model.js';
// import Chat from '../models/chat.model.js'; // (optional, if you need chat notifications)

// ---------- Buyer creates a purchase request ----------
export const createRequest = async(req, res) => {
    try {
        const { propertyId, message } = req.body;
        const buyerId = req.user._id;

        // Check if property exists and is not sold
        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        if (property.status === 'sold') {
            return res.status(400).json({ message: 'This property is already sold' });
        }

        // Check for existing pending request from this buyer for this property
        const existing = await PurchaseRequest.findOne({
            buyer: buyerId,
            property: propertyId,
            status: 'pending',
        });
        if (existing) {
            return res.status(400).json({ message: 'You already have a pending request for this property' });
        }

        const request = new PurchaseRequest({
            buyer: buyerId,
            property: propertyId,
            seller: property.seller, // seller ID from the property
            message: message || '',
        });
        await request.save();

        res.status(201).json({ success: true, request });
    } catch (error) {
        console.error('Create purchase request error:', error);
        res.status(500).json({ message: 'Failed to create request' });
    }
};

// ---------- Check if buyer has a pending request for a property ----------
export const checkRequestStatus = async(req, res) => {
    try {
        const { propertyId } = req.params;
        const request = await PurchaseRequest.findOne({
            buyer: req.user._id,
            property: propertyId,
            status: 'pending',
        });
        res.json({ status: request ? 'pending' : null });
    } catch (error) {
        console.error('Check request status error:', error);
        res.status(500).json({ message: 'Error checking request' });
    }
};

// ---------- Get all requests for the logged-in buyer ----------
export const getBuyerRequests = async(req, res) => {
    try {
        const requests = await PurchaseRequest.find({ buyer: req.user._id })
            .populate('property', 'title price images city status')
            .populate('seller', 'name')
            .sort({ createdAt: -1 });
        res.json({ success: true, requests });
    } catch (error) {
        console.error('Get buyer requests error:', error);
        res.status(500).json({ message: 'Failed to fetch requests' });
    }
};

// ---------- Admin: get all pending requests ----------
export const getPendingRequests = async(req, res) => {
    try {
        const requests = await PurchaseRequest.find({ status: 'pending' })
            .populate('buyer', 'name email')
            .populate('property', 'title price')
            .populate('seller', 'name email');
        res.json({ success: true, requests });
    } catch (error) {
        console.error('Get pending requests error:', error);
        res.status(500).json({ message: 'Failed to fetch requests' });
    }
};

// ---------- Admin: approve a request ----------
export const approveRequest = async(req, res) => {
    try {
        const { id } = req.params;
        const request = await PurchaseRequest.findById(id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        if (request.status !== 'pending') {
            return res.status(400).json({ message: 'Request already processed' });
        }

        // Update property status to sold
        const property = await Property.findById(request.property);
        if (property) {
            property.status = 'sold';
            await property.save();
        }

        request.status = 'approved';
        await request.save();

        // (Optional) Send notification via chat or email
        // You can add logic here to send a message to the buyer

        res.json({ success: true, message: 'Request approved, property marked as sold' });
    } catch (error) {
        console.error('Approve request error:', error);
        res.status(500).json({ message: 'Failed to approve request' });
    }
};

// ---------- Admin: decline a request ----------
export const declineRequest = async(req, res) => {
    try {
        const { id } = req.params;
        const request = await PurchaseRequest.findById(id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        if (request.status !== 'pending') {
            return res.status(400).json({ message: 'Request already processed' });
        }

        request.status = 'declined';
        await request.save();

        res.json({ success: true, message: 'Request declined' });
    } catch (error) {
        console.error('Decline request error:', error);
        res.status(500).json({ message: 'Failed to decline request' });
    }
};