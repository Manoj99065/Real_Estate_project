import Property from "../models/property.model.js";
import Inquiry from "../models/inquiry.model.js";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";
import uploadToCloudinary from "../utils/UploadToCloudinary.js";
// ---------- NEWSLETTER IMPORTS ----------
import Newsletter from "../models/Newsletter.model.js";
import { sendNewsletterEmail } from "../utils/email.js";

// ==================== ADD PROPERTY ====================
export const addProperty = async(req, res) => {
    try {
        console.log("📦 Received body:", req.body);
        console.log("📎 Files:", req.files ? req.files.length : 0);

        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                try {
                    const result = await uploadToCloudinary(file.buffer);
                    imageUrls.push(result.secure_url);
                } catch (uploadErr) {
                    console.error("Cloudinary upload error:", uploadErr.message);
                }
            }
        }

        const propertyData = {
            title: req.body.title,
            description: req.body.description || "",
            price: Number(req.body.price),
            city: req.body.city,
            area: req.body.area,
            pincode: req.body.pincode || "",
            propertyType: req.body.propertyType || "flat",
            bhk: req.body.bhk ? String(req.body.bhk) : "1",
            bathrooms: req.body.bathrooms ? Number(req.body.bathrooms) : 1,
            areaSize: Number(req.body.areaSize) || 0,
            furnishing: req.body.furnishing || "unfurnished",
            status: req.body.status || "sale",
            images: imageUrls,
            seller: req.user._id,
            amenities: Array.isArray(req.body.amenities) ?
                req.body.amenities : req.body.amenities ?
                req.body.amenities.split(",").map(a => a.trim()) : [],
        };

        Object.keys(propertyData).forEach(
            (key) => propertyData[key] === undefined && delete propertyData[key]
        );

        const property = await Property.create(propertyData);

        // ---------- NEWSLETTER: SEND TO ALL ACTIVE SUBSCRIBERS ----------
        try {
            const subscribers = await Newsletter.find({ status: "active" });
            if (subscribers.length > 0) {
                subscribers.forEach((sub) => {
                    sendNewsletterEmail(sub.email, {
                        propertyTitle: property.title,
                        propertyPrice: property.price,
                        propertyLocation: `${property.area}, ${property.city}`,
                        propertyImage: (property.images && property.images[0]) || '', // safe fallback
                        propertyId: property._id,
                    });
                });
                console.log(`📧 Newsletter sent to ${subscribers.length} subscribers.`);
            }
        } catch (emailErr) {
            console.error("❌ Failed to send newsletter emails:", emailErr);
        }

        res.status(201).json({ success: true, message: "Property added", property });
    } catch (error) {
        console.error("🔥 ADD_PROPERTY_ERROR:", error);
        if (error.name === "ValidationError") {
            console.error("📌 Validation errors:", JSON.stringify(error.errors, null, 2));
        }
        res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};

