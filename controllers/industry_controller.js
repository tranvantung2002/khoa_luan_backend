import Constants from "../utils/constants.js";
import { Industry } from "../models/index.js";

export async function getAllIndustries(req, res) {
  try {
    const industries = await Industry.findAll();

    res.status(Constants.STATUS_CODES.SUCCESS).json({
      status: 1,
      message: Constants.MESSAGES.SUCCESS,
      data: industries,
    });
  } catch (error) {
    console.error(Constants.MESSAGES.GET_INDUSTRY_ERROR, error);
    return res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ status: 0, message: Constants.MESSAGES.GET_INDUSTRY_ERROR });
  }
}

export async function createIndustry(req, res) {
  try {
    const { name, parent_id } = req.body;

    if (!name) {
      return res
        .status(Constants.STATUS_CODES.UNPROCESSABLE_ENTITY)
        .json({ status: 0, message: Constants.MESSAGES.INVALID_FIELDS });
    }

    const industry = await Industry.create({
      name: name,
      parent_id: parent_id || null,
    });

    res
      .status(Constants.STATUS_CODES.SUCCESS)
      .json({ status: 1, message: Constants.MESSAGES.SUCCESS, data: industry });
  } catch (error) {
    console.error(Constants.MESSAGES.CREATE_INDUSTRY_ERROR, error);
    return res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ status: 0, message: Constants.MESSAGES.CREATE_INDUSTRY_ERROR });
  }
}

export async function updateIndustry(req, res) {
  try {
    const { industry_id, name, parent_id } = req.body;

    const industry = await Industry.findByPk(industry_id);

    if (name !== null && name !== undefined) industry.name = name;
    if (parent_id !== null && parent_id !== undefined)
        industry.parent_id = parent_id;
    await industry.save();

    res
      .status(Constants.STATUS_CODES.SUCCESS)
      .json({ status: 1, message: Constants.MESSAGES.SUCCESS });
  } catch (error) {
    console.error(Constants.MESSAGES.UPDATE_INDUSTRY_ERROR, error);
    return res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ status: 0, message: Constants.MESSAGES.UPDATE_INDUSTRY_ERROR });
  }
}

export async function deleteIndustry(req, res) {
  try {
    const { industry_id } = req.body;

    const industry = await Industry.findByPk(industry_id);

    if (!industry) {
      return res.status(Constants.STATUS_CODES.NOT_FOUND).json({
        status: 0,
        message: Constants.MESSAGES.NOT_FOUND,
      });
    }

    await industry.destroy();

    res
      .status(Constants.STATUS_CODES.SUCCESS)
      .json({ status: 1, message: Constants.MESSAGES.SUCCESS });
  } catch (error) {
    console.error(Constants.MESSAGES.DELETE_INDUSTRY_ERROR, error);
    return res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ status: 0, message: Constants.MESSAGES.DELETE_INDUSTRY_ERROR });
  }
}
