import { Role, UserRole, User, Profile } from "../models/index.js";
import bcrypt from "bcrypt";
import Constants from "../utils/constants.js";

export async function registerAdmin(req, res) {
  const { email, userName, password, numberPhone } = req.body;

  if (!email || !password || !userName || !numberPhone) {
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
      userName,
    });
    
    // Gán vai trò cho người dùng
    await UserRole.create({
      user_id: user.id,
      role_id: adminRole.id,
    });
    const profile = await Profile.create({
        user_id: user.id,
        user_name: userName,
        phone,
        address,
      });

    return res
      .status(Constants.STATUS_CODES.SUCCESS)
      .json({ status: 1, message: Constants.MESSAGES.SUCCESS});
  } catch (error) {
    console.error(Constants.MESSAGES.REGISTRATION_ERROR, error);
    return res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ status: 0, message: Constants.MESSAGES.REGISTRATION_ERROR });
  }
}
