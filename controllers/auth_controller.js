import { Role, UserRole, User, Profile, Company } from "../models/index.js";
import bcrypt from "bcrypt";
import Constants from "../utils/constants.js";
import jwt from "jsonwebtoken";

export async function registerAdmin(req, res) {
  const { email, user_name, password, phone } = req.body;

  if (!email || !password || !user_name || !phone) {
    return res.status(Constants.STATUS_CODES.UNPROCESSABLE_ENTITY).json({
      status: 0,
      message: Constants.MESSAGES.INVALID_FIELDS,
    });
  }

  try {
    // Kiểm tra xem người dùng đã tồn tại chưa
    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) {
      return res.status(409).json({
        status: Constants.STATUS_CODES.CONFLICT,
        message: Constants.MESSAGES.USER_EXISTS,
      });
    }

    // Kiểm tra và tạo role admin nếu chưa tồn tại
    let adminRole = await Role.findOne({
      where: { role_name: Constants.ROLES.ADMIN },
    });

    if (!adminRole) {
      adminRole = await Role.create({ role_name: Constants.ROLES.ADMIN });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng
    const user = await User.create({
      email,
      password: hashedPassword,
      user_name,
    });

    // Gán vai trò cho người dùng
    await UserRole.create({
      user_id: user.id,
      role_id: adminRole.id,
    });
    const profile = await Profile.create({
      user_id: user.id,
      user_name,
      phone,
      email,
    });

    return res
      .status(Constants.STATUS_CODES.SUCCESS)
      .json({ status: 1, message: Constants.MESSAGES.SUCCESS });
  } catch (error) {
    console.error(Constants.MESSAGES.REGISTRATION_ERROR, error);
    return res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ status: 0, message: Constants.MESSAGES.REGISTRATION_ERROR });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res
        .status(Constants.STATUS_CODES.UNPROCESSABLE_ENTITY)
        .json({ status: 0, message: Constants.MESSAGES.INVALID_FIELDS });

    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(Constants.STATUS_CODES.UNAUTHORIZED_ERROR)
        .json({ status: 0, message: Constants.MESSAGES.LOGIN_FORM_ERROR });

    const match = await bcrypt.compare(password, user.password);

    if (!match)
      return res
        .status(Constants.STATUS_CODES.UNAUTHORIZED_ERROR)
        .json({ status: 0, message: Constants.MESSAGES.LOGIN_FORM_ERROR });

    const accessToken = jwt.sign(
      {
        id: user.id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1800s",
      }
    );

    const refreshToken = jwt.sign(
      {
        id: user.id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "2d",
      }
    );

    user.refresh_token = refreshToken;
    await user.save();
    const userJson = user.toJSON();

    // Remove the password field
    delete userJson.password;
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({
      status: 0,
      message: Constants.MESSAGES.SUCCESS,
      data: userJson,
    });
  } catch (e) {
    console.error(Constants.MESSAGES.LOGIN_ERROR, e);
    return res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ status: 0, message: Constants.MESSAGES.LOGIN_ERROR });
  }
}

export async function register(req, res) {
  const { email, user_name, password, phone, role, address_company, name_company } = req.body;

  if (!email || !password || !user_name || !phone) {
    return res.status(Constants.STATUS_CODES.UNPROCESSABLE_ENTITY).json({
      status: 0,
      message: Constants.MESSAGES.INVALID_FIELDS,
    });
  }

  try {
    // Kiểm tra xem người dùng đã tồn tại chưa
    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) {
      return res.status(409).json({
        status: Constants.STATUS_CODES.CONFLICT,
        message: Constants.MESSAGES.USER_EXISTS,
      });
    }
    let roleUser;
    if (role == Constants.ROLES.RECRUITER) {
      if (!address_company || !name_company ) {
        return res.status(Constants.STATUS_CODES.UNPROCESSABLE_ENTITY).json({
          status: 0,
          message: Constants.MESSAGES.INVALID_FIELDS,
        });
      }
      roleUser = await Role.findOne({
        where: { role_name: Constants.ROLES.RECRUITER },
      });
      if (!roleUser) {
        roleUser = await Role.create({ role_name: Constants.ROLES.RECRUITER });
      }
      const company = await Company.create({
        address: address_company,
        phone: phone,
        name: name_company
      })
    } else {
      roleUser = await Role.findOne({
        where: { role_name: Constants.ROLES.USER },
      });
      if (!roleUser) {
        roleUser = await Role.create({ role_name: Constants.ROLES.USER });
      }
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng
    const user = await User.create({
      email,
      password: hashedPassword,
      user_name,
    });

    // Gán vai trò cho người dùng
    await UserRole.create({
      user_id: user.id,
      role_id: roleUser.id,
    });
    const profile = await Profile.create({
      user_id: user.id,
      user_name,
      phone,
      email,
    });

    return res
      .status(Constants.STATUS_CODES.SUCCESS)
      .json({ status: 1, message: Constants.MESSAGES.SUCCESS });
  } catch (error) {
    
    console.error(Constants.MESSAGES.REGISTRATION_ERROR, error);
    return res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ status: 0, message: Constants.MESSAGES.REGISTRATION_ERROR });
  }
}

export async function refresh(req, res) {
  const cookies = req.cookies;
  if (!cookies.refresh_token)
    return res.sendStatus(Constants.STATUS_CODES.UNAUTHORIZED_ERROR);

  const refreshToken = cookies.refresh_token;
  const user = await User.findOne({ refresh_token: refreshToken });

  if (!user) return res.sendStatus(Constants.STATUS_CODES.FORBIDDEN_ERROR);
  const refreshUser = user.refresh_token;

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      console.log(err);

      return res.sendStatus(Constants.STATUS_CODES.FORBIDDEN_ERROR);
    }

    const accessToken = jwt.sign(
      { id: decoded.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1800s" }
    );

    res.json({ access_token: accessToken });
  });
}

export async function logout(req, res) {
  const cookies = req.cookies;

  try {
    console.log(cookies);
    if (!cookies.refresh_token)
      return res.sendStatus(Constants.STATUS_CODES.NO_CONTENT);

    const refreshToken = cookies.refresh_token;
    const user = await User.findOne({ refresh_token: refreshToken });

    if (!user) {
      res.clearCookie("refresh_token", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
    }

    user.refresh_token = "";
    await user.save();
    res.clearCookie("refresh_token", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    res
      .status(Constants.STATUS_CODES.SUCCESS)
      .json({ status: 1, message: Constants.MESSAGES.SUCCESS });
  } catch (error) {
    console.error(Constants.MESSAGES.LOGOUT_ERROR, error);
    res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: Constants.MESSAGES.EXTERNAL_SERVER_ERROR });
  }
}

export async function getUser(req, res) {
  try {
    const user = req.user;
    return res.status(Constants.STATUS_CODES.SUCCESS).json(user);
  } catch(e) {
    console.error(Constants.MESSAGES.GET_USER_ERROR, error);
    return res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ status: 0, message: Constants.MESSAGES.GET_USER_ERROR });
  }

}
