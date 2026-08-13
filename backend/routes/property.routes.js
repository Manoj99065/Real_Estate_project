// // import express from 'express';
// // import {
// //     getAllProperties,
// //     addProperty,
// //     getMyProperties,
// //     updateProperty,
// //     deleteProperty,
// //     updatePropertyStatus,
// //     getPropertyCounts,
// //     getPropertyDetails,
// //     getSellerDashboard
// // } from '../controllers/property.controller.js';
// // import { protect, authorize } from '../middleware/auth.middleware.js';
// // import upload from '../middleware/upload.middleware.js';


// // const propertyRouter = express.Router();


// // // Public routes
// // propertyRouter.get('/', getAllProperties);
// // propertyRouter.get('/counts', getPropertyCounts);

// // // Protected routes – only sellers
// // propertyRouter.post('/', protect, authorize('seller'), upload.array('images', 10), addProperty);
// // propertyRouter.get('/my', protect, authorize('seller'), getMyProperties);
// // propertyRouter.put('/:id', protect, authorize('seller'), upload.array('images', 10), updateProperty);
// // propertyRouter.delete('/:id', protect, authorize('seller'), deleteProperty);
// // propertyRouter.patch('/:id/status', protect, authorize('seller'), updatePropertyStatus);
// // propertyRouter.get('/seller/dashboard', protect, authorize('seller'), getSellerDashboard);

// // // Property details – must come after all specific routes (e.g., /my, /counts, /seller/dashboard)
// // propertyRouter.get('/:id', getPropertyDetails);

// // export default propertyRouter;


// import express from 'express';
// import {
//     getAllProperties,
//     addProperty,
//     getMyProperties,
//     updateProperty,
//     deleteProperty,
//     updatePropertyStatus,
//     getPropertyCounts,
//     getPropertyDetails,
//     getSellerDashboard
// } from '../controllers/property.controller.js';
// import { protect, authorize } from '../middleware/auth.middleware.js';
// import upload from '../middleware/upload.middleware.js';

// const propertyRouter = express.Router();

// // Public routes
// propertyRouter.get('/', getAllProperties);
// propertyRouter.get('/counts', getPropertyCounts);

// // Protected routes – only sellers
// propertyRouter.post('/', protect, authorize('seller'), upload.array('images', 10), addProperty);
// propertyRouter.get('/my', protect, authorize('seller'), getMyProperties); // existing
// propertyRouter.get('/seller', protect, authorize('seller'), getMyProperties); // ✅ NEW – matches frontend
// propertyRouter.put('/:id', protect, authorize('seller'), upload.array('images', 10), updateProperty);
// propertyRouter.delete('/:id', protect, authorize('seller'), deleteProperty);
// propertyRouter.patch('/:id/status', protect, authorize('seller'), updatePropertyStatus);
// propertyRouter.get('/seller/dashboard', protect, authorize('seller'), getSellerDashboard); // stats

// // Property details – must come after all specific routes (e.g., /my, /counts, /seller/dashboard)
// propertyRouter.get('/:id', getPropertyDetails);

// export default propertyRouter;


import express from 'express';
import {
    getAllProperties,
    addProperty,
    getMyProperties,
    updateProperty,
    deleteProperty,
    updatePropertyStatus,
    getPropertyCounts,
    getPropertyDetails,
    getSellerDashboard,
    incrementInterest, // 👈 add this
} from '../controllers/property.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const propertyRouter = express.Router();

// Public routes
propertyRouter.get('/', getAllProperties);
propertyRouter.get('/counts', getPropertyCounts);

// Protected routes – only sellers
propertyRouter.post('/', protect, authorize('seller'), upload.array('images', 10), addProperty);
propertyRouter.get('/my', protect, authorize('seller'), getMyProperties);
propertyRouter.get('/seller', protect, authorize('seller'), getMyProperties);
propertyRouter.put('/:id', protect, authorize('seller'), upload.array('images', 10), updateProperty);
propertyRouter.delete('/:id', protect, authorize('seller'), deleteProperty);
propertyRouter.patch('/:id/status', protect, authorize('seller'), updatePropertyStatus);
propertyRouter.get('/seller/dashboard', protect, authorize('seller'), getSellerDashboard);

// 🆕 Buyer interest route – must come BEFORE the generic /:id route
propertyRouter.post('/property/:id/interest', protect, incrementInterest);

// Property details – catch‑all must be LAST
propertyRouter.get('/:id', getPropertyDetails);

export default propertyRouter;