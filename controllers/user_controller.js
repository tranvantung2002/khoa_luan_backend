import { User, Resume } from "../models/index.js";
import Constants from "../utils/constants.js";

export async function getUser(req, res) {
  try {
    const user = req.user;
    return res.status(Constants.STATUS_CODES.SUCCESS).json(user);
  } catch (e) {
    console.error(Constants.MESSAGES.GET_USER_ERROR, error);
    return res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ status: 0, message: Constants.MESSAGES.GET_USER_ERROR });
  }
}

export async function getProfile(req, res) {
  const user = req.user;
  try {
    // const profile = await Profile.findOne({ user_id: user.id });
    // if (!profile) {
    //   return res.status(Constants.STATUS_CODES.NOT_FOUND).json({
    //     status: 0,
    //     message: Constants.MESSAGES.PROFILE_NOT_EXISTS,
    //   });
    // }

    return res
      .status(Constants.STATUS_CODES.SUCCESS)
      .json({ status: 1, message: Constants.MESSAGES.SUCCESS, data: user });
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
    if (!user) {
      return res.status(Constants.STATUS_CODES.NOT_FOUND).json({
        status: 0,
        message: Constants.MESSAGES.PROFILE_NOT_EXISTS,
      });
    }

    const [affectedRows] = await User.update(
      {
        user_name: user_name || user.user_name,
        email: email || user.email,
        address: address || user.address,
        phone: phone || user.phone,
        profile_url: profile_url || user.profile_url,
      },
      {
        where: { id: user.id },
      }
    );

    if (affectedRows > 0) {
      const updatedUser = await User.findByPk(user.id);

      return res.status(Constants.STATUS_CODES.OK).json({
        status: 1,
        message: Constants.MESSAGES.SUCCESS,
        data: updatedUser,
      });
    } else {
      return res.status(Constants.STATUS_CODES.BAD_REQUEST).json({
        status: 0,
        message: Constants.MESSAGES.UPDATE_PROFILE_ERROR,
      });
    }
  } catch (error) {
    console.error(Constants.MESSAGES.UPDATE_PROFILE_ERROR, error);
    return res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ status: 0, message: Constants.MESSAGES.UPDATE_PROFILE_ERROR });
  }
}

export async function getUserResume(req, res) {
  const user = req.user;
  try {
    const resumes = await Resume.findAll({
      where: {
        user_id: user.id,
      },
    });

    return res
      .status(Constants.STATUS_CODES.SUCCESS)
      .json({ status: 1, message: Constants.MESSAGES.SUCCESS, data: resumes });
  } catch (error) {
    console.error(Constants.MESSAGES.GET_RESUME_ERROR, error);
    return res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ status: 0, message: Constants.MESSAGES.GET_RESUME_ERROR });
  }
}

export async function createUserResume(req, res) {
  const user = req.user;
  try {
    const { resume_url, resume_name } = req.body;

    if (!resume_url) {
      return res
        .status(Constants.STATUS_CODES.UNPROCESSABLE_ENTITY)
        .json({ status: 0, message: Constants.MESSAGES.INVALID_FIELDS });
    }
    const resume = await Resume.create({
      resume_name,
      resume_url,
      user_id: user.id,
    });

    return res
      .status(Constants.STATUS_CODES.SUCCESS)
      .json({ status: 1, message: Constants.MESSAGES.SUCCESS, data: resume });
  } catch (error) {
    console.error(Constants.MESSAGES.GET_RESUME_ERROR, error);
    return res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ status: 0, message: Constants.MESSAGES.GET_RESUME_ERROR });
  }
}

export async function updateUserResume(req, res) {
  const user = req.user;
  try {
    const { resume_id, resume_url, resume_name } = req.body;

    const resume = await Resume.findByPk(resume_id);
    if (!resume) {
      return res
        .status(Constants.STATUS_CODES.NOT_FOUND)
        .json({ status: 0, message: Constants.MESSAGES.GET_RESUME_ERROR });
    }
    if (resume.user_id !== user.id) {
      return res
        .status(Constants.STATUS_CODES.UNPROCESSABLE_ENTITY)
        .json({ status: 0, message: Constants.MESSAGES.NOT_PERMISSION });
    }
    if (resume_url !== null && resume_url !== undefined)
      resume.resume_url = resume_url;
    if (resume_name !== null && resume_name !== undefined)
      resume.resume_name = resume_name;

    await resume.save();
    return res
      .status(Constants.STATUS_CODES.SUCCESS)
      .json({ status: 1, message: Constants.MESSAGES.SUCCESS, data: resume });
  } catch (error) {
    console.error(Constants.MESSAGES.UPDATE_RESUME_ERROR, error);
    return res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ status: 0, message: Constants.MESSAGES.UPDATE_RESUME_ERROR });
  }
}

export async function deleteUserResume(req, res) {
  const user = req.user;
  try {
    const { resume_id } = req.body;

    const resume = await Resume.findByPk(resume_id);
    if (!resume) {
      return res
        .status(Constants.STATUS_CODES.NOT_FOUND)
        .json({ status: 0, message: Constants.MESSAGES.GET_RESUME_ERROR });
    }
    if (resume.user_id !== user.id) {
      return res
        .status(Constants.STATUS_CODES.UNPROCESSABLE_ENTITY)
        .json({ status: 0, message: Constants.MESSAGES.NOT_PERMISSION });
    }

    await resume.destroy();
    return res
      .status(Constants.STATUS_CODES.SUCCESS)
      .json({ status: 1, message: Constants.MESSAGES.SUCCESS });
  } catch (error) {
    console.error(Constants.MESSAGES.DELETE_RESUME_ERROR, error);
    return res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ status: 0, message: Constants.MESSAGES.DELETE_RESUME_ERROR });
  }
}
