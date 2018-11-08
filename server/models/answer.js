/** Class for interacting with the question and answer data table. */
export default class Answer {
    /**
    * Class constructor.
    * @param {object} db - Object used to query the database.
    */
    constructor(db) {
      this.db = db;
    }
    /**
    * Create answer.
    * @param {object} values - values gotten from the body of a request.
    */
  
    create(values) {
      const sql = 'INSERT INTO test_answers (question_id, option_one, option_two, option_three, option_four, correct_answer) VALUES(${questionId}, ${optionOne}, ${optionTwo}, ${optionThree}, ${optionFour}, ${correctAnswer}) RETURNING *';
      return this.db.one(sql, values);
    }
}
  