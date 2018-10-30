import jwt from 'jsonwebtoken';
import db from '../db';

/**
 * Authorization: Bearer <access_token>
 * @constant
 *
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {Object} next next object
 *
 * @returns {Object}
 *
 * @exports verifyToken
 */

const verifyToken = (req, res, next) => {
  const token = req.header('token');
  if (!token) {
    const err = Error('User authorization token is required');
    err.statusCode = 401;
    return next(err);
  }

  if (token === undefined || token === null) {
    const err = Error('User authorization token is required');
    err.statusCode = 401;
    return next(err);
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.SECRET_KEY);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      const error = Error('Expired user authorization token');
      error.statusCode = 401;
      return next(error);
    }
    const error = Error('Invalid user authorization token');
    error.statusCode = 401;
    return next(error);
  }

  return db.users.findById(decoded.id)
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          status: 'fail',
          message: 'Invalid user authorization token',
        });
      }
      req.userId = decoded.id;
      return next();
    });
};

export default verifyToken;
