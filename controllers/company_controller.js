import Constants from "../utils/constants.js";
import { Role, UserRole, User, Profile, Company } from "../models/index.js";

export async function verifyCompany(req, res) {
  try {
    const { company_id, status } = req.body;
    const company = await Company.findByPk(company_id);
    if (
      status == Constants.STATUS_COMPANY.PENDING ||
      status == Constants.STATUS_COMPANY.REJECT ||
      status == Constants.STATUS_COMPANY.ACCEPT
    ) {
      company.status = status;
      await company.save();
      res
        .status(Constants.STATUS_CODES.SUCCESS)
        .json({ status: 1, message: Constants.MESSAGES.VERIFIED_MESSAGE });
      return;
    }
    res
      .status(Constants.STATUS_CODES.CONFLICT)
      .json({ status: 0, message: Constants.MESSAGES.VERIFY_COMPANY_ERROR });
  } catch (e) {
    console.error(Constants.MESSAGES.VERIFY_COMPANY_ERROR, error);
    return res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ status: 0, message: Constants.MESSAGES.VERIFY_COMPANY_ERROR });
  }
}

export async function getAllCompany(req, res) {
  try {
    const companies = await Company.findAll();
    res.json({
      status: 0,
      message: Constants.MESSAGES.SUCCESS,
      data: companies,
    });
  } catch (e) {
    console.error(Constants.MESSAGES.GET_COMPANY_ERROR, error);
    return res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ status: 0, message: Constants.MESSAGES.GET_COMPANY_ERROR });
  }
}

export async function updateCompany(req, res) {
  try {
    const { company_id, name, address, phone, image_url, email, code_tax } =
      req.body;
    const company = await Company.findByPk(company_id);
    if (name !== null && name !== undefined) company.name = name;
    if (address !== null && address !== undefined) company.address = address;
    if (phone !== null && phone !== undefined) company.phone = phone;
    if (image_url !== null && image_url !== undefined)
      company.image_url = image_url;
    if (email !== null && email !== undefined) company.email = email;
    if (code_tax !== null && code_tax !== undefined)
      company.code_tax = code_tax;
    await company.save();
    res
      .status(Constants.STATUS_CODES.SUCCESS)
      .json({ status: 1, message: Constants.MESSAGES.SUCCESS });
  } catch (e) {
    console.error(Constants.MESSAGES.UPDATE_COMPANY_ERROR, error);
    return res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ status: 0, message: Constants.MESSAGES.UPDATE_COMPANY_ERROR });
  }
}

export async function createCompany(req, res) {
  try {
    const { name, address, phone, image_url, email, code_tax } = req.body;

    if (!name || !email) {
      return res
        .status(Constants.STATUS_CODES.UNPROCESSABLE_ENTITY)
        .json({ status: 0, message: Constants.MESSAGES.INVALID_FIELDS });
    }

    const company = await Company.create({
      name,
      address: address || null,
      phone: phone || null,
      image_url: image_url || null,
      email,
      code_tax: code_tax || null,
    });

    res
      .status(Constants.STATUS_CODES.SUCCESS)
      .json({ status: 1, message: Constants.MESSAGES.SUCCESS, data: company });
  } catch (error) {
    console.error(Constants.MESSAGES.CREATE_COMPANY_ERROR, error);
    return res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ status: 0, message: Constants.MESSAGES.CREATE_COMPANY_ERROR });
  }
}

export async function deleteCompany(req, res) {
  try {
    const { company_id } = req.body;
    const company = await Company.findByPk(company_id);

    if (!company) {
      return res.status(Constants.STATUS_CODES.NOT_FOUND).json({
        status: 0,
        message: Constants.MESSAGES.INVALID_FIELDS,
      });
    }

    await company.destroy();

    return res.status(Constants.STATUS_CODES.SUCCESS).json({
      status: 1,
      message: Constants.MESSAGES.SUCCESS,
    });
  } catch (error) {
    console.error(Constants.MESSAGES.DELETE_COMPANY_ERROR, error);
    return res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ status: 0, message: Constants.MESSAGES.DELETE_COMPANY_ERROR });
  }
}
