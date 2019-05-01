var mysql = require('mysql');
var connection = require('./../connect');

const UniversalFunction = require('../utils/universalFunctions');
const CONSTANTS = require('../const/constants');



var appAuth = (req, res, next) => {

  var session_id = req.body.session_id;
  if (!session_id) {
    session_id = req.query.session_id;
  }
  if (!session_id) {
    req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'
    let token = req.headers.authorization.split(' ')[1];
    session_id = token;
  }

  if (!session_id) {
    var error = {};
    error.error = 'unauthorized';
    error.error_description = 'Unauthorized request.';
    res.status(401).json(error);
  } else {
    connection.query(mysql.format('Select * from app_login where session_id = ?', [session_id]))
      .then((results) => {
        if (results.length < 1) {
          var error = {};
          error.error = 'forbidden';
          error.error_description = 'Your session has been expired.';
          res.status(403).json(error);
        } else {
          req.user_id = results[0].user_id;
          next();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // next();
}



//------------- admin auth ----------------------


// Authentication and Authorization Middleware
var adminAuth = (req, res, next) => {
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
          // --------- check user session --------------
          var session_id = token;
          //console.log(session_id);process.exit()
          if (!session_id) {
            var error = {};
            error.error = 'unauthorized';
            error.error_description = 'Unauthorized request.';
            res.status(401).json(error);
          } else {
            connection.query(mysql.format('Select * from app_login where session_id = ?', [session_id]))
              .then((results) => {
                if (results.length < 1) {
                  var error = {};
                  error.error = 'forbidden';
                  error.error_description = 'Your session has been expired.';
                  res.status(403).json(error);
                } else {
                  req.user_id = results[0].user_id;
                  next();
                }
              })
              .catch((err) => {
                UniversalFunction.sendError(res, CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN);
                console.log('yess ser',err);
              });
          }
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


module.exports = {
  appAuth,
  adminAuth
}



/**
 * get_user_record   --- brands
 * add invoice
 */