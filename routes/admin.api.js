const express = require('express'),
    router = express.Router();


const bodyParser = require('body-parser');
const fileUpload= require('../middleware/file-upload');
const urlencodedParser = bodyParser.urlencoded({extended: true});
const authlocal= require('../middleware/check-auth');
const CourseController = require('../controller/CourseController');
const AdminAuthController = require('../controller/AdminAuthController');
const UserAuthontroller = require('../controller/UserAuthController');
const ClassController = require('../controller/ClassController');
const MessageController = require('../controller/message');
const QuizController = require('../controller/QuizController');
const FeedController = require('../controller/FeedController');
const NotificationController = require('../controller/NotificationController');
router.post('/create-admin',urlencodedParser,AdminAuthController.createAdmin);
router.post('/admin-login',urlencodedParser,AdminAuthController.login);
router.post('/create-course',urlencodedParser, authlocal.isAuthenticated,CourseController.createCourse);
router.get('/get-all-course',urlencodedParser, authlocal.isAuthenticated,CourseController.getAllCourse);
router.post('/file-upload', urlencodedParser,authlocal.isAuthenticated,fileUpload.single('image'), CourseController.UpdateFile);
router.get('/get-all-topics/:cid', urlencodedParser, authlocal.isAuthenticated, CourseController.getAllTopicsByCourseId);
router.post('/create-new-topic', urlencodedParser, authlocal.isAuthenticated, CourseController.createTopic);
router.post('/add-video-content', urlencodedParser, authlocal.isAuthenticated,CourseController.uploadVideo);
router.post('/create-new-batch', urlencodedParser, authlocal.isAuthenticated, CourseController.createNewBatch);
router.post('/add-new-student', urlencodedParser, authlocal.isAuthenticated, UserAuthontroller.createUser);
router.get('/get-all-batchs/:cid', urlencodedParser, authlocal.isAuthenticated, CourseController.getAllBatchByCourseId);
router.get('/get-all-user', urlencodedParser, authlocal.isAuthenticated, UserAuthontroller.getAllUser);
router.post('/create-new-class', urlencodedParser, authlocal.isAuthenticated, ClassController.createNewClass);
router.get('/get-all-batchs/:cid', urlencodedParser, authlocal.isAuthenticated, ClassController.getAllBatchs);
router.post('/create-message', urlencodedParser, authlocal.isAuthenticated, MessageController.createMessage);
router.get('/get-all-admin-message', urlencodedParser, authlocal.isAuthenticated, MessageController.getAllMessageAdmin);
router.get('/get-all-added-class/:cid', urlencodedParser, authlocal.isAuthenticated, ClassController.getAllAddedClass);
router.get('/delete-class/:id', urlencodedParser, authlocal.isAuthenticated, ClassController.deleteClass);
router.get('/get-message-by-send/:senderId', urlencodedParser, authlocal.isAuthenticated, MessageController.getSingleMessageBySenderId);
router.post('/send-message-admin', urlencodedParser, authlocal.isAuthenticated, MessageController.sendMessageAdmin);
router.post('/create-quiz', urlencodedParser, authlocal.isAuthenticated, QuizController.createQuiz);
router.get('/get-all-quiz-for-admin', urlencodedParser, authlocal.isAuthenticated,QuizController.getAllQuizForAdmin);
router.post('/create-feed', urlencodedParser, authlocal.isAuthenticated, FeedController.createFeed);
router.get('/get-feed/:id', urlencodedParser, authlocal.isAuthenticated, FeedController.getSingleFeed);
router.get('/get-feeds-admin', urlencodedParser, authlocal.isAuthenticated, FeedController.getFeedForAdmin);
router.get('/delete-feed/:id', urlencodedParser, authlocal.isAuthenticated, FeedController.deleteFeed);
router.post('/send-notification', urlencodedParser, authlocal.isAuthenticated, NotificationController.sendNotification);
router.post('/create-due', urlencodedParser, authlocal.isAuthenticated, UserAuthontroller.createDue);
router.get('/clear-due/:uid', urlencodedParser, authlocal.isAuthenticated, UserAuthontroller.clearDue);
router.get('/get-admin-quiz/:tid', urlencodedParser, authlocal.isAuthenticated, QuizController.getTest);
router.get('/remove-device/:id', urlencodedParser, authlocal.isAuthenticated, UserAuthontroller.removeDevice)
router.get('/get-all-quiz-answer/:id', urlencodedParser, authlocal.isAuthenticated, QuizController.getAllAnswers)

module.exports=router;
