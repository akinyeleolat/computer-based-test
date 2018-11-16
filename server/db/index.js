import path from 'path';
import Promise from 'bluebird';
import pgp, { QueryFile } from 'pg-promise';
import setup from '../config/config';
import User from '../models/users';
import Admin from '../models/admin';
import Course from '../models/course';
import Question from '../models/question';
import Answer from '../models/answer';
import Result from '../models/result';

/** @const sql - generating a full path */

const sql = (file) => {
  const fullPath = path.join(__dirname, file);
  return new QueryFile(fullPath, { minify: true });
};

/** @const initoptions pg-promise initialization options  */

const initOptions = {
  promiseLib: Promise,
  extend(obj) {
    obj.users = new User(obj);
    obj.admin =  new Admin(obj);
    obj.course = new Course(obj);
    obj.question = new Question(obj);
    obj.results = new Result(obj);
    obj.answer = new Answer(obj);
  },
};

const env = process.env.NODE_ENV || 'development';
const config = setup[env];

let $db;

if (config.use_env_variable) {
  $db = pgp(initOptions)(process.env[config.use_env_variable]);
} else {
  $db = pgp(initOptions)(config);
}

const db = $db;

db
  .query(sql('./cbt.sql'))
  .then(() => {
    console.log('Database successfully initialized');
  })
  .catch((err) => {
    console.log(err);
  });

export default db;
