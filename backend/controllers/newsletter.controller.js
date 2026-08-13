import Newsletter from '../models/Newsletter.model.js';

// ---------- PUBLIC: Subscribe to newsletter ----------
export const subscribe = async(req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
        }

        // Check if already exists
        let existing = await Newsletter.findOne({ email });

        if (existing) {
            if (existing.status === 'active') {
                return res.status(400).json({
                    success: false,
                    message: 'This email is already subscribed.',
                });
            } else {
                // Reactivate if previously unsubscribed
                existing.status = 'active';
                await existing.save();
                return res.json({
                    success: true,
                    message: 'Welcome back! You have been re-subscribed.',
                });
            }
        }

        const subscriber = new Newsletter({ email });
        await subscriber.save();

        res.status(201).json({
            success: true,
            message: 'Successfully subscribed! 🎉',
        });
    } catch (error) {
        console.error('❌ Newsletter subscription error:', error);
        let message = 'Failed to subscribe. Please try again later.';

        if (error.code === 11000) {
            message = 'This email is already subscribed.';
        } else if (error.name === 'ValidationError') {
            message = Object.values(error.errors)
                .map(e => e.message)
                .join(', ');
        }

        res.status(500).json({ success: false, message });
    }
};

// ---------- ADMIN: Get all active subscribers ----------
export const getSubscribers = async(req, res) => {
    try {
        const subscribers = await Newsletter.find({ status: 'active' })
            .sort({ subscribedAt: -1 });
        res.json({
            success: true,
            count: subscribers.length,
            subscribers,
        });
    } catch (error) {
        console.error('Error fetching subscribers:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch subscribers.',
        });
    }
};

// ---------- PUBLIC: Unsubscribe (by email) ----------
export const unsubscribe = async(req, res) => {
    try {
        const { email } = req.params;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        const subscriber = await Newsletter.findOne({ email });

        if (!subscriber) {
            return res.status(404).json({ success: false, message: 'Email not found.' });
        }

        subscriber.status = 'unsubscribed';
        await subscriber.save();

        res.json({
            success: true,
            message: 'You have been unsubscribed successfully.',
        });
    } catch (error) {
        console.error('Unsubscribe error:', error);
        res.status(500).json({ success: false, message: 'Failed to unsubscribe.' });
    }
};