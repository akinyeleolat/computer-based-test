/** Class for interacting with the subject course data table. */
export default class Course {
  /**
  * Class constructor.
  * @param {object} db - Object used to query the database.
  */
  constructor(db) {
    this.db = db;
  }
  /**
  * Create a new subject course.
  * @param {object} values - values gotten from the body of a request.
  */

  create(values) {
    const sql = 'INSERT INTO courses (course_title, course_availability) VALUES(${courseTitle}, ${courseAvailability}) RETURNING *';
    return this.db.one(sql, values);
  }
  /**
  * Method for finding a subject course using the id.
  * @param {number} id - the id of a course.
  */

  findById(id) {
    const sql = 'SELECT * FROM courses WHERE id = $1';
    return this.db.oneOrNone(sql, id);
  }
  /**
* Method for finding a subject course using the name of the course.
* @param {number} courseTitle - the id of a course.
*/

  findByName(courseTitle) {
    const sql = 'SELECT * FROM courses WHERE course_title = $1';
    return this.db.oneOrNone(sql, courseTitle);
  }
  /**
  * Method for removing a course from the database using the id.
  * @param {number} id - the id of a course.
  */

  remove(id) {
    const sql = 'DELETE FROM courses WHERE id = $1 RETURNING *';
    return this.db.one(sql, id);
  }

  /** Method for getting all courses in the database. */

  allData() {
    const sql = 'SELECT * FROM courses';
    return this.db.many(sql);
  }
  /**
  * Method for modifying course availability.
  * @param {number} id - the id of a subject course.
  */

  modify(values, id) {
    values.id = id;
    const sql = 'UPDATE courses SET course_availability=${courseAvailability} WHERE id=${id} RETURNING *';
    return this.db.one(sql, values);
  }
}
