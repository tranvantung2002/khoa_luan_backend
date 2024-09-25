import Constants from "../utils/constants.js";
import { Job, User, JobApplication, Resume } from "../models/index.js";
import sequelize from "../config/db.js";
export async function getAllJobs(req, res) {
  try {
    const { page, size } = req.query;
    const pageNumber = page || 1;
    const pageSize = size || 10;
    const limit = parseInt(pageSize);
    const offset = (pageNumber - 1) * limit;

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
        currentPage: parseInt(pageNumber),
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
    const { user_id, page, size } = req.body;
    const pageNumber = page || 1;
    const pageSize = size || 10;
    const limit = parseInt(pageSize);
    const offset = (pageNumber - 1) * limit;

    if (!user_id && Number.isInteger(user_id)) {
      return res.status(Constants.STATUS_CODES.UNPROCESSABLE_ENTITY).json({
        status: 0,
        message: Constants.MESSAGES.INVALID_FIELDS,
      });
    }

    const query = `
  WITH job_count AS (
    SELECT COUNT(*) AS count
    FROM company_users
    INNER JOIN jobs ON company_users.company_id = jobs.company_id
    WHERE company_users.user_id = ${user_id}
  )
  SELECT jobs.*, job_count.count
  FROM company_users
  INNER JOIN jobs ON company_users.company_id = jobs.company_id
  CROSS JOIN job_count
  WHERE company_users.user_id = ${user_id}
  LIMIT ${limit} OFFSET ${offset};
`;
    const results = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    // Extract the count from the results
    const totalItems = results.length > 0 ? results[0].count : 0;
    const jobs = results.map((row) => {
      const { count, ...job } = row; // Remove the count property from job results
      return job;
    });
    const totalPages = Math.ceil(totalItems / limit);

    res.status(Constants.STATUS_CODES.SUCCESS).json({
      status: 1,
      message: Constants.MESSAGES.SUCCESS,
      data: {
        jobs: jobs,
        totalItems: totalItems,
        totalPages: totalPages,
        currentPage: parseInt(pageNumber),
      },
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
      id,
      title,
      description,
      location_id,
      salary,
      industry_id,
      working_time,
      expires_at,
      number_candidates,
      status,
    } = req.body;

    const job = await Job.findByPk(id);
    if (!job) {
      return res.status(Constants.STATUS_CODES.NOT_FOUND).json({
        status: 0,
        message: Constants.MESSAGES.DATA_NOT_FOUND,
      });
    }
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
    if (status !== null && status !== undefined) {
      const normalizedStatus = status.trim().toLowerCase();

      if (normalizedStatus === "active" || normalizedStatus === "inactive") {
        job.status = normalizedStatus;
      }
    }

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
    const { job_id, cover_letter, resume_url, email_candidate } = req.body;
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
    if (job.status != Constants.STATUS_JOB.ACTIVE) {
      return res
        .status(Constants.STATUS_CODES.NOT_FOUND)
        .json({ status: 0, message: Constants.MESSAGES.JOB_NOT_ACTIVE });
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
      email_candidate,
    });
    job.number_applied++;
    await job.save();
    
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
    const jobApplication = await JobApplication.findAll({
      where: { job_id: job_id },
    });

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
    } else {
      res.status(Constants.STATUS_CODES.BAD_REQUEST).json({
        status: 0,
        message: Constants.MESSAGES.INVALID_STATUS,
      });
    }
  } catch (error) {
    console.error(Constants.MESSAGES.UPDATE_JOB_APPLICATION_ERROR, error);
    return res.status(Constants.STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      status: 0,
      message: Constants.MESSAGES.UPDATE_JOB_APPLICATION_ERROR,
    });
  }
}
