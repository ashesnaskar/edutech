const express = require('express'),
    router = express.Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: true});
const UserAuthenticationController = require('../controller/UserAuthController');
const CourseController = require('../controller/CourseController');
const ClassController = require('../controller/ClassController');
const auth = require('../middleware/check-auth');
const MessageController = require('../controller/message');
const QuizController = require('../controller/QuizController');
const FeedController = require('../controller/FeedController');

router.get('/force-update',urlencodedParser, UserAuthenticationController.ForceUpdate);
router.post('/get-otp', urlencodedParser, UserAuthenticationController.getOtp);
router.post('/resend-otp', urlencodedParser, UserAuthenticationController.resendOtp);
router.post('/login',urlencodedParser,UserAuthenticationController.loginUser);
router.post('/validate-otp', urlencodedParser, UserAuthenticationController.validateRegOtp)
router.post('/create-user',urlencodedParser,UserAuthenticationController.createUser);
router.get('/get-all-topic-front', urlencodedParser, auth.isAuthenticated,CourseController.getAllTopicFront);
router.get('/get-all-video-front', urlencodedParser,auth.isAuthenticated,CourseController.getAllVideoFront);
router.get('/get-all-topic', urlencodedParser, auth.isAuthenticated,CourseController.getAllTopicApp);
router.get('/get-all-video/:tid', urlencodedParser,auth.isAuthenticated,CourseController.getAllVideoApp);
router.get('/attend-class/:cid', urlencodedParser, auth.isAuthenticated,ClassController.attendClass);
router.get('/get-all-class', urlencodedParser, auth.isAuthenticated,ClassController.getAllClassForUser);
router.get('/get-course/:id', urlencodedParser, auth.isAuthenticated, CourseController.getCourseById);
router.get('/get-next-class', urlencodedParser, auth.isAuthenticated, ClassController.getNextClass);
router.post('/create-message', urlencodedParser, auth.isAuthenticated, MessageController.createMessage);
router.get('/get-all-user-message', urlencodedParser, auth.isAuthenticated, MessageController.getAllMessageUsers);
router.get('/get-all-notification', urlencodedParser, auth.isAuthenticated, ClassController.getAllNotification);
router.get('/get-all-test', urlencodedParser, auth.isAuthenticated, QuizController.getAllQuizUser);
router.get('/get-test/:tid', urlencodedParser, auth.isAuthenticated, QuizController.getTest);
router.get('/get-user-test/:tid',urlencodedParser, auth.isAuthenticated, QuizController.getUserTest);
router.post('/get-all-feed', urlencodedParser, auth.isAuthenticated, FeedController.getFeedForUser);
router.get('/like-feed/:id', urlencodedParser, auth.isAuthenticated, FeedController.LikeFeed);
router.get('/finish-test/:utid', urlencodedParser, auth.isAuthenticated, QuizController.FinishTest);
router.post('/save-answer', urlencodedParser, auth.isAuthenticated, QuizController.SaveAnswer);
router.get('/get-user-profile',urlencodedParser , auth.isAuthenticated , UserAuthenticationController.getUserById)
router.get('/get-due',urlencodedParser,auth.isAuthenticated,UserAuthenticationController.getDue);
router.post('/save-payment', urlencodedParser, UserAuthenticationController.savePayment);
router.post('/error-payment', urlencodedParser, UserAuthenticationController.errorPayment);
router.get('/class-percentages', urlencodedParser, auth.isAuthenticated, ClassController.getCalassPercentage);
router.get('/logout', urlencodedParser, auth.isAuthenticated, UserAuthenticationController.removeDevice);
module.exports = router;
