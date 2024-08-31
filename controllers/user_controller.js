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

export async function updateProfile(req, res) {
  const user = req.user;
  const { user_name, email, address, phone, profile_url } = req.body;

  try {
    // Tìm hồ sơ theo user_id
    const profile = await Profile.findOne({ where: { user_id: user.id } });

    if (!profile) {
      return res.status(Constants.STATUS_CODES.NOT_FOUND).json({
        status: 0,
        message: Constants.MESSAGES.PROFILE_NOT_EXISTS,
      });
    }

    // Cập nhật hồ sơ
    await profile.update({
      user_name: user_name || profile.user_name,
      email: email || profile.email,
      address: address || profile.address,
      phone: phone || profile.phone,
      profile_url: profile_url || profile.profile_url,
    });

    return res.status(Constants.STATUS_CODES.SUCCESS).json({
      status: 1,
      message: Constants.MESSAGES.SUCCESS,
      data: profile,
    });
  } catch (error) {
    console.error(Constants.MESSAGES.UPDATE_PROFILE_ERROR, error);
    return res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ status: 0, message: Constants.MESSAGES.UPDATE_PROFILE_ERROR });
  }
}