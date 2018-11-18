import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import db from '../db';


/** user controller class */

class UserController {
  /**
 * @function signup
 * @memberof UserController
 * @static
 */
  static signup(req, res) {
    const userStatus = process.env.USER_DEFAULT;
    let { firstname, lastname, email, telephone, image, department, faculty } = req.body;
    const { password } = req.body;
    firstname = firstname ? firstname.toString().replace(/\s+/g, '') : firstname;
    lastname = lastname ? lastname.toString().replace(/\s+/g, '') : lastname;
    telephone = telephone ? telephone.toString().replace(/\s+/g, '') : telephone;
    department = department ? department.toString().replace(/\s+/g, '') : department;
    faculty = faculty ? faculty.toString().replace(/\s+/g, '') : faculty;
    email = email ? email.toString().replace(/\s+/g, '') : email;
    image = image ? image.toString().replace(/\s+/g, '') : image;

    return db.task('signup', db => db.users.findByEmail(email)
      .then((result) => {
        if (result) {
          return res.status(409).json({
            success: 'false',
            message: 'user with this email already exist',
          });
        }
        return db.users.findByTelephone(telephone)
          .then((found) => {
            if (found) {
              return res.status(409).json({
                success: 'false',
                message: 'user with this telephone number already exist',
              });
            }
            return db.users.create({ firstname, lastname, email, telephone, password, department, faculty, image, userStatus })
              .then((user) => {
                return res.status(201).json({
                  success: 'true',
                  message: 'Account created successfully but pending approval within the next 48 hours',
                });
              });
          });
      })
      .catch((err) => {
        return res.status(500).json({
          success: 'false',
          message: 'unable to create user account',
          err: err.message,
        });
      }));
  }
  /**
* @function login
* @memberof UserController
*
* @param {Object} req - this is a request object that contains whatever is requested for
* @param {Object} res - this is a response object to be sent after attending to a request
*
* @static
*/

  static login(req, res) {
    let { email } = req.body;
    const { password } = req.body;
    email = email && email.toString().trim();

    return db.task('signin', data => data.users.findByEmail(email)
      .then((user) => {
        if (!user) {
          return res.status(401).json({
            success: 'false',
            message: 'You have entered an invalid email or password',
          });
        }
        const allowEntry = bcrypt.compareSync(password, user.password);
        if (!allowEntry) {
          return res.status(401).json({
            success: 'false',
            message: 'You have entered an invalid email or password',
          });
        }
        const isActive = process.env.USER_ACTIVE;
        if (user.user_status != isActive) {
          return res.status(401).json({
            success: 'false',
            message: 'Your account is pending approval, please try again later',
          });
        }
        else if (user.user_status == isActive) {
          const token = jwt.sign({ id: user.id, firstname: user.firstname, lastname: user.lastname, email: user.email, telephone: user.telephone, department: user.department, faculty: user.faculty, user_image: user.image_url }, process.env.SECRET_KEY, { expiresIn: '24hrs' });
          return res.status(200).json({
            success: 'true',
            message: 'Login was successful',
            token,
          });
        }
      }))
      .catch((err) => {
        return res.status(500).json({
          success: 'false',
          message: 'unable to login, try again!',
          err: err.message,
        });
      });
  }
  /**
 * @function getAllUsers
 * @memberof CourseController
 *
 * @param {Object} req - this is a request object that contains whatever is requested for
 * @param {Object} res - this is a response object to be sent after attending to a request
 *
 * @static
 */

  static getAllUsers(req, res) {
    const { adminId } = req;
    const superAdminStatus = process.env.ADMIN_SUPER;
    const defaultUser = process.env.USER_DEFAULT;
    db.task('find admin user', db => db.admin.findById(adminId)
      .then((adminFound) => {
        if (adminFound.admin_status != superAdminStatus) {
          return res.status(401).json({
            success: 'false',
            message: 'You are unauthorized to get candidates information',
          });
        }
        return db.users.findByStatus(defaultUser)
          .then((user) => {
            const candidates = [...user];
            return res.status(200).json({
              success: 'true',
              candidates,
            });
          })
      })
      .catch((err) => {
        res.status(404).json({
          success: 'false',
          message: 'no account needs approval for now',
          err: err.message,
        });
      }));
  }
  /**
* @function getUser
* @memberof CourseController
*
* @param {Object} req - this is a request object that contains whatever is requested for
* @param {Object} res - this is a response object to be sent after attending to a request
*
* @static
*/

  static getUser(req, res) {
    const { userId } = req;
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({
        success: 'false',
        message: 'param should be a number not an alphabet',
      });
    }
    return db.task('fetch user', data => data.users.findById(id)
      .then((user) => {
        if (user.id !== userId) {
          return res.status(401).json({
            success: 'false',
            message: 'You are unauthorized to get an information that is not yours',
          });
        }
        const { firstname, lastname, email, telephone, department, faculty, image_url } = user;
        const userProfile = {
          firstname, lastname, email, telephone, department, faculty, image_url,
        }

        return res.status(200).json({
          success: 'true',
          userProfile,
        })
      })
      .catch((err) => {
        res.status(500).json({
          success: 'false',
          message: err.message,
        })
      }));
  }
    /**
  * @function approveUser
  * @memberof UserController
  *
  * @param {Object} req - this is a request object that contains whatever is requested for
  * @param {Object} res - this is a response object to be sent after attending to a request
  *
  * @static
  */
  static approveUser(req, res) {
    const { adminId } = req;
    const id = parseInt(req.params.id, 10);
    let { approve } = req.body;
    approve = approve && approve.toString().replace(/\s+/g, '');
    const superAdminStatus = process.env.ADMIN_SUPER;
    db.task('approve a candidate user', data => data.users.findById(id)
      .then((userFound) => {
        if (!userFound) {
          return res.status(400).json({
            success: 'false',
            message: 'This user does not exist',
          });
        }
        return db.admin.findById(adminId)
          .then((adminFound) => {
            if (adminFound.admin_status != superAdminStatus) {
              return res.status(401).json({
                success: 'false',
                message: 'You are unauthorized to verify a student account',
              });
            }
            if (req.body.approve === 'true') {
              approve = process.env.USER_ACTIVE;
              const approveCandidateUser = {
                approve,
              };
              return db.users.modifyStatus(approveCandidateUser, id)
                .then(() => {
                  res.status(200).json({
                    success: 'true',
                    message: 'successful! this account has been verified',
                  });
                });
            }
            else if (req.body.approve === 'false') {
              approve = process.env.USER_DEFAULT;
              const approveCandidateUser = {
                approve,
              };
              return db.users.modifyStatus(approveCandidateUser, id)
                .then(() => {
                  res.status(200).json({
                    success: 'true',
                    message: 'user account has been successfully deactivated',
                  });
                });
            }
          });
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

export default UserController;
