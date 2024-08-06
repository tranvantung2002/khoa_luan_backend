import Constants from "../utils/constants.js";
import { Job, User, JobApplication } from "../models/index.js";
import sequelize from "../config/db.js";
export async function getAllJobs(req, res) {
  try {
    const { page = 1, size = 10 } = req.query;
    const limit = parseInt(size);
    const offset = (page - 1) * limit;

    const jobs = await Job.findAndCountAll({
      limit,
      offset,
    });

    const totalPages = Math.ceil(jobs.count / limit);

    res.status(Constants.STATUS_CODES.SUCCESS).json({
      status: 1,
      message: Constants.MESSAGES.SUCCESS,
      data: {
        jobs: jobs.rows,
        totalItems: jobs.count,
        totalPages: totalPages,
        currentPage: parseInt(page),
      },
    });
  } catch (error) {
    console.error(Constants.MESSAGES.GET_JOB_ERROR, error);
    return res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ status: 0, message: Constants.MESSAGES.GET_JOB_ERROR });
  }
}

export async function getAllJobsByRecruiter(req, res) {
  try {
    const { page = 1, size = 10 } = req.query;
    const limit = parseInt(size);
    const offset = (page - 1) * limit;
    const user = req.user;
    if (
      user.role != Constants.ROLES.ADMIN &&
      user.role != Constants.ROLES.RECRUITER
    ) {
      return res.status(Constants.STATUS_CODES.UNAUTHORIZED_ERROR).json({
        status: 0,
        message: Constants.MESSAGES.GET_JOB_ERROR,
      });
    }

    const query = `
    SELECT jobs.*
    FROM company_users
    INNER JOIN jobs ON company_users.company_id = jobs.company_id
    WHERE company_users.user_id = ${user.id}
    LIMIT ${limit} OFFSET ${offset};
  `;
    sequelize.query(query).then((results) => {
      const jobs = results[0];
      const totalPages = Math.ceil(jobs.length / limit);

      res.status(Constants.STATUS_CODES.SUCCESS).json({
        status: 1,
        message: Constants.MESSAGES.SUCCESS,
        data: {
          jobs: jobs,
          totalItems: jobs.count,
          totalPages: totalPages,
          currentPage: parseInt(page),
        },
      });
    });
  } catch (error) {
    console.error(Constants.MESSAGES.GET_JOB_ERROR, error);
    return res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ status: 0, message: Constants.MESSAGES.GET_JOB_ERROR });
  }
}

export async function createJob(req, res) {
  try {
    const {
      company_id,
      title,
      description,
      location_id,
      salary,
      industry_id,
      working_time,
      expires_at,
      number_candidates,
    } = req.body;

    if (
      !company_id ||
      !title ||
      !location_id ||
      !industry_id ||
      !expires_at ||
      !description ||
      !salary ||
      !number_candidates
    ) {
      return res
        .status(Constants.STATUS_CODES.UNPROCESSABLE_ENTITY)
        .json({ status: 0, message: Constants.MESSAGES.INVALID_FIELDS });
    }

    const job = await Job.create({
      company_id,
      title,
      description,
      location_id,
      salary,
      industry_id,
      working_time,
      expires_at,
      number_candidates,
    });

    res
      .status(Constants.STATUS_CODES.SUCCESS)
      .json({ status: 1, message: Constants.MESSAGES.SUCCESS, data: job });
  } catch (error) {
    console.error(Constants.MESSAGES.CREATE_JOB_ERROR, error);
    return res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ status: 0, message: Constants.MESSAGES.CREATE_JOB_ERROR });
  }
}

export async function updateJob(req, res) {
  try {
    const {
      job_id,
      title,
      description,
      location_id,
      salary,
      industry_id,
      working_time,
      expires_at,
      number_candidates,
    } = req.body;

    const job = await Job.findByPk(job_id);
    if (title !== null && title !== undefined) job.title = title;
    if (description !== null && description !== undefined)
      job.description = description;
    if (location_id !== null && location_id !== undefined)
      job.location_id = location_id;
    if (salary !== null && salary !== undefined) job.salary = salary;
    if (industry_id !== null && industry_id !== undefined)
      job.industry_id = industry_id;
    if (working_time !== null && working_time !== undefined)
      job.working_time = working_time;
    if (expires_at !== null && expires_at !== undefined)
      job.expires_at = expires_at;
    if (number_candidates !== null && number_candidates !== undefined)
      job.number_candidates = number_candidates;

    await job.save();

    res
      .status(Constants.STATUS_CODES.SUCCESS)
      .json({ status: 1, message: Constants.MESSAGES.SUCCESS });
  } catch (error) {
    console.error(Constants.MESSAGES.UPDATE_JOB_ERROR, error);
    return res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ status: 0, message: Constants.MESSAGES.UPDATE_JOB_ERROR });
  }
}

