
import  cloudinary from 'cloudinary'
// Cấu hình     
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'djnfk8j8v',
  api_key: process.env.CLOUDINARY_API_KEY || '719963321144639',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'Ihy5_7XB-ukx_KD5idN871j4mbE',
});
const upload = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file);
    return result;
  } catch (error) {
    throw new Error("Upload failed");
  }
};
export default upload;