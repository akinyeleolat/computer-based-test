/**
 * function expression to handle error
 * @constant
 * 
 * @param {String} message - any error message we provide
 * 
 * @returns {Object}
 */

const updateCourseError = (message) => {
    const err = Error(message);
    err.statusCode = 400;
    return err;
  };
  
  /**
   * This is a validation for updating course test availability
   * @constant
   *
   * @param {Object} req request object
   * @param {Object} res response object
   * @param {Object} next next object
   *
   * @returns {Object} an object containing an error message if validation fails
   *
   * @exports validateUpdateCourse
   */
  
  
  const validateUpdateCourse = (req, res, next) => {
    let { courseAvailability } = req.body;
    courseAvailability = courseAvailability && courseAvailability.toString().trim();
  
    if (!courseAvailability) return next(updateCourseError('this field cannot be empty. Please provide a value.'));
    if (courseAvailability !== 'true' || courseAvailability !== 'false') return next(updateCourseError('course availability value can either be true or false.'));
    return next();
  };
  export default validateUpdateCourse;
  