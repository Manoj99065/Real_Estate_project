import cloudinary from "../config/cloudinary.js";
import streamifier from 'streamifier';

const uploadToCloudinary = (buffer, folder = "general") => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({ folder },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

export default uploadToCloudinary;