export async function deleteJob(req, res) {
  try {
    const { job_id } = req.body;

    const job = await Job.findByPk(job_id);

    if (!job) {
      return res.status(Constants.STATUS_CODES.NOT_FOUND).json({
        status: 0,
        message: Constants.MESSAGES.DATA_NOT_FOUND,
      });
    }

    await job.destroy();

    res
      .status(Constants.STATUS_CODES.SUCCESS)
      .json({ status: 1, message: Constants.MESSAGES.SUCCESS });
  } catch (error) {
    console.error(Constants.MESSAGES.DELETE_JOB_ERROR, error);
    return res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ status: 0, message: Constants.MESSAGES.DELETE_JOB_ERROR });
  }
}

export async function applyForJob(req, res) {
  try {
    const { job_id, cover_letter, resume_url } = req.body;
    const user = req.user;
    console.log(user);
    if (!job_id) {
      return res.status(Constants.STATUS_CODES.NOT_FOUND).json({
        status: 0,
        message: Constants.MESSAGES.INVALID_FIELDS,
      });
    }
    const job = await Job.findByPk(job_id);

    if (!job) {
      return res
        .status(Constants.STATUS_CODES.NOT_FOUND)
        .json({ status: 0, message: Constants.MESSAGES.GET_JOB_ERROR });
    }

    if (!user) {
      return res
        .status(Constants.STATUS_CODES.NOT_FOUND)
        .json({ status: 0, message: Constants.MESSAGES.GET_USER_ERROR });
    }
    const existingApplication = await JobApplication.findOne({
      where: {
        job_id,
        user_id: user.id,
      },
    });
    if (existingApplication) {
      return res.status(Constants.STATUS_CODES.BAD_REQUEST).json({
        status: 0,
        message: Constants.MESSAGES.APPLY_JOB_BEFORE_ERROR,
      });
    }
    const application = await JobApplication.create({
      job_id,
      user_id: user.id,
      cover_letter,
      resume_url,
    });

    res.status(Constants.STATUS_CODES.SUCCESS).json({
      status: 1,
      message: Constants.MESSAGES.SUCCESS,
      data: application,
    });
  } catch (error) {
    console.error(Constants.MESSAGES.APPLY_JOB_ERROR, error);
    return res
      .status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ status: 0, message: Constants.MESSAGES.APPLY_JOB_ERROR });
  }
}

export async function getCandidateByJob(req, res) {
  try {
    const { job_id } = req.body;

    if (!job_id) {
      return res.status(Constants.STATUS_CODES.NOT_FOUND).json({
        status: 0,
        message: Constants.MESSAGES.INVALID_FIELDS,
      });
    }
    const jobApplication = await JobApplication.findAll({ job_id });

    res.status(Constants.STATUS_CODES.SUCCESS).json({
      status: 1,
      message: Constants.MESSAGES.SUCCESS,
      data: jobApplication,
    });
  } catch (error) {
    console.error(Constants.MESSAGES.GET_CANDIDATE_BY_JOB_ERROR, error);
    return res.status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      status: 0,
      message: Constants.MESSAGES.GET_CANDIDATE_BY_JOB_ERROR,
    });
  }
}

export async function updateJobApplication(req, res) {
  try {
    const { status, jobApplication_id } = req.body;

    if (!status || !jobApplication_id) {
      return res.status(Constants.STATUS_CODES.NOT_FOUND).json({
        status: 0,
        message: Constants.MESSAGES.INVALID_FIELDS,
      });
    }
    const jobApplication = await JobApplication.findByPk(jobApplication_id);
    if (
      status == Constants.STATUS_JOB_APPLICATION.ACCEPT ||
      status == Constants.STATUS_JOB_APPLICATION.ACCEPT ||
      status == Constants.STATUS_JOB_APPLICATION.PENDING
    ) {
      jobApplication.status = status;
      await jobApplication.save();
      res.status(Constants.STATUS_CODES.SUCCESS).json({
        status: 1,
        message: Constants.MESSAGES.SUCCESS,
        data: jobApplication,
      });
    }
    res.status(Constants.STATUS_CODES.BAD_REQUEST).json({
      status: 0,
      message: Constants.MESSAGES.INVALID_STATUS,
    });
  } catch (error) {
    console.error(Constants.MESSAGES.UPDATE_JOB_APPLICATION_ERROR, error);
    return res.status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      status: 0,
      message: Constants.MESSAGES.UPDATE_JOB_APPLICATION_ERROR,
    });
  }
}
