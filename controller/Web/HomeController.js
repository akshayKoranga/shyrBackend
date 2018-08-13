const {check ,validationResult} = require('express-validator/check'); //validator
const {matchedData} = require('express-validator/filter'); //sanitizer

var connection = require('../connect');

var login = (req , res) => {
res.render('login' , {
  data : {},
  errors : {}
});
}

var postLogin = [
  check('email')
  .isEmail()
  .trim()
  .withMessage('The email doesnt look right!'),
  check('password')
  .isLength({ min :1 })
  .trim()
  .withMessage('Please enter the password'),

  //process request after validation and sanitization
  (req , res , next) => {
    //extract the validation errors from the request
    const err = validationResult(req);
    if(!err.isEmpty()){
      res.render('login',{
        data : req.body,
        errors : err.array()
      });
    return;
    }
    else{
      var email = req.body.email;
      var password = req.body.password;
      connection.query('SELECT * from admin where email = ?' , [email] , (error, results, fields) => {
        if(error) {
          res.send({
            code : 400,
            message : 'error ocurred'
          });
        }
        else{
         if(results.length > 0){
           if([0].password == password){
             res.send({
               code : 200,
               message : 'login sucessfull'
                 });
           }
           else{
             res.send({
              code : 204,
              message : 'Email and password doest not match'
             });
           }
         }
         else{
           res.send({
             code : 204,
             message : 'Email doesnt exist'
           });
         }
        }
      })
    }
  }
];

var showDashboard = (req, res) => {
res.render('dashboard');
}

var showEvents = (req, res) => {
res.render('events');
}

var showAddEvents = (req, res) => {
  res.render('add_events');
}

var showChangepassword = (req, res) => {
  res.render('change_password');
}

module.exports = {
  login,
  showDashboard,
  showEvents,
  showAddEvents,
  showChangepassword,
  postLogin
};
