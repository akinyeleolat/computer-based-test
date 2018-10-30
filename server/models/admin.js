import bcrypt from 'bcrypt-nodejs';

/** Class for interacting with the admin data table. */
export default class Admin {
  /**
  * Class constructor.
  * @param {object} db - Object used to query database.
  */
  constructor(db) {
    this.db = db;
  }
  /**
  * Create a new admin user.
  * @param {object} values - values gotten from the body of a request.
  */


 create(values) {
  const salt = bcrypt.genSaltSync(10);
  values.password = bcrypt.hashSync(values.password, salt);
  const sql = 'INSERT INTO admin_users (firstname, lastname, email, telephone, admin_password, department, faculty, image_url, admin_status) VAlUES( ${firstname}, ${lastname}, ${email}, ${telephone}, ${password}, ${department}, ${faculty}, ${image}, ${adminStatus}) RETURNING id, firstname, lastname, email, telephone, department, faculty, image_url, admin_status';
  return this.db.one(sql, values);
}

  /**
  * Method for finding a user using the id.
  * @param {number} id - the id of a user.
  */

  findById(id) {
    const sql = 'SELECT * FROM admin_users WHERE id = $1';
    return this.db.oneOrNone(sql, id);
  }
  /**
  * Method for finding a user using the email address.
  * @param {String} email - the email of a user.
  */

  findByEmail(email) {
    const sql = 'SELECT * FROM admin_users WHERE email = $1';
    return this.db.oneOrNone(sql, email);
  }
  /**
  * Method for finding a user using the telephone number.
  * @param {String} telephone - the telephone number of a user.
  */

  findByTelephone(telephone) {
    const sql = 'SELECT * FROM admin_users WHERE telephone = $1';
    return this.db.oneOrNone(sql, telephone);
  }
  /**
  * Method for removing a user from the database using the id.
  * @param {number} id - the id of a user.
  */

  remove(id) {
    const sql = 'DELETE FROM admin_users WHERE id = $1';
    return this.db.one(sql, id);
  }
  /**
  * Method for modifying user information.
  * @param {number} id - the id of a user.
  */

  modify(values, id) {
    values.id = id;
    const sql = 'UPDATE admin_users SET firstname=${firstname}, lastname=${lastname}, email=${email}, telephone=${telephone} WHERE id=${id} RETURNING *';
    return this.db.one(sql, values);
  }
}
