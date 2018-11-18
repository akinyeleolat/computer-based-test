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
  /**
* @function getAllQuestions
* @memberof QuestionController
*
* @param {Object} req - this is a request object that contains whatever is requested for
* @param {Object} res - this is a response object to be sent after attending to a request
*
* @static
*/

  static getAllQuestions(req, res) {
    const { userId } = req;
    const courseId = parseInt(req.params.id, 10);
    const activeUser = process.env.USER_ACTIVE;
    const testReady = process.env.TEST_AVAILABLE;
    if (isNaN(courseId)) {
      return res.status(400).json({
        success: 'false',
        message: 'param should be a number not an alphabet',
      });
    }
    return db.task('fetch user', data => data.users.findById(userId)
      .then((user) => {
        if (user.user_status != activeUser) {
          return res.status(401).json({
            success: 'false',
            message: 'This account needs to be approved to take a test',
          });
        }
        return db.task('check course', data => data.course.findById(courseId)
          .then((courseFound) => {
            if (!courseFound || courseFound.course_availability != testReady) {
              return res.status(403).json({
                success: 'false',
                message: 'This course is not open yet for test',
              });
            }
            return db.question.findById(courseId)
              .then((questions) => {
                return res.status(200).json({
                  success: 'true',
                  questions,
                });
              })
          }))
      })
      .catch((err) => {
        res.status(404).json({
          success: 'false',
          message: 'nothing found in the database',
          err: err.message,
        });
      }))
  }

}

export default QuestionController;
