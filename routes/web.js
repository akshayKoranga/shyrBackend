var express = require('express');
var multer = require('multer');
var mysql = require('mysql');
var upload = multer();

var homeController = require('../controller/WebHomeController');
var eventController = require('../controller/EventController');
const UniversalFunction = require('../utils/universalFunctions');
const CONSTANTS = require('../const/constants');
var connection = require('../connect');
let uploadS3 = require('../Middleware/storage.js')('shyr-cloud');


var router = express.Router();


// Authentication and Authorization Middleware
var auth = (req, res, next) => {
  // if(req.headers.authorization && req.session.email === 'admin@shayer.com' && req.session.admin){
  //   return next();
  // }
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    const token = req.headers.authorization.split(' ')[1];
    connection.query(mysql.format('Select * from admin where token = ?', [token]))
      .then((results) => {
        if (results.length > 0) {
          next();
        } else {
          UniversalFunction.sendError(res, CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN);
        }
      })
      .catch((err) => {
        console.log(err);
        UniversalFunction.sendError(res, err);
      });
  } else {
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

router.get('/restaurants', auth, eventController.getRestaurantList);
var Upload = uploadS3.fields([{ // define params for s3 upload  
  name: 'restaurant_logo'
}]);

router.post('/restaurants', auth, Upload, eventController.addRestaurant);

router.get('/restaurants/:id', auth,  eventController.getRestaurantDetails);

router.post('/restaurants/:id', auth, Upload, eventController.editRestaurant);

router.get('/events', auth, eventController.showEvents);

router.get('/delete_events', auth, eventController.deleteEvents);

router.post('/add_events', auth, eventController.addEvent);

router.get('/events/:id', auth, eventController.showEditEvent);

router.post('/edit_events/:id', auth, eventController.updateEvent);

router.get('/event_desc/:id', auth, eventController.showEvents);

router.get('/get_restaurants_by_event/:event_id', auth, eventController.getEventsRestaurant);

router.post('/change_password', auth, homeController.changepassword);

var Upload = uploadS3.fields([{ // define params for s3 upload  
  name: 'invoice_image'
}]);
router.post('/add_invoice', auth, Upload, eventController.addInvoice);


router.get('/logout', auth, homeController.logout);

//export the router to be used in app.js file
module.exports = router;