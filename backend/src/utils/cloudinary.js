import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload the file
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);
    //console.log("file uploaded on cloudinary :" ,response.url)
    return response;
  } catch (error) {
    //remove from the server
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const deleteAsset = async (url, resourceType = "image") => {
  try {
    if (!url) return null; // Guard against null/undefined

    const urlParts = url.split("/");
    const uploadIndex = urlParts.indexOf("upload");

    if (uploadIndex === -1) {
      console.error("Invalid Cloudinary URL");
      return null;
    }

    const publicIdWithExt = urlParts.slice(uploadIndex + 2).join("/");
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "");
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });
    return result;
  } catch (error) {
    console.error(`Error deleting Asset ${publicId}:`, error);
    return null;
  }
};

export { uploadOnCloudinary, deleteAsset };
