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
                const token = jwt.sign({ id: user.id, firstname: user.firstname, lastname: user.lastname, email: user.email, telephone: user.telephone, department: user.department, faculty: user.faculty, user_image: user.image_url }, process.env.SECRET_KEY, { expiresIn: '24hrs' });
                return res.status(201).json({
                  success: 'true',
                  message: 'Account created successfully',
                  token,
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
          return res.status(404).json({
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
        const token = jwt.sign({ id: user.id, firstname: user.firstname, lastname: user.lastname, email: user.email, telephone: user.telephone, department: user.department, faculty: user.faculty, user_image: user.image_url }, process.env.SECRET_KEY, { expiresIn: '24hrs' });
        return res.status(200).json({
          success: 'true',
          message: 'Login was successful',
          token,
        });
      }))
      .catch((err) => {
        return res.status(500).json({
          success: 'false',
          message: 'unable to login, try again!',
          err: err.message,
        });
      });
  }
}

export default UserController;
