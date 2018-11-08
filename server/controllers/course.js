import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import db from '../db';


/** course controller class */

class CourseController {
  /**
* @function postCourse
* @memberof CourseController
*
* @param {Object} req - this is a request object that contains whatever is requested for
* @param {Object} res - this is a response object to be sent after attending to a request
*
* @static
*/

  static postCourse(req, res) {
    const { adminId } = req;
    let { courseTitle } = req.body;
    courseTitle = courseTitle ? courseTitle.toString().replace(/\s+/g, '') : courseTitle;
    const courseAvailability = process.env.DEFAULT_AVAILABLE;
    const superAdminStatus = process.env.ADMIN_SUPER;
    db.task('find admin user', data => data.admin.findById(adminId)
      .then((user) => {
        if (user.admin_status != superAdminStatus) {
          return res.status(401).json({
            success: 'false',
            message: 'user unauthorized to add a subject course to the database',
          });
        }
        return db.task('post course', data => data.course.findByName(courseTitle)
          .then((courseFound) => {
            if (courseFound) {
              return res.status(409).json({
                success: 'false',
                message: 'this course title already exist in the database',
              });
            }
            return db.course.create({ courseTitle, courseAvailability })
              .then(() => {
                return res.status(201).json({
                  success: 'true',
                  message: 'Subject course has been added in successfully',
                });
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
* @function getAllCourses
* @memberof CourseController
*
* @param {Object} req - this is a request object that contains whatever is requested for
* @param {Object} res - this is a response object to be sent after attending to a request
*
* @static
*/

  static getAllCourses(req, res) {
    db.task('all subject course', db => db.course.allData()
      .then((course) => {
        const courses = [...course];
        return res.status(200).json({
          success: 'true',
          courses,
        });
      })
      .catch((err) => {
        res.status(404).json({
          success: 'false',
          message: 'nothing found in the database',
          err: err.message,
        });
      }));
  }
  /**
* @function updateCourse
* @memberof CourseController
*
* @param {Object} req - this is a request object that contains whatever is requested for
* @param {Object} res - this is a response object to be sent after attending to a request
*
* @static
*/
  static updateCourse(req, res) {
    const { adminId } = req;
    const id = parseInt(req.params.id, 10);
    let { courseAvailability } = req.body;
    courseAvailability = courseAvailability && courseAvailability.toString().replace(/\s+/g, '');
    const superAdminStatus = process.env.ADMIN_SUPER;
    db.task('modify course availability', data => data.course.findById(id)
      .then((courseFound) => {
        if (!courseFound) {
          return res.status(400).json({
            success: 'false',
            message: 'This course does not exist',
          });
        }
        return db.admin.findById(adminId)
          .then((adminFound) => {
            if (adminFound.admin_status != superAdminStatus) {
              return res.status(401).json({
                success: 'false',
                message: 'You are unauthorized to approve this course to be taken as test',
              });
            }
            if (req.body.courseAvailability === 'true') {
              courseAvailability = process.env.TEST_AVAILABLE;
              const updateCourseAvailability = {
                courseAvailability,
              };
              return db.course.modify(updateCourseAvailability, id)
                .then(() => {
                  res.status(200).json({
                    success: 'true',
                    message: 'successful! this course is now ready to be taken as test',
                  });
                });
            }
            else if (req.body.courseAvailability === 'false') {
              courseAvailability = process.env.DEFAULT_AVAILABLE;
              const updateCourseAvailability = {
                courseAvailability,
              };
              return db.course.modify(updateCourseAvailability, id)
                .then(() => {
                  res.status(200).json({
                    success: 'true',
                    message: 'test dropped! this course is not ready to be taken as test',
                  });
                });
            }
          });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({
          success: 'false',
          message: 'so sorry, try again later',
          err: err.message,
        });
      }));
  }
  /**
* @function deleteCourse
* @memberof CourseController
*
* @param {Object} req - this is a request object that contains whatever is requested for
* @param {Object} res - this is a response object to be sent after attending to a request
*
* @static
*/
  static deleteCourse(req, res) {
    const { adminId } = req;
    const id = parseInt(req.params.id, 10);
    const superAdminStatus = process.env.ADMIN_SUPER;
    db.task('find course', data => data.course.findById(id)
      .then((courseFound) => {
        if (!courseFound || courseFound.length === 0) {
          return res.status(404).json({
            success: 'false',
            message: 'The course you are about to delete does not exist',
          });
        }
        return db.admin.findById(adminId)
          .then((adminFound) => {
            if (adminFound.admin_status != superAdminStatus) {
              return res.status(401).json({
                success: 'false',
                message: 'You are unauthorized to delete a subject course',
              });
            }
            return db.course.remove(id)
            .then(() => {
              return res.status(200).json({
                success: 'true',
                message: 'You have successfully deleted a subject course from the database',
              });
            })
          })
      })
      .catch((err) => {
        return res.status(500).json({
          success: 'true',
          message: err.message,
        });
      }));
  }
}

export default CourseController;