// ==================== GET MY PROPERTIES ====================
export const getMyProperties = async(req, res) => {
    try {
        const properties = await Property.find({ seller: req.user._id });
        res.json({ success: true, properties });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== UPDATE PROPERTY ====================
export const updateProperty = async(req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ success: false, message: "Property not found" });
        if (property.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        const fields = [
            "title", "description", "price", "city", "area", "pincode",
            "propertyType", "bhk", "bathrooms", "areaSize", "furnishing",
            "status", "amenities",
        ];
        fields.forEach((field) => {
            if (req.body[field] !== undefined) {
                if (field === "amenities" && typeof req.body[field] === "string") {
                    try {
                        property[field] = JSON.parse(req.body[field]);
                    } catch (e) {
                        property[field] = req.body[field].split(",");
                    }
                } else {
                    property[field] = req.body[field];
                }
            }
        });

        if (req.body.existingImages) {
            try {
                const existing = JSON.parse(req.body.existingImages);
                property.images = Array.isArray(existing) ? existing : property.images;
            } catch (e) {
                console.error("Failed to parse existingImages:", e);
            }
        }

        if (req.files && req.files.length > 0) {
            let newImages = [];
            for (let file of req.files) {
                const result = await uploadToCloudinary(file.buffer);
                newImages.push(result.secure_url);
            }
            property.images = [...property.images, ...newImages];
        }

        await property.save();
        res.json({ success: true, message: "Property updated", property });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== DELETE PROPERTY ====================
export const deleteProperty = async(req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ success: false, message: "Property not found" });
        if (property.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        for (let imageUrl of property.images) {
            try {
                const publicId = imageUrl.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy("Properties/" + publicId);
            } catch (err) {
                console.error("Failed to delete image from Cloudinary:", err.message);
            }
        }

        await property.deleteOne();
        res.json({ success: true, message: "Property deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== UPDATE PROPERTY STATUS ====================
export const updatePropertyStatus = async(req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ success: false, message: "Property not found" });
        if (property.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }
        property.status = req.body.status;
        await property.save();
        res.json({ success: true, message: "Property status updated", property });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== GET ALL PROPERTIES ====================
export const getAllProperties = async(req, res) => {
    try {
        const {
            city,
            area,
            pincode,
            propertyType,
            bhk,
            furnishing,
            status,
            minPrice,
            maxPrice,
            amenities,
            sort,
            seller,
        } = req.query;

        let query = {};
        if (seller) query.seller = seller;
        if (city) query.city = new RegExp(city, "i");
        if (area) query.area = new RegExp(area, "i");
        if (pincode) query.pincode = pincode;

        if (propertyType) {
            query.propertyType = { $in: propertyType.toLowerCase().split(",") };
        }
        if (bhk) {
            query.bhk = bhk === "5+" ? { $gte: "5" } : bhk;
        }
        if (furnishing) {
            const furnishingArray = furnishing.split(",");
            query.furnishing = {
                $in: furnishingArray.map((f) => new RegExp(`^${f.trim()}$`, "i")),
            };
        }
        if (status) query.status = status;

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice && !isNaN(minPrice)) query.price.$gte = Number(minPrice);
            if (maxPrice && !isNaN(maxPrice)) query.price.$lte = Number(maxPrice);
            if (Object.keys(query.price).length === 0) delete query.price;
        }

        if (amenities) {
            query.amenities = { $in: amenities.split(",").map((a) => a.trim()) };
        }

        let sortOption = { createdAt: -1 };
        if (sort === "priceLow") sortOption = { price: 1 };
        if (sort === "priceHigh") sortOption = { price: -1 };
        if (sort === "latest") sortOption = { createdAt: -1 };

        const properties = await Property.find(query)
            .populate("seller", "name phone profilePic")
            .sort(sortOption);

        res.json({ success: true, count: properties.length, properties });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error while fetching properties",
            error: error.message,
        });
    }
};

// ==================== GET PROPERTY DETAILS ====================
export const getPropertyDetails = async(req, res) => {
    try {
        const property = await Property.findById(req.params.id).populate(
            "seller",
            "name email phone profilePic"
        );
        if (!property) return res.status(404).json({ success: false, message: "Property not found" });

        let visitorId = req.ip;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            try {
                const token = authHeader.split(" ")[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                visitorId = decoded.id;
            } catch (err) {
                // ignore
            }
        }

        if (property.seller && property.seller._id) {
            const sellerId = property.seller._id.toString();
            if (visitorId !== sellerId && !(property.viewedBy && property.viewedBy.includes(visitorId))) {
                property.views = (property.views || 0) + 1;
                if (!property.viewedBy) property.viewedBy = [];
                property.viewedBy.push(visitorId);
                await property.save();
            }
        }

        const similarProperties = await Property.find({
                _id: { $ne: property._id },
                city: property.city,
                propertyType: property.propertyType,
                status: property.status,
            })
            .limit(4)
            .select("title price images city area propertyType bhk areaSize status");

        res.json({ success: true, property, similarProperties });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error while fetching property details",
            error: error.message,
        });
    }
};

