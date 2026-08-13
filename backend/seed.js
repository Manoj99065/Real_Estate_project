import mongoose from "mongoose";
import dotenv from "dotenv";
import Property from "./models/property.model.js"; // Adjust path if necessary
import User from "./models/user.model.js"; // Need to find a seller ID

dotenv.config();

const seedDatabase = async() => {
    try {
        // 1. Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log("🟢 Connected to MongoDB");

        // 2. Clear existing properties (optional, prevents duplicates)
        await Property.deleteMany({});
        console.log("🗑️ Cleared old properties");

        // 3. Get a valid seller ID from your database
        // If your DB doesn't have any users yet, this will fail.
        // You can replace this with a real ID from your MongoDB Compass, or
        // create a dummy ObjectId.
        const seller = await User.findOne();
        const sellerId = seller ? seller._id : new mongoose.Types.ObjectId("65f2a1b2c3d4e5f6a7b8c9d0");

        // 4. Create dummy properties that exactly match your mapping
        const dummyProperties = [{
                title: "Luxury 2BHK Apartment",
                description: "A beautiful modern flat with great amenities.",
                price: 7500000,
                city: "Mumbai",
                area: "Andheri East",
                pincode: "400093",
                propertyType: "Apartment", // 🌟 This maps to 'flat' in your controller
                bhk: "2",
                bathrooms: 2,
                areaSize: 1050,
                furnishing: "Fully Furnished",
                status: "sale", // 🌟 Must be 'sale' to be counted
                images: [],
                amenities: ["Parking", "Security", "Lift"],
                seller: sellerId,
            },
            {
                title: "Premium Luxury Villa",
                description: "Spacious 4BHK villa with a private pool.",
                price: 25000000,
                city: "Bangalore",
                area: "Whitefield",
                pincode: "560066",
                propertyType: "Villa", // 🌟 Maps to 'villa'
                bhk: "4",
                bathrooms: 4,
                areaSize: 2800,
                furnishing: "Semi-Furnished",
                status: "sale",
                images: [],
                amenities: ["Swimming Pool", "Garden", "Security"],
                seller: sellerId,
            },
            {
                title: "Skyline Penthouse",
                description: "Luxury penthouse with panoramic city views.",
                price: 18000000,
                city: "Delhi",
                area: "South Delhi",
                pincode: "110025",
                propertyType: "Penthouse", // 🌟 Maps to 'penthouse'
                bhk: "3",
                bathrooms: 3,
                areaSize: 2200,
                furnishing: "Fully Furnished",
                status: "sale",
                images: [],
                amenities: ["Terrace", "Clubhouse", "Lift"],
                seller: sellerId,
            },
            {
                title: "Prime Commercial Office",
                description: "High-traffic commercial space for rent/sale.",
                price: 50000000,
                city: "Mumbai",
                area: "Bandra Kurla Complex",
                pincode: "400051",
                propertyType: "Commercial", // 🌟 Maps to 'commercial'
                bhk: undefined, // Commercial doesn't have BHK
                bathrooms: 2,
                areaSize: 1200,
                furnishing: "Unfurnished",
                status: "sale",
                images: [],
                amenities: ["Parking", "Air Conditioning", "Power Backup"],
                seller: sellerId,
            },
        ];

        // 5. Insert the data
        await Property.insertMany(dummyProperties);
        console.log("✅ Seed data inserted successfully!");
        console.log(`🟢 Added ${dummyProperties.length} properties.`);

        // 6. Disconnect and exit
        await mongoose.disconnect();
        console.log("🔌 Disconnected from MongoDB");
        process.exit(0);

    } catch (error) {
        console.error("🔴 Error seeding database:", error);
        process.exit(1);
    }
};

seedDatabase();