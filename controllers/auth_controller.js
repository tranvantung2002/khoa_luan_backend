import {
  Role,
  UserRole,
  User,
  Profile,
  Company,
  CompanyUser,
} from "../models/index.js";
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
      return res.status(Constants.STATUS_CODES.CONFLICT).json({
        status:0,
        message: Constants.MESSAGES.USER_EXISTS,
      });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng
    const user = await User.create({
      email,
      password: hashedPassword,
      user_name,
      role: Constants.ROLES.ADMIN,
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
  const { email, password, role } = req.body;
  try {
    if (!email || !password || !role)
      return res
        .status(Constants.STATUS_CODES.UNPROCESSABLE_ENTITY)
        .json({ status: 0, message: Constants.MESSAGES.INVALID_FIELDS });
    if (
      role != Constants.ROLES.ADMIN &&
      role != Constants.ROLES.RECRUITER &&
      role != Constants.ROLES.USER
    ) {
      return res
        .status(Constants.STATUS_CODES.UNPROCESSABLE_ENTITY)
        .json({ status: 0, message: Constants.MESSAGES.INVALID_FIELDS });
    }
    const user = await User.findOne({ where: { email: email, role: role } });

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
        expiresIn: Constants.TIMES.EXPIRE_ACCESS_TOKEN,
      }
    );

    const refreshToken = jwt.sign(
      {
        id: user.id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: Constants.TIMES.EXPIRE_REFRESH_TOKEN,
      }
    );

    user.refresh_token = refreshToken;
    await user.save();
    const userJson = user.toJSON();

    // Remove the password field
    delete userJson.password;
    delete userJson.refresh_token;
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({
      status: 1,
      message: Constants.MESSAGES.SUCCESS,
      data: {
        accessToken: accessToken,
        user: userJson,
      },
    });
  } catch (e) {
    console.error(Constants.MESSAGES.LOGIN_ERROR, e);
    return res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ status: 0, message: Constants.MESSAGES.LOGIN_ERROR });
  }
}

export async function register(req, res) {
  const {
    email,
    user_name,
    password,
    phone,
    role,
    address_company,
    name_company,
  } = req.body;

  var roleUser = Constants.ROLES.USER;
  if (!email || !password || !user_name || !phone) {
    return res.status(Constants.STATUS_CODES.UNPROCESSABLE_ENTITY).json({
      status: 0,
      message: Constants.MESSAGES.INVALID_FIELDS,
    });
  }
  if (role == Constants.ROLES.RECRUITER) {
    if (!address_company || !name_company) {
      return res.status(Constants.STATUS_CODES.UNPROCESSABLE_ENTITY).json({
        status: 0,
        message: Constants.MESSAGES.INVALID_FIELDS,
      });
    }
    roleUser = Constants.ROLES.RECRUITER;
  }

  try {
    // Kiểm tra xem người dùng đã tồn tại chưa

    const emailExists = await User.findOne({
      where: { email: email, role: roleUser },
    });
    if (emailExists) {
      return res.status(Constants.STATUS_CODES.CONFLICT).json({
        status: 0,
        message: Constants.MESSAGES.USER_EXISTS,
      });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng

    const user = await User.create({
      email,
      password: hashedPassword,
      user_name,
      role: roleUser,
    });
    const profile = await Profile.create({
      user_id: user.id,
      user_name,
      phone,
      email,
    });

    if (role == Constants.ROLES.RECRUITER) {
      const company = await Company.create({
        address: address_company,
        phone: phone,
        name: name_company,
      });
      await CompanyUser.create({
        company_id: company.id,
        user_id: user.id,
      });
    }

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
      { expiresIn: process.env.ACCESS_TOKEN_SECRET }
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
  } catch (e) {
    console.error(Constants.MESSAGES.GET_USER_ERROR, error);
    return res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ status: 0, message: Constants.MESSAGES.GET_USER_ERROR });
  }
}
