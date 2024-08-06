import { Profile } from "../models/index.js";
import Constants from "../utils/constants.js";

export async function getProfile(req, res) {
  const user = req.user;
  try {
    const profile = await Profile.findOne({ user_id: user.id });
    if (!profile) {
      return res.status(Constants.STATUS_CODES.NOT_FOUND).json({
        status: 0,
        message: Constants.MESSAGES.PROFILE_NOT_EXISTS,
      });
    }

    return res
      .status(Constants.STATUS_CODES.SUCCESS)
      .json({ status: 1, message: Constants.MESSAGES.SUCCESS, data: profile });
  } catch (error) {
    console.error(Constants.MESSAGES.REGISTRATION_ERROR, error);
    return res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ status: 0, message: Constants.MESSAGES.REGISTRATION_ERROR });
  }
}