// ==================== INCREMENT BUYER INTEREST ====================
export const incrementInterest = async(req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        if (req.user.role !== 'buyer') {
            return res.status(403).json({ message: 'Only buyers can express interest' });
        }

        property.buyerInterestCount = (property.buyerInterestCount || 0) + 1;
        await property.save();

        res.status(200).json({
            message: 'Interest recorded',
            count: property.buyerInterestCount,
        });
    } catch (error) {
        console.error('Error incrementing interest:', error);
        res.status(500).json({ message: 'Failed to record interest' });
    }
};

// ==================== SELLER DASHBOARD STATS ====================
export const getSellerDashboard = async(req, res) => {
    try {
        const sellerId = req.user._id;

        const [totalProperties, activeListings, soldProperties, totalInquiries, viewsData] =
        await Promise.all([
            Property.countDocuments({ seller: sellerId }),
            Property.countDocuments({ seller: sellerId, status: "sale" }),
            Property.countDocuments({ seller: sellerId, status: "sold" }),
            Inquiry.countDocuments({ seller: sellerId }),
            Property.aggregate([
                { $match: { seller: sellerId } },
                { $group: { _id: null, totalViews: { $sum: "$views" } } },
            ]),
        ]);

        const totalViews = viewsData.length > 0 ? viewsData[0].totalViews : 0;

        res.json({
            success: true,
            stats: { totalProperties, activeListings, soldProperties, totalInquiries, totalViews },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==================== PROPERTY COUNTS BY TYPE ====================
// export const getPropertyCounts = async(req, res) => {
//     try {
//         const counts = await Property.aggregate([
//             { $match: { status: { $in: ["sale", "rent", "sold", "pending"] } } },
//             { $group: { _id: "$propertyType", count: { $sum: 1 } } },
//         ]);

//         const formattedCounts = { flat: 0, villa: 0, penthouse: 0, commercial: 0 };

//         if (counts && counts.length > 0) {
//             counts.forEach((item) => {
//                 const type = (item._id || "").toLowerCase();
//                 if (type.includes("flat") || type.includes("apartment")) {
//                     formattedCounts.flat = item.count;
//                 } else if (type.includes("villa")) {
//                     formattedCounts.villa = item.count;
//                 } else if (type.includes("penthouse")) {
//                     formattedCounts.penthouse = item.count;
//                 } else if (type.includes("commercial") || type.includes("shop") || type.includes("office")) {
//                     formattedCounts.commercial = item.count;
//                 }
//             });
//         }

//         res.json({ success: true, counts: formattedCounts });
//     } catch (error) {
//         console.error("❌ /counts endpoint error:", error.message);
//         res.status(500).json({
//             success: false,
//             message: "Internal server error fetching counts",
//             error: error.message,
//         });
//     }
// };


export const getPropertyCounts = async(req, res) => {
    try {
        // Dono fields se data lao
        const [typeCounts, categoryCounts] = await Promise.all([
            Property.aggregate([
                { $group: { _id: "$propertyType", count: { $sum: 1 } } }
            ]),
            Property.aggregate([
                { $group: { _id: "$category", count: { $sum: 1 } } }
            ])
        ]);

        // Dono ko merge karo
        const combined = {};
        [...typeCounts, ...categoryCounts].forEach(item => {
            const key = (item._id || "").toLowerCase();
            if (key.includes("flat") || key.includes("apartment")) {
                combined.flat = (combined.flat || 0) + item.count;
            } else if (key.includes("villa") || key.includes("house")) {
                combined.villa = (combined.villa || 0) + item.count;
            } else if (key.includes("penthouse")) {
                combined.penthouse = (combined.penthouse || 0) + item.count;
            } else if (key.includes("commercial") || key.includes("shop") || key.includes("office")) {
                combined.commercial = (combined.commercial || 0) + item.count;
            }
        });

        const formattedCounts = {
            flat: combined.flat || 0,
            villa: combined.villa || 0,
            penthouse: combined.penthouse || 0,
            commercial: combined.commercial || 0,
        };

        res.json({ success: true, counts: formattedCounts });
    } catch (error) {
        console.error("❌ /counts endpoint error:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error fetching counts",
            error: error.message,
        });
    }
};