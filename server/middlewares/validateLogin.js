/**
 * This is a validation for user login
 * @constant
 * 
 * @param {String} message - any error message we provide
 * 
 * @returns {Object}
 */


const signinError = (message) => {
    const err = Error(message);
    err.statusCode = 400;
    return err;
  };
  /**
   * This is a validation for user login
   * @constant
   * 
   * @param {Object} req request object
   * @param {Object} res response object
   * @param {Object} next next object
   * 
   * @returns {Object} an object containing an error message if validation fails
   *
   * @exports validateLogin
   */
  
  const validateLogin = (req, res, next) => {
    let { email, password } = req.body;
    const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    email = email && email.toString().trim();
    password = password && password.toString();
  
    if (!email && !password) return next(signinError('Email and Password are required'));
    if (!email) return next(signinError('Email is required'));
    if (!emailRegex.test(email)) return next(signinError('Email is not valid'));
    if (!password) return next(signinError('Password is required'));
    if (password.trim() === '') return next(signinError('Password cannot be empty'));
    if (password.length < 6) return next(signinError('Password must be minimum of 6 characters'));
  
    return next();
  };
  
  export default validateLogin;
  