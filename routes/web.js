var express = require('express');
var multer  = require('multer');
var upload = multer();

var homeController = require('../controller/WebHomeController');
var eventController = require('../controller/EventController');
const UniversalFunction = require('../utils/universalFunctions');
const CONSTANTS = require('../const/constants');

var router = express.Router();


// Authentication and Authorization Middleware
var auth = (req, res, next) => {
  if(req.session && req.session.email === 'admin@shayer.com' && req.session.admin){
    return next();
  }
  else{
    UniversalFunction.sendError(res, CONSTANTS.STATUS_MSG.ERROR.UNAUTHORIZED_ACCESS);
  }
}


//router.get('/login',homeController.login);

/**
 * @param email
 * @param password
 */
router.post('/login', homeController.postLogin);

router.get('/dashboard', auth, homeController.showDashboard);

router.get('/events', auth, eventController.showEvents);

router.get('/delete_events',auth,eventController.deleteEvents);

router.post('/add_events',[auth,upload.array()],eventController.addEvents);

router.get('/events/:id',auth,eventController.showEditEvent);

router.post('/edit_events/:id',[auth,upload.array()],eventController.editEvent);

router.get('/event_desc/:id',auth,eventController.eventDesc);

router.get('/restaurants',auth,eventController.getRestaurantList);

router.get('/change_password',auth,homeController.showChangepassword);

router.post('/change_password',[auth,upload.array()],homeController.changepassword);

router.get('/logout',homeController.logout);

//export the router to be used in app.js file
module.exports = router;
