import Constants from "../utils/constants.js";
import { Location } from "../models/index.js";

export async function getAllLocation(req, res) {
  try {
    const locations = await Location.findAll();

    res
      .status(Constants.STATUS_CODES.SUCCESS)
      .json({
        status: 1,
        message: Constants.MESSAGES.SUCCESS,
        data: locations,
      });
  } catch (error) {
    console.error(Constants.MESSAGES.GET_LOCATION_ERROR, error);
    return res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ status: 0, message: Constants.MESSAGES.GET_LOCATION_ERROR });
  }
}

export async function createLocation(req, res) {
  try {
    const { country, image_url, code } = req.body;

    if (!country || !code) {
      return res
        .status(Constants.STATUS_CODES.UNPROCESSABLE_ENTITY)
        .json({ status: 0, message: Constants.MESSAGES.INVALID_FIELDS });
    }

    const location = await Location.create({
      country: country,
      image_url: image_url || null,
      code
    });

    res
      .status(Constants.STATUS_CODES.SUCCESS)
      .json({ status: 1, message: Constants.MESSAGES.SUCCESS, data: location });
  } catch (error) {
    console.error(Constants.MESSAGES.CREATE_LOCATION_ERROR, error);
    return res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ status: 0, message: Constants.MESSAGES.CREATE_LOCATION_ERROR });
  }
}

export async function updateLocation(req, res) {
  try {
    const { country_id, country, image_url } = req.body;

    const location = await Location.findByPk(country_id);
    console.log(location)

    if (country !== null && country !== undefined) location.country = country;
    if (image_url !== null && image_url !== undefined)
      location.image_url = image_url;
    await location.save();

    res
      .status(Constants.STATUS_CODES.SUCCESS)
      .json({ status: 1, message: Constants.MESSAGES.SUCCESS });
  } catch (error) {
    console.error(Constants.MESSAGES.UPDATE_LOCATION_ERROR, error);
    return res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ status: 0, message: Constants.MESSAGES.UPDATE_LOCATION_ERROR });
  }
}

export async function deleteLocation(req, res) {
  try {
    const { country_id } = req.body;

    const location = await Location.findByPk(country_id);

    if (!location) {
      return res.status(Constants.STATUS_CODES.NOT_FOUND).json({
        status: 0,
        message: Constants.MESSAGES.INVALID_FIELDS,
      });
    }

    await location.destroy();

    res
      .status(Constants.STATUS_CODES.SUCCESS)
      .json({ status: 1, message: Constants.MESSAGES.SUCCESS });
  } catch (error) {
    console.error(Constants.MESSAGES.DELETE_LOCATION_ERROR, error);
    return res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ status: 0, message: Constants.MESSAGES.DELETE_LOCATION_ERROR });
  }
}
