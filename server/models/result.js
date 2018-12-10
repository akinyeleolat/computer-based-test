/** Class for interacting with the test_results data table. */
export default class Result {
  /**
  * Class constructor.
  * @param {object} db - Object used to query the database.
  */
  constructor(db) {
    this.db = db;
  }
  /**
  * Create a new result resource.
  * @param {object} values - values gotten from the body of a request.
  */

  create(values) {
    const sql = 'INSERT INTO test_results (user_id, course_id, test_score) VALUES(${userId}, ${courseId}, ${testScore}) RETURNING *';
    return this.db.one(sql, values);
  }
  /**
  * Method for finding a result using the id.
  * @param {number} id - the id of a user.
  */

  find(values) {
    const sql = 'SELECT * FROM test_results WHERE user_id=${userId} AND course_id=${courseId}';
    return this.db.oneOrNone(sql, values);
  }
  /**
  * Method for modifying result after each question.
  * @param {number} id - the id of the created result resource.
  */

  modify(values, id) {
    values.id = id;
    const sql = 'UPDATE test_results SET user_id=${userId}, course_id=${courseId}, test_score=${scoreSheet} WHERE id=${id} RETURNING *';
    return this.db.one(sql, values);
  } 
}
