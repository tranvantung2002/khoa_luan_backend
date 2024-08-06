class Constants {
  static get TIMES() {
    return {
      EXPIRE_ACCESS_TOKEN: "10d",
      EXPIRE_REFRESH_TOKEN: "15d",
    };
  }
  static get ROLES() {
    return {
      ADMIN: "admin",
      USER: "user",
      RECRUITER: "recruiter",
    };
  }
  static get STATUS_COMPANY() {
    return {
      PENDING: "pending",
      ACCEPT: "accepted",
      REJECT: "rejected",
    };
  }
  static get STATUS_JOB_APPLICATION() {
    return {
      PENDING: "pending",
      ACCEPT: "accepted",
      REJECT: "rejected",
    };
  }

  static get MESSAGES() {
    return {
      INVALID_FIELDS: "Invalid fields",
      SUCCESS: "Success",
      PASSWORDS_DO_NOT_MATCH: "Passwords do not match",
      USER_EXISTS: "User already exists",
      EMAIL_EXISTS: "Email already exists",
      INVALID_ROLE: "Invalid role",
      REGISTRATION_ERROR: "Could not register",
      LOGIN_FORM_ERROR: "Email or password is incorrect",
      LOGIN_ERROR: "Could not login",
      EXTERNAL_SERVER_ERROR: "Internal Server Error",
      LOGOUT_ERROR: "Could not logout",
      GET_USER_ERROR: "Could not get user",
      AUTHENTICATION_ERROR: "Could not authentication",
      VERIFY_COMPANY_ERROR: "Could not verify company",
      GET_COMPANY_ERROR: "Could not get company",
      VERIFIED_MESSAGE: "Company is updated",
      UPDATE_COMPANY_ERROR: "Could not update company",
      CREATE_COMPANY_ERROR: "Could not create company",
      DELETE_COMPANY_ERROR: "Could not delete company",
      DATA_NOT_FOUND: "Could not find data",
      CREATE_LOCATION_ERROR: "Could not create location",
      UPDATE_LOCATION_ERROR: "Could not update location",
      DELETE_LOCATION_ERROR: "Could not delete location",
      GET_LOCATION_ERROR: "Could not get location",
      GET_INDUSTRY_ERROR: "Could not get industry",
      CREATE_INDUSTRY_ERROR: "Could not create industry",
      UPDATE_INDUSTRY_ERROR: "Could not update industry",
      DELETE_INDUSTRY_ERROR: "Could not delete industry",
      GET_JOB_ERROR: "Could not get job",
      CREATE_JOB_ERROR: "Could not create job",
      UPDATE_JOB_ERROR: "Could not update job",
      DELETE_JOB_ERROR: "Could not delete job",
      APPLY_JOB_BEFORE_ERROR: "You have already applied for this job.",
      APPLY_JOB_ERROR: "Could not apply job",
      GET_CANDIDATE_BY_JOB_ERROR: "Could not get candidates by job",
      UPDATE_JOB_APPLICATION_ERROR: "Could not update job application",
      INVALID_STATUS: "Invalid status",
      PROFILE_NOT_EXISTS: "Profile does not exist",
      EMPTY_COMPANY_USER: "User does not own company"

    };
  }

  static get STATUS_CODES() {
    return {
      UNPROCESSABLE_ENTITY: 422,
      CONFLICT: 409,
      INTERNAL_SERVER_ERROR: 500,
      SUCCESS: 200,
      UNAUTHORIZED_ERROR: 401,
      NO_CONTENT: 204,
      FORBIDDEN_ERROR: 403,
      NOT_FOUND: 404,
      BAD_REQUEST: 400,
    };
  }
}

export default Constants;
