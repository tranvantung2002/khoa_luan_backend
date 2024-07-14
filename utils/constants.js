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
        LOGIN_FORM_ERROR: 'Email or password is incorrect',
        LOGIN_ERROR: 'Could not login',
        EXTERNAL_SERVER_ERROR :'Internal Server Error',
        LOGOUT_ERROR: 'Could not logout',
        GET_USER_ERROR: 'Could not get user',
        AUTHENTICATION_ERROR: 'Could not authentication',
        VERIFY_COMPANY_ERROR: 'Could not verify company'
        
      };
    }
  
    static get STATUS_CODES() {
      return {
        UNPROCESSABLE_ENTITY: 422,
        CONFLICT: 409,
        INTERNAL_SERVER_ERROR: 500,
        SUCCESS: 200,

        UNAUTHORIZED_ERROR:401,
        NO_CONTENT: 204,
        FORBIDDEN_ERROR:403,
      };
    }
  }

  
  
  export default Constants;