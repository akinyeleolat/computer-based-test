/**
 * function expression to handle error
 * @constant
 * 
 * @param {String} message - any error message we provide
 * 
 * @returns {Object}
 */

const postQuestionError = (message) => {
    const err = Error(message);
    err.statusCode = 400;
    return err;
  };
  
  /**
   * This is a validation for post question
   * @constant
   *
   * @param {Object} req request object
   * @param {Object} res response object
   * @param {Object} next next object
   *
   * @returns {Object} an object containing an error message if validation fails
   *
   * @exports validatePostQuestion
   */
  
  
  const validatePostQuestion = (req, res, next) => {
    let { question, optionOne, optionTwo, optionThree, optionFour, correctAnswer } = req.body;
    question = question && question.toString().trim();
    optionOne = optionOne && optionOne.toString().trim();
    optionTwo = optionTwo && optionTwo.toString().trim();
    optionThree = optionThree && optionThree.toString().trim();
    optionFour = optionFour && optionFour.toString().trim();
    correctAnswer = correctAnswer && correctAnswer.toString().trim();
  
    if (!question) return next(postQuestionError('question field cannot be empty'));
    if (!correctAnswer) return next(postQuestionError('Answer field cannot be empty'));
    return next();
  };
  export default validatePostQuestion;
  