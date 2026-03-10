import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload an image (buffer or base64) to Cloudinary
 * @param {string} file - base64 string or file path
 * @param {string} folder - destination folder in Cloudinary
 * @returns {Promise<object>} - result object containing secure_url and public_id
 */
export const uploadImage = async (file, folder = 'speakers') => {
    try {
        const result = await cloudinary.uploader.upload(file, {
            folder: `aws-scd-2026/${folder}`,
            resource_type: 'auto'
        });
        return {
            url: result.secure_url,
            publicId: result.public_id
        };
    } catch (error) {
        console.error('[CLOUDINARY UPLOAD ERROR]', error);
        throw error;
    }
};

/**
 * Delete an image from Cloudinary
 * @param {string} publicId - public id of the image
 * @returns {Promise<object>}
 */
export const deleteImage = async (publicId) => {
    try {
        return await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('[CLOUDINARY DELETE ERROR]', error);
        throw error;
    }
};

export default cloudinary;
