import validateSignup from './validateSignup';
import validateLogin from './validateLogin';
import validatePostCourse from './validatePostCourse';
import verifyAdminToken from './verifyAdminToken';
import verifyUserToken from './verifyUserToken';

const middlewares = {
  validateSignup,
  validateLogin,
  validatePostCourse,
  verifyAdminToken,
  verifyUserToken,
};

export default middlewares;
