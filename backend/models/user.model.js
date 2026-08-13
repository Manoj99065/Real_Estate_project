// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     phone: { type: String },
//     address: { type: String },
//     profilePic: { type: String },
//     role: { type: String, enum: ['buyer', 'seller', 'admin'], default: 'buyer' },
//     createdAt: { type: Date, default: Date.now },


//     // extra add below

//     resetPasswordToken: { type: String },
//     resetPasswordExpire: { type: Date }
// });

// const User = mongoose.model('User', userSchema);
// export default User;


import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    profilePic: { type: String },
    role: {
        type: String,
        enum: ['buyer', 'seller', 'admin'],
        default: 'buyer',
    },

    // ✅ Email verification fields (MISSING BEFORE)
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
    },

    // ✅ Password reset fields
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpire: {
        type: Date,
    },

    // ✅ Block status
    isBlocked: {
        type: Boolean,
        default: false,
    },

    // createdAt: {
    //     type: Date,
    //     default: Date.now,
    // },

    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);
export default User;