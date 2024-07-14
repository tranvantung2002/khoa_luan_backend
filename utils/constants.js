class Constants {
    static get ROLES() {
      return {
        ADMIN: 'admin',
        USER: 'user',
        RECRUITER: 'recruiter',
      };
    }
  
    static get MESSAGES() {
      return {
        INVALID_FIELDS: 'Invalid fields',
        SUCCESS: "Success",
        PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',
        USER_EXISTS: 'User already exists',
        EMAIL_EXISTS: 'Email already exists',
        INVALID_ROLE: 'Invalid role',
        REGISTRATION_ERROR: 'Could not register',
      };
    }
  
    static get STATUS_CODES() {
      return {
        UNPROCESSABLE_ENTITY: 422,
        CONFLICT: 409,
        INTERNAL_SERVER_ERROR: 500,
        SUCCESS: 200,
      };
    }
  }
  
  export default Constants;