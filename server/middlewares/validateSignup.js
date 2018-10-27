/**
 * This is a validation for user sign up
 * @constant
 * 
 * @param {String} message - any error message we provide
 * 
 * @returns {Object}
 */

const signupError = (message) => {
    const err = Error(message);
    err.statusCode = 400;
    return err;
  };
  
  /**
   * This is a validation for user signup
   * @constant
   *
   * @param {Object} req request object
   * @param {Object} res response object
   * @param {Object} next next object
   *
   * @returns {Object} an object containing an error message if validation fails
   *
   * @exports validateSignup
   */
  
  
  const validateSignup = (req, res, next) => {
    let {
      email, password, firstname, lastname, telephone, image,
    } = req.body;
    const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    const urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/;
    email = email && email.toString().trim();
    firstname = firstname && firstname.toString().trim();
    lastname = lastname && lastname.toString().trim();
    password = password && password.toString();
    telephone = telephone && telephone.toString().replace(/\s+/g, '');
  
    if (!email && !password) return next(signupError('Email and Password are required'));
  
    if (!email) return next(signupError('Email is required'));
    if (!emailRegex.test(email)) return next(signupError('Email is not valid'));
    if (!urlRegex.test(image)) return next(signupError('URL is not valid'));
    if (!password) return next(signupError('Password is required'));
    if (password.trim() === '') return next(signupError('Password cannot be empty'));
    if (password.length < 6) return next(signupError('Password must be minimum of 6 characters'));
  
    if (!firstname && !lastname) return next(signupError('firstname and lastname are required'));
    if (!firstname) return next(signupError('firstname is required'));
    if (firstname && firstname.length < 3) return next(signupError('firstname must be minimum of 3 characters'));
    if (firstname && firstname.length > 20) return next(signupError('firstname must be maximum of 20 characters'));
  
    if (!lastname) return next(signupError('lastname is required'));
    if (lastname && lastname.length < 3) return next(signupError('lastname must be minimum of 3 characters'));
    if (lastname && lastname.length > 20) return next(signupError('lastname must be maximum of 20 characters'));
    if (telephone && isNaN(telephone)) return next(signupError('telephone number should not contain an alphabet'));
    if (telephone && telephone.length > 11) return next(signupError('telephone number should not be greater than 11 characters'));
    if (telephone && telephone.length < 11) return next(signupError('telephone number should not be less than 11 characters'));
  
    return next();
  };
  
  export default validateSignup;
  