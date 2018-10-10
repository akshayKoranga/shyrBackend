var express = require('express');
var multer  = require('multer');
var upload = multer();

var eventController = require('../controller/Api/EventController');
var homeController = require('../controller/Api/HomeController');
var gameController = require('../controller/Api/GamePlayController');
var auth = require('../Middleware/CheckSession');

var router = express.Router();

router.use(function(req, res, next) {
   req.header('Content-Type', 'application/json');
   next();
});

router.get('/',homeController.showHome);
router.post('/login',upload.array(),homeController.login);
router.post('/signup',upload.array(),homeController.signup);
router.post('/changePassword',[upload.array(),auth.appAuth],homeController.changePassword);
router.post('/forgotPassword',upload.array(),homeController.forgotPassword);
router.get('/resetPassword/:token',homeController.showResetPassword);
router.post('/resetPassword',homeController.resetPassword);

router.get('/events',auth.appAuth,eventController.showEvents);
router.get('/upcoming-events',auth.appAuth,eventController.upcomingEvents);

router.get('/hints',auth.appAuth,eventController.showHints);

// router.get('/user_code',gameController.checkUserCode);

router.get('/assets/img/:folder/:image/:w?/:h?',homeController.imageProcess);


/** GAME ROUTES */
router.get('/game', auth.appAuth, gameController.getNewGame);
router.post('/game/:level/:id', auth.appAuth, gameController.updateResult);
/** END */

module.exports = router;
