import upload from "../config/cloudinaryConfig.js";
import Constants from "../utils/constants.js";

export async function uploadFile(req, res) {
  try {
    if (!req.files) {
      return res.status(400).send("Please upload an image");
    }
    const {  fileUpload } = req.files;
    const fileTypes = ["image/jpeg", "image/png", "image/jpg"];
    const imageSize = 1024;

    if (!fileTypes.includes(fileUpload.mimetype))
      return res.send("Image formats supported: JPG, PNG, JPEG");

    if (fileUpload.size / 1024 > imageSize)
      return res.send(`Image size should be less than ${imageSize}kb`);
    const cloudFile = await upload(fileUpload.tempFilePath);

    res.status(Constants.STATUS_CODES.SUCCESS).json({
      status: 1,
      message: Constants.MESSAGES.UPLOAD_FILE_SUCCESS,
      data: { imageUrl: cloudFile.url },
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ status: 0, message: Constants.MESSAGES.UPLOAD_FILE_ERROR });
  }
}
