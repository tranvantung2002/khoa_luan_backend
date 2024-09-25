import upload from "../config/cloudinaryConfig.js";
import Constants from "../utils/constants.js";

export async function uploadFile(req, res) {
  try {
    if (!req.files) {
      return res.status(400).send("Please upload an image");
    }
    const {  fileUpload } = req.files;
    const fileTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    const imageSize = 1024;
    const pdfSize = 2048;

    if (!fileTypes.includes(fileUpload.mimetype))
      return res.send("Image formats supported: JPG, PNG, JPEG, PDF");
    const isPdf = fileUpload.mimetype === 'application/pdf';
    if (
      (["image/jpeg", "image/png", "image/jpg"].includes(fileUpload.mimetype) &&
        fileUpload.size / 1024 > imageSize) ||
      (fileUpload.mimetype === "application/pdf" &&
        fileUpload.size / 1024 > pdfSize)
    ) {
      return res.send(
        `File size should be less than ${
          fileUpload.mimetype === "application/pdf" ? pdfSize : imageSize
        }kb`
      );
    }
    const cloudFile =await upload(fileUpload.tempFilePath, {
      resource_type: isPdf ? 'raw' : 'image',
      folder: isPdf ? "cv" : "image"
    });
    res.status(Constants.STATUS_CODES.SUCCESS).json({
      status: 1,
      message: Constants.MESSAGES.UPLOAD_FILE_SUCCESS,
      data: cloudFile.url,
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ status: 0, message: Constants.MESSAGES.UPLOAD_FILE_ERROR });
  }
}
