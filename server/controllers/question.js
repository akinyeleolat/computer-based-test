import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import tcom from 'thesaurus-com';
import natural from 'natural';
import db from '../db';
import User from '../models/users';


const wordnet = new natural.WordNet();

/** course controller class */

class QuestionController {
  /**
* @function postQuestion
* @memberof QuestionController
*
* @param {Object} req - this is a request object that contains whatever is requested for
* @param {Object} res - this is a response object to be sent after attending to a request
*
* @static
*/

  static postQuestion(req, res) {
    const { adminId } = req;
    const courseId = parseInt(req.params.id, 10);
    let { question, optionOne, optionTwo, optionThree, optionFour, correctAnswer } = req.body;
    question = question ? question.toString().replace(/\s+/g, ' ') : question;
    optionOne = optionOne ? optionOne.toString().replace(/\s+/g, ' ') : optionOne;
    optionTwo = optionTwo ? optionTwo.toString().replace(/\s+/g, ' ') : optionTwo;
    optionThree = optionThree ? optionThree.toString().replace(/\s+/g, ' ') : optionThree;
    optionFour = optionFour ? optionFour.toString().replace(/\s+/g, ' ') : optionFour;
    correctAnswer = correctAnswer ? correctAnswer.toString().replace(/\s+/g, ' ') : correctAnswer;
    const activeAdmin = process.env.ADMIN_ACTIVE;
    db.task('find admin user', data => data.admin.findById(adminId)
      .then((user) => {
        if (user.admin_status != activeAdmin) {
          return res.status(401).json({
            success: 'false',
            message: 'user unauthorized to post questions',
          });
        }
        return db.task('find course', data => data.course.findById(courseId)
          .then((courseFound) => {
            if (!courseFound) {
              return res.status(400).json({
                success: 'false',
                message: 'this subject does not exist in the database',
              });
            }
            return db.question.findByQuestion(question)
              .then((questionFound) => {
                if (questionFound) {
                  return res.status(409).json({
                    success: 'false',
                    message: 'This question already exist',
                  });
                }
                return db.question.create({ adminId, courseId, question })
                  .then((question) => {
                    const questionId = question.id;
                    return db.answer.create({ questionId, optionOne, optionTwo, optionThree, optionFour, correctAnswer })
                      .then(() => {
                        return res.status(201).json({
                          success: 'true',
                          message: 'You have successfully posted a question and an answer for it',
                        });
                      })
                  })
              });
          })
        );
      })
      .catch((err) => {
        return res.status(500).json({
          success: 'false',
          message: 'so sorry, try again later',
          err: err.message,
        });
      }));
  }

}

export default QuestionController;
