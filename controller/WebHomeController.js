const {check ,validationResult} = require('express-validator/check'); //validator
const {matchedData} = require('express-validator/filter'); //sanitizer
var md5 = require('md5');
var mysql = require('mysql');
const randomString = require('random-string');

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

const getAccessToken = () => {
  return new Promise((resolve, reject) => {
    const token = randomString({length: 50});
    connection.query(mysql.format("Update admin set token = ? where email = 'admin@shayer.com'" , [token]))
    .then((results) => {
      resolve(token);
    })
    .catch((err) => {
      console.log(err);
      reject('Failed to generate token');
    });
  });
}

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
            // req.session.email = email;
            // req.session.admin = true;
            getAccessToken()
            .then((token) => {
              return UniversalFunction.sendSuccess(res, {token: token});
            })
            .catch((error) => {
              return UniversalFunction.sendError(res, error);
            });
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

/*
var showChangepassword = (req, res) => {
  var error = {};
  var success = {};
  res.render('change_password' , {errors : error , success : success});
}
*/

/**
 * @description Change admin password
 * @param {*} req 
 * @param {*} res 
 */
var changepassword = (req, res) => {
  var old_password = req.body.password;
  
  var new_password = req.body.new_password;
  var confirm_password = req.body.confirm_password;

  connection.query(mysql.format("Select * from admin where email = 'admin@shayer.com' and password = ?" , [old_password]))
  .then((results) => {
    
    if(results.length >= 1){
      if(new_password !== confirm_password) {
        return UniversalFunction.sendError(res, CONSTANTS.STATUS_MSG.ERROR.PASSWORD_MISMATCH);
      }
      else{
        connection.query(mysql.format("Update admin set password = ? where email = 'admin@shayer.com'" , [new_password]))
        .then((results) => {
          return UniversalFunction.sendSuccess(res, CONSTANTS.STATUS_MSG.SUCCESS.PASSWORD_UPDATED);
        })
        .catch((err) => {
          console.log(err);
          return UniversalFunction.sendError(res, err);
        })
      }
    }
    else{
      return UniversalFunction.sendError(res, CONSTANTS.STATUS_MSG.ERROR.INCORRECT_PASSWORD);
    }
  })
  .catch((err) => {
    console.log(err);
    return UniversalFunction.sendError(res, err);
  });
}

/**
 * @description Logout admin
 * @param {*} req 
 * @param {*} res 
 */
var logout = (req, res) => {
  //req.session.destroy();
  connection.query(mysql.format("Update admin set token = ? where email = 'admin@shayer.com'" , [null]))
  .then((results) => {
    return UniversalFunction.sendSuccess(res, CONSTANTS.STATUS_MSG.SUCCESS.LOGOUT_SUCCESS);
  })
  .catch((err) => {
    console.log(err);
    return UniversalFunction.sendError(res, err);
  });
  // res.redirect('/admin/login');
}

module.exports = {
  showDashboard,
  postLogin,
  logout,
  changepassword
};
