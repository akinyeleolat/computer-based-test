/**
 * function expression to handle error
 * @constant
 * 
 * @param {String} message - any error message we provide
 * 
 * @returns {Object}
 */

const approveUserError = (message) => {
    const err = Error(message);
    err.statusCode = 400;
    return err;
  };
  
  /**
   * This is a validation for approving a candidate user account
   * @constant
   *
   * @param {Object} req request object
   * @param {Object} res response object
   * @param {Object} next next object
   *
   * @returns {Object} an object containing an error message if validation fails
   *
   * @exports validateApproveUser
   */
  
  
  const validateApproveUser = (req, res, next) => {
    let { approve } = req.body;
    approve = approve && approve.toString().trim();
  
    if (!approve) return next(approveUserError('this field cannot be empty. Please provide a value.'));
    if (approve !== 'true' && approve !== 'false') return next(approveUserError('the approval value can either be true or false.'));
    return next();
  };
  export default validateApproveUser;
  