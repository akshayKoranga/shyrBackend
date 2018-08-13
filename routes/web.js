var express = require('express');
var multer  = require('multer');
var upload = multer();

var homeController = require('../controller/WebHomeController');
var eventController = require('../controller/EventController');

var router = express.Router();


// Authentication and Authorization Middleware
var auth = (req, res, next) => {
  if(req.session && req.session.email === 'admin@shayer.com' && req.session.admin){
    return next();
  }
  else{
   res.redirect('/admin/login');
  }
}


router.get('/login',homeController.login);

router.post('/login',upload.array(),homeController.postLogin);

router.get('/dashboard',auth,homeController.showDashboard);

router.get('/events',auth,eventController.showEvents);

router.get('/delete_events',auth,eventController.deleteEvents);

router.get('/add_events',auth,eventController.showAddEvents);

router.post('/add_events',[auth,upload.array()],eventController.addEvents);

router.get('/edit_events/:id',auth,eventController.showEditEvent);

router.post('/edit_events/:id',[auth,upload.array()],eventController.editEvent);

router.get('/event_desc/:id',auth,eventController.eventDesc);

router.get('/change_password',auth,homeController.showChangepassword);

router.post('/change_password',[auth,upload.array()],homeController.changepassword);

router.get('/logout',homeController.logout);

//export the router to be used in app.js file
module.exports = router;
