var mysql = require('mysql');
var connection = require('./../connect');

var appAuth = (req, res , next) => {
  var session_id = req.body.session_id;
  if(!session_id){
    session_id = req.query.session_id;
  }

  if(!session_id){
    var error = {};
    error.error = 'unauthorized';
    error.error_description = 'Unauthorized request.';
    res.status(401).json(error);
  }
  else{
  connection.query(mysql.format('Select * from app_login where session_id = ?', [session_id]))
  .then((results) => {
    if(results.length < 1){
      var error = {};
      error.error = 'forbidden';
      error.error_description = 'Your session has been expired.';
      res.status(403).json(error);
    }
    else{
      next();
    }
  })
  .catch((err) => {
    console.log(err);
  });
}
  // next();
}


module.exports = {
  appAuth
}
