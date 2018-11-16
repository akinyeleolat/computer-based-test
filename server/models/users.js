import bcrypt from 'bcrypt-nodejs';

/** Class for interacting with the user data table. */
export default class User {
  /**
  * Class constructor.
  * @param {object} db - Object used to query database.
  */
  constructor(db) {
    this.db = db;
  }
  /**
  * Create a new user.
  * @param {object} values - values gotten from the body of a request.
  */

  create(values) {
    const salt = bcrypt.genSaltSync(10);
    values.password = bcrypt.hashSync(values.password, salt);
    const sql = 'INSERT INTO users (firstname, lastname, email, telephone, password, department, faculty, image_url, user_status) VAlUES( ${firstname}, ${lastname}, ${email}, ${telephone}, ${password}, ${department}, ${faculty}, ${image}, ${userStatus}) RETURNING id, firstname, lastname, email, telephone, department, faculty, image_url, user_status';
    return this.db.one(sql, values);
  }

  /**
  * Method for finding a user using the id.
  * @param {number} id - the id of a user.
  */

  findById(id) {
    const sql = 'SELECT * FROM users WHERE id = $1';
    return this.db.oneOrNone(sql, id);
  }
  /**
  * Method for finding a user using the email address.
  * @param {String} email - the email of a user.
  */

  findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = $1';
    return this.db.oneOrNone(sql, email);
  }
  /**
  * Method for finding a user using the telephone number.
  * @param {String} telephone - the telephone number of a user.
  */

  findByTelephone(telephone) {
    const sql = 'SELECT * FROM users WHERE telephone = $1';
    return this.db.oneOrNone(sql, telephone);
  }
  /**
  * Method for removing a user from the database using the id.
  * @param {number} id - the id of a user.
  */

  remove(id) {
    const sql = 'DELETE FROM users WHERE id = $1';
    return this.db.one(sql, id);
  }
  /** Method for getting all users in the database. */

  allData() {
    const sql = 'SELECT * FROM users';
    return this.db.many(sql);
  }
  /**
  * Method for modifying user information.
  * @param {number} id - the id of a user.
  */

  modify(values, id) {
    values.id = id;
    const sql = 'UPDATE users SET firstname=${firstname}, lastname=${lastname}, email=${email}, telephone=${telephone} WHERE id=${id} RETURNING *';
    return this.db.one(sql, values);
  }
  /**
  * Method for modifying user status.
  * @param {number} id - the id of a subject course.
  */

  modifyStatus(values, id) {
    values.id = id;
    const sql = 'UPDATE users SET user_status=${approve} WHERE id=${id} RETURNING *';
    return this.db.one(sql, values);
  }
}