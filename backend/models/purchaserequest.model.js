import mongoose from 'mongoose';

const purchaseRequestSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true,
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'declined'],
        default: 'pending',
    },
    message: {
        type: String,
        default: '',
    },
    adminMessage: {
        type: String,
        default: '',
    },
}, { timestamps: true });

const PurchaseRequest = mongoose.model('PurchaseRequest', purchaseRequestSchema);
export default PurchaseRequest;