import Constants from "../utils/constants.js";
import { Role, UserRole, User, Profile, Company } from "../models/index.js";

export async function verifyCompany(req, res) {
    try {

    } catch(e) {
        console.error(Constants.MESSAGES.VERIFY_COMPANY_ERROR, error);
        return res
          .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
          .json({ status: 0, message: Constants.MESSAGES.VERIFY_COMPANY_ERROR });
    }
}