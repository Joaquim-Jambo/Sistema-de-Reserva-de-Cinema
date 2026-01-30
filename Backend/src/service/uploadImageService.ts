import { v2 as cloudinary } from 'cloudinary';

export const uploadImage = async (imagePath: string | void): Promise<string> => {
    if(!imagePath)
        return ("");
    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
    };
    try {
        const result = await cloudinary.uploader.upload(imagePath, options);
        return result.secure_url;
    } catch (error: any) {
        console.error(error);
        throw new Error('Erro ao fazer upload da imagem');
    }
};
