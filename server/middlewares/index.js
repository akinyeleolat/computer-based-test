import validateSignup from './validateSignup';
import validateLogin from './validateLogin';
import validatePostCourse from './validatePostCourse';
import validateUpdateCourse from './validateUpdateCourse';
import validateApproveUser from './validateApproveUser';
import validatePostQuestion from './validatePostQuestion';
import verifyAdminToken from './verifyAdminToken';
import verifyUserToken from './verifyUserToken';

const middlewares = {
  validateSignup,
  validateLogin,
  validatePostCourse,
  validateUpdateCourse,
  validatePostQuestion,
  validateApproveUser,
  verifyAdminToken,
  verifyUserToken,
};

export default middlewares;
