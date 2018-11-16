import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import tcom from 'thesaurus-com';
import db from '../db';


/** course controller class */

class ResultController {
	/**
* @function takeTest
* @memberof QuestionController
*
* @param {Object} req - this is a request object that contains whatever is requested for
* @param {Object} res - this is a response object to be sent after attending to a request
*
* @static
*/
  static takeTest(req, res) {
    const { userId } = req;
    const { answers } = req.body;
    const courseId = parseInt(req.params.id, 10);
    let testScore = 0;
    const testReady = process.env.TEST_AVAILABLE;
    const activeUser = process.env.USER_ACTIVE;
    db.task('check course', data => data.course.findById(courseId)
      .then((courseFound) => {
        if (!courseFound || courseFound.course_availability != testReady) {
          return res.status(403).json({
            success: 'false',
            message: 'This test is not open yet',
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
            const serachValues = {
              userId, courseId,
            };
            return db.task('check result', data => data.results.find(serachValues)
              .then((resultFound) => {
                if (resultFound) {
                  return res.status(400).json({
                    success: 'false',
                    message: 'You seem to have taken this test before',
                  });
                }

                return db.task('post default result', data => data.results.create({ userId, courseId, testScore })
                  .then((result) => {
                    const resultId = result.id;
                    for (let value of answers) {
                      const choiceChosen = value.choice.toLowerCase().toString().replace(/\s+/g, '');
                      debugger;
                      const questionId = value.questionId;
                      db.task('find question', data => data.question.findById(questionId)
                        .then((questionFound) => {
                          if (!questionFound) {
                            testScore += 0;
                          }
                          const correctAnswer = questionFound[0].correct_answer.toLowerCase().toString().replace(/\s+/g, '');
                          const search = tcom.search(correctAnswer);
                          const synonyms = search.synonyms;
                          if (choiceChosen === correctAnswer) {
                            testScore += 1;
                          }
                          for (let synonym of synonyms) {
                            if (choiceChosen === synonym) {
                              testScore += 1;
                            }
                            testScore += 0;
                          }
                          const updateResult = {
                            userId, courseId, testScore,
                          };
                          db.task('update result', data => data.results.modify(updateResult, resultId)
                            .then(() => {
                              var last = answers[answers.length - 1]
                              if (value === last) {
                                return res.status(201).json({
                                  success: 'true',
                                  testScore: `You scored ${testScore} point(s)`,
                                });
                              }
                            }))
                        })
                      )
                    }
                  }))
              }))
          }))
      })
      .catch((err) => {
        return res.status(500).json({
          success: 'false',
          message: 'so sorry, try again later',
          err: err.message,
        });
      }))
  }



}

export default ResultController;
