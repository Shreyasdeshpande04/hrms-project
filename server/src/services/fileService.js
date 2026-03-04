import cloudinary from '../config/cloudinary.js';

export const uploadToCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
      if (error) reject(error);
      else resolve(result.secure_url);
    }).end(fileBuffer);
  });
};