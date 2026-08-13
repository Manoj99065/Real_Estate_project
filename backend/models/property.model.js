// // import mongoose from "mongoose";
// // const propertySchema = new mongoose.Schema({

// //     title: {
// //         type: String,
// //         required: true,
// //     },
// //     description: {
// //         type: String,
// //         required: true,
// //     },
// //     price: {
// //         type: Number,
// //         required: true,
// //     },
// //     city: {
// //         type: String,
// //         required: true,
// //     },
// //     area: {
// //         type: String,
// //         required: true,
// //     },
// //     // pincode: {
// //     //     type: String,
// //     //     required: true,
// //     // },
// //     propertyType: {
// //         type: String,
// //         enum: [
// //             "flat",
// //             "apartment",
// //             "villa",
// //             "house",
// //             "studio",
// //             "penthouse",
// //             "office",
// //             "townhouse",
// //             "plot",
// //             "commercial",
// //         ],
// //         required: true,
// //     },
// //     bhk: {
// //         type: String,
// //     },
// //     bathrooms: {
// //         type: Number,
// //     },
// //     areaSize: {
// //         type: Number,
// //     },
// //     furnishing: {
// //         type: String,
// //         enum: ["furnished", "semi-furnished", "unfurnished"],
// //     },
// //     amenities: [{
// //         type: String,
// //     }, ],
// //     status: {
// //         type: String,
// //         // enum: ["sale", "sold"],
// //         enum: ['for-sale', 'for-rent', 'sold', 'pending'],
// //         default: "sale",
// //     },
// //     images: [{ type: String }],
// //     seller: {
// //         type: mongoose.Schema.Types.ObjectId,
// //         ref: "User",
// //         required: true,
// //     },
// //     isVerified: {
// //         type: Boolean,
// //         default: false,
// //     },
// //     views: {
// //         type: Number,
// //         default: 0,
// //     },
// //     viewedBy: [{ type: String }],
// //     // viewedBy: {
// //     //     type: [String],
// //     //     default: [] // <-- MAKE SURE THIS LINE EXISTS
// //     // }


// // }, {
// //     timestamps: true
// // });


// // const Property = mongoose.model("Property", propertySchema);
// // export default Property;

// import mongoose from "mongoose";

// const propertySchema = new mongoose.Schema({
//     title: {
//         type: String,
//         required: true,
//     },
//     description: {
//         type: String,
//         default: "", // ✅ Not required – can be empty
//     },
//     price: {
//         type: Number,
//         required: true,
//     },
//     city: {
//         type: String,
//         required: true,
//     },
//     area: {
//         type: String,
//         required: true,
//     },
//     pincode: {
//         type: String,
//         default: "", // ✅ Optional – added for frontend compatibility
//     },
//     propertyType: {
//         type: String,
//         enum: [
//             "flat",
//             "apartment",
//             "villa",
//             "house",
//             "studio",
//             "penthouse",
//             "office",
//             "townhouse",
//             "plot",
//             "commercial",
//         ],
//         default: "flat", // ✅ Default value
//     },
//     bhk: {
//         type: String,
//         default: "1",
//     },
//     bathrooms: {
//         type: Number,
//         default: 1,
//     },
//     areaSize: {
//         type: Number,
//         required: true,
//     },
//     furnishing: {
//         type: String,
//         enum: ["furnished", "semi-furnished", "unfurnished"],
//         default: "unfurnished",
//     },
//     amenities: {
//         type: [String],
//         default: [],
//     },
//     status: {
//         type: String,
//         enum: ["sale", "rent", "sold", "pending"], // ✅ Fixed – matches frontend
//         default: "sale",
//     },
//     images: {
//         type: [String],
//         default: [],
//     },
//     seller: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true,
//     },
//     isVerified: {
//         type: Boolean,
//         default: false,
//     },
//     views: {
//         type: Number,
//         default: 0,
//     },
//     viewedBy: {
//         type: [String],
//         default: [],
//     },
// }, {
//     timestamps: true,
// });

// const Property = mongoose.model("Property", propertySchema);
// export default Property;


import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    price: {
        type: Number,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    area: {
        type: String,
        required: true,
    },
    pincode: {
        type: String,
        default: "",
    },
    propertyType: {
        type: String,
        enum: [
            "flat",
            "apartment",
            "villa",
            "house",
            "studio",
            "penthouse",
            "office",
            "townhouse",
            "plot",
            "commercial",
        ],
        default: "flat",
    },
    bhk: {
        type: String,
        default: "1",
    },
    bathrooms: {
        type: Number,
        default: 1,
    },
    areaSize: {
        type: Number,
        required: true,
    },
    furnishing: {
        type: String,
        enum: ["furnished", "semi-furnished", "unfurnished"],
        default: "unfurnished",
    },
    amenities: {
        type: [String],
        default: [],
    },
    status: {
        type: String,
        enum: ["sale", "rent", "sold", "pending"],
        default: "sale",
    },
    images: {
        type: [String],
        default: [],
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    views: {
        type: Number,
        default: 0,
    },
    viewedBy: {
        type: [String],
        default: [],
    },
    // 👇 NEW FIELD – tracks buyer interest
    buyerInterestCount: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

const Property = mongoose.model("Property", propertySchema);
export default Property;