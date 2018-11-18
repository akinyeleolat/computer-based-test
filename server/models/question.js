/** Class for interacting with the question and answer data table. */
export default class Question {
  /**
  * Class constructor.
  * @param {object} db - Object used to query the database.
  */
  constructor(db) {
    this.db = db;
  }
  /**
  * Create a new question.
  * @param {object} values - values gotten from the body of a request.
  */

  create(values) {
    const sql = 'INSERT INTO test_questions (admin_id, course_id, questions) VALUES(${adminId}, ${courseId}, ${question}) RETURNING *';
    return this.db.one(sql, values);
  }
  /**
* Method for finding a subject question.
* @param {string} question - the particular question description.
*/

  findByQuestion(question) {
    const sql = 'SELECT * FROM test_questions WHERE questions = $1';
    return this.db.oneOrNone(sql, question);
  }
  /**
* Method for finding a question using the id.
* @param {number} id - the id of course to be found.
*/

  findById(id) {
    const sql = 'SELECT * FROM test_questions LEFT JOIN test_answers ON test_questions.id = test_answers.question_id WHERE test_questions.course_id = $1';
    return this.db.many(sql, id);
  }
  /**
  * Method for removing a question from the database using the id.
  * @param {number} id - the id of a course.
  */

  remove(id) {
    const sql = 'DELETE FROM test_questions WHERE id = $1 RETURNING *';
    return this.db.one(sql, id);
  }

  /** Method for getting all questions belonging to a course in the database. */

  allData() {
    const sql = 'SELECT * FROM questions WHERE course_id = $1';
    return this.db.many(sql);
  }
}
