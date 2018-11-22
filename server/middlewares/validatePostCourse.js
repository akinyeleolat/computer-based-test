/**
 * function expression to handle error
 * @constant
 * 
 * @param {String} message - any error message we provide
 * 
 * @returns {Object}
 */

const postCourseError = (message) => {
    const err = Error(message);
    err.statusCode = 400;
    return err;
  };
  
  /**
   * This is a validation for post course
   * @constant
   *
   * @param {Object} req request object
   * @param {Object} res response object
   * @param {Object} next next object
   *
   * @returns {Object} an object containing an error message if validation fails
   *
   * @exports validatePostCourse
   */
  
  
  const validatePostCourse = (req, res, next) => {
    let { courseTitle, courseDescription } = req.body;
    courseTitle = courseTitle && courseTitle.toString().trim();
    courseDescription = courseDescription && courseDescription.toString().trim();
  
    if (!courseTitle) return next(postCourseError('you must input a title for the subject course'));
    if (courseTitle && courseTitle.length < 6) return next(postCourseError('course title must be a minimum of six characters'));
    if (!courseDescription) return next(postCourseError('you must input description for the subject course'));
    if (courseDescription && courseDescription.length < 10) return next(postCourseError('course description must be a minimum of ten characters'));
    return next();
  };
  export default validatePostCourse;
  