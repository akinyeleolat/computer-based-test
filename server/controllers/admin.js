import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import db from '../db';


/** user controller class */

class AdminController {
  /**
* @function signup
* @memberof AdminController
* @static
*/
  static adminSignup(req, res) {
    const adminStatus = process.env.ADMIN_DEFAULT;
    let { firstname, lastname, email, telephone, image } = req.body;
    const { password } = req.body;
    firstname = firstname ? firstname.toString().replace(/\s+/g, '') : firstname;
    lastname = lastname ? lastname.toString().replace(/\s+/g, '') : lastname;
    telephone = telephone ? telephone.toString().replace(/\s+/g, '') : telephone;
    email = email ? email.toString().replace(/\s+/g, '') : email;
    image = image ? image.toString().replace(/\s+/g, '') : image;

    return db.task('signup', db => db.adminUsers.findByEmail(email)
      .then((result) => {
        if (result) {
          return res.status(409).json({
            success: 'false',
            message: 'user with this email already exist',
          });
        }
        return db.adminUsers.findByTelephone(telephone)
          .then((found) => {
            if (found) {
              return res.status(409).json({
                success: 'false',
                message: 'user with this telephone number already exist',
              });
            }
            return db.adminUsers.create({ firstname, lastname, email, telephone, password, image, adminStatus })
              .then((user) => {
                  console.log(user);
                const token = jwt.sign({ id: user.id, firstname: user.firstname, lastname: user.lastname, email: user.email, telephone: user.telephone, user_image: user.image_url }, process.env.SECRET_KEY, { expiresIn: '24hrs' });
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
}

export default AdminController;
