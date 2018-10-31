import validateSignup from './validateSignup';
import validateLogin from './validateLogin';
import validatePostCourse from './validatePostCourse';
import validateUpdateCourse from './validateUpdateCourse';
import verifyAdminToken from './verifyAdminToken';
import verifyUserToken from './verifyUserToken';

const middlewares = {
  validateSignup,
  validateLogin,
  validatePostCourse,
  validateUpdateCourse,
  verifyAdminToken,
  verifyUserToken,
};

export default middlewares;
