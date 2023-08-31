import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { createReadStream } from 'streamifier';

@Injectable()
export class CloudinaryService {

    uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
        return new Promise<CloudinaryResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                },
            );

            createReadStream(file.buffer).pipe(uploadStream);
        });
    }

    deleteFile(publicId: string): Promise<CloudinaryResponse> {
        return new Promise<CloudinaryResponse>((resolve, reject) => {
            cloudinary.uploader.destroy(
                publicId,
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                },
            );
        });
    }

}

export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;
