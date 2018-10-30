import validateSignup from './validateSignup';
import validateLogin from './validateLogin';
import validatePostCourse from './validatePostCourse';
import verifyAdminToken from './verifyAdminToken';

const middlewares = {
  validateSignup,
  validateLogin,
  validatePostCourse,
  verifyAdminToken,
};

export default middlewares;
