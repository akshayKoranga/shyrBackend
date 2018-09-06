const {check ,validationResult} = require('express-validator/check'); //validator
const {matchedData} = require('express-validator/filter'); //sanitizer
var md5 = require('md5');
var mysql = require('mysql');

var connection = require('../connect');
const UniversalFunction = require('../utils/universalFunctions');
const CONSTANTS = require('../const/constants');

/*
var login = (req , res) => {
res.render('login', {errors : {}}, (err, html) =>{
  if(err){
    console.log(err);
  }
  else{
    res.send(html);
  }
});
}
*/

/**
 * @description handler for admin login
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
var postLogin = (req , res , next) => {
     req.assert('email','Email is required').notEmpty();
     req.assert('password','Password is required').notEmpty();
     var errors = req.validationErrors();
     if(errors){
       console.log(errors);
      UniversalFunction.sendError(res, errors);
     }
     else{
      var email = req.body.email;
      var password = req.body.password;
      connection.query(mysql.format('Select * from admin where email = ?' , [email]))
      .then((results) => {
        if(results.length > 0){
          if(results[0].password == password){
            req.session.email = email;
            req.session.admin = true;
            UniversalFunction.sendSuccess(res, CONSTANTS.STATUS_MSG.SUCCESS.LOGIN_SUCCESS);
          }
          else{
            UniversalFunction.sendError(res, CONSTANTS.STATUS_MSG.ERROR.INCORRECT_PASSWORD);
          }
        }
        else{
          UniversalFunction.sendError(res, CONSTANTS.STATUS_MSG.ERROR.INVALID_CREDENTIALS);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    }
  };

/**
 * @description get dashboard data
 * @param {*} req 
 * @param {*} res 
 */
var showDashboard = (req, res) => {
  connection.query('Select COUNT(*) as count from events')
  .then((results) => {
    UniversalFunction.sendSuccess(res, {eventCount : results[0]['count']});
    //res.render('dashboard', {count : results[0]['count']});
  })
  .catch((err) => {
    console.log(err);
    UniversalFunction.sendError(res, err);
  })
}

var showChangepassword = (req, res) => {
  var error = {};
  var success = {};
  res.render('change_password' , {errors : error , success : success});
}

var changepassword = (req, res) => {
var new_password = req.body.new_password;
var old_password = req.body.password;
var confirm_password = req.body.confirm_password;

connection.query(mysql.format("Select * from admin where email = 'admin@shayer.com' and password = ?" , [old_password]))
.then((results) => {
  var error = {};
  var success = {};
  if(results.length >= 1){
    if(new_password !== confirm_password){
      error.msg = 'Both passwords should be same';
      res.render('change_password',{errors : error , success : success});
    }
    else{
      connection.query(mysql.format("Update admin set password = ? where email = 'admin@shayer.com'" , [new_password]))
      .then((results) => {
        success.msg = 'Password changed successfully';
        res.render('change_password', {success : success , errors : error});
      })
      .catch((err) => {
        console.log(err);
      })
    }
  }
  else{
    error.msg = 'Incorrect password';
    res.render('change_password', {errors : error , success: success});
  }
})
.catch((err) => {
  console.log(err);
});
}

var logout = (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
}

module.exports = {
  showDashboard,
  showChangepassword,
  postLogin,
  logout,
  changepassword
};
