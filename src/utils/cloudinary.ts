import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'
import dotenv from "dotenv";
import { ErrorHandler } from './errorHandler';
dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

export interface UploadedFile extends Express.Multer.File { }
interface UploadOptions {
    width?: number;
    height?: number;
    crop?: string;
}
export const uploadImage = async (file: UploadedFile, width?: number, height?: number) => {

    try {
        const b64 = Buffer.from(file.buffer).toString("base64");
        const dataURI = "data:" + file.mimetype + ";base64," + b64;
        const options: UploadOptions = {};

        if (width && height) {
            options['width'] = width;
            options['height'] = height;
            options['crop'] = "fill";
        }
        const result: UploadApiResponse = await cloudinary.uploader.upload(dataURI, options);

        return {
            id: result.public_id,
            url: result.secure_url
        }
    } catch (error: any) {
        console.error('Error uploading image:', error.message);
        throw new ErrorHandler(500, error.message)
    }
};

export const uploadImages = async (files: UploadedFile[], width?: number, height?: number) => {

    try {
        const uploadResults = await Promise.all(files.map(async (file) => {
            const b64 = Buffer.from(file.buffer).toString("base64");
            const dataURI = "data:" + file.mimetype + ";base64," + b64;
            const options: UploadOptions = {};

            if (width && height) {
                options['width'] = width;
                options['height'] = height;
                options['crop'] = "fill";
            }
            const result: UploadApiResponse = await cloudinary.uploader.upload(dataURI, options);
            return {
                id: result.public_id,
                url: result.secure_url
            };
        }));
        return uploadResults;
    } catch (error: any) {
        console.error('Error uploading images:', error.message);
        throw new ErrorHandler(500, error.message);
    }
};

export const deleteImage = async (imageId: string) => {
    try {
        const result = await cloudinary.uploader.destroy(imageId);
        return result;
    } catch (error: any) {
        console.error('Error deleting image:', error.message);
        return new ErrorHandler(400, error)
    }
};

export { cloudinary }