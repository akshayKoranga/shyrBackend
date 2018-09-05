//User model
var connection = require('../connect');
var mysql = require('mysql');
var randomString = require('randomstring');

const CONSTANTS = require('./../const/constants');

var appLogin = (req, userId) => {
    var device_token = req.body.device_token;
    var device_id = req.body.device_id;
    var device_type = req.body.device_type;
    //var session_id = req.session;
    // req.session.secret = randomString.generate(32);
    // var session_id = randomString.generate(32);
     var session_id = req.session.id;

connection.query("Insert into app_login(user_id,session_id,device_id,device_type,device_token) values('"+userId+"','"+session_id+"','"+device_id+"','"+device_type+"','"+device_token+"')")
.then((results) => {
   return;
} , (error) => {
      res.send(JSON.stringify({
          status : 500,
          error : error,
          response : null
      }));
})
}

var getId = (session_id ,callback) => {
var user_id;
connection.query(mysql.format('Select * from app_login where session_id = ?', [session_id]))
.then((results) => {
  results.forEach((data) => {
    user_id = data.user_id;
  })
   callback(user_id);
})
.catch((err) => {
   console.log(err);
});
}

var getResponse = (req, user) => {
   var user_profile = {};
   var profile = {};
   user_profile.session_id = req.session.id;
   for (var i = 0;i < user.length; i++) {
      profile.user_id = user[i].id;
      profile.name = user[i].name;
      profile.email = user[i].email;
      profile.image = CONSTANTS.DATABASE.USER_IMAGE_PATH + user[i].image;
      profile.phone_number = user[i].phone_number;
      profile.gender = user[i].gender;
   }
   user_profile.profile = profile;
   return user_profile;
}

var validateInput = (req) => {
  req.assert('name', 'Name field is required').notEmpty();
  req.assert('email', 'Email field is required').notEmpty().isEmail().withMessage('A valid email is required.');
  req.assert('password', 'Password field is required').notEmpty();
  req.assert('phone', 'Phone number field is required').notEmpty();
  req.assert('gender', 'Gender field is required').notEmpty();
  req.assert('device_type', 'Device Type field is required').notEmpty();
  return req.validationErrors();
}

module.exports = {
   appLogin,
   getResponse,
   getId,
   validateInput
};
