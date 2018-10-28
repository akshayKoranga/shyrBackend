var mysql = require('mysql');
var md5 = require('md5');
var randomString = require('randomstring');
var fs = require('fs');
var gm = require('gm');
var request = require('request');
// var jimp = require("jimp");
// var sharp = require('sharp');

var connection = require('./../../connect');
var users = require('./../../Models/Users');
var sendMail = require('./../../utils/send_mail');

var deleteTokens = (email) => {
  connection.query(mysql.format('Select * from users where email = ?' , [email]))
  .then((results) => {
    connection.query(mysql.format('Delete from token where user_id = ?' ,[results[0].id]))
    .then((results) => {
      return;
    })
  })
  .catch((err) => {
    console.log(err);
  });
  return;
}

var showHome = (req, res) => {
  res.render('api' , (err, html) => {
    if(err){
      console.log(err);
      return;
    }
    res.send(html);
  });
}

var signup = (req, res) => {

    var errors = users.validateInput(req);
    if(errors){
      var msg = {};
      msg.error = "bad request";
      errors.forEach((err) => {
        if(msg){
         msg.error_description = err.msg;
        }
      })
      res.status(400).json(msg);
      return ;
    } else{
  var name = req.body.name;
  var email = req.body.email;
  var password = md5(req.body.password);
  var phone_number = req.body.phone;
  var gender = req.body.gender;
 connection.query(mysql.format("Select * from users where email = ?" , [email]))
 .then((results) => {
   if(results.length >= 1){
     var msg = {};
     msg.error = "bad request";
     msg.error_description = "Email is already taken";
     res.status(400).json(msg);
     return ;
   }
   else{
     connection.query("Insert into users(name,email,password,phone_number,gender) values('"+name+"','"+email+"','"+password+"','"+phone_number+"','"+gender+"')")
     .then((results) => {
       var session_id = users.appLogin(req, results.insertId);
       return results;
     })
     .then((results) => {
       return connection.query(mysql.format("SELECT * FROM users WHERE id=?", [results.insertId]));
     })
     .then((results) => {
       var response = users.getResponse(req,results);
       res.status(200).json(response);
     })
     .catch((err) => {
       console.log(err);
     });
   }
 })
 .catch((err) => {
   console.log(err);
 });
}
}

var login = (req, res) => {
  console.log(req.body);
  req.checkBody('email', 'Email field is required').notEmpty().isEmail().withMessage('Invalid email address');
  req.checkBody('password', 'Password field is required').notEmpty();
  var errors = req.validationErrors();

  if(errors){
  var msg = {};
  msg.error = "bad request";
  errors.forEach((err) => {
    msg.error_description = err.msg;
  })
  res.status(400).json(msg);
  return ;
  }
  else{

var email = req.body.email;
var password = md5(req.body.password);
connection.query(mysql.format('Select * from users where email = ? and password = ? limit 1' , [email , password]))
.then((results) => {
  if(results.length < 1){
    var error = {}; 
    error.error = 'Bad request';
    error.error_description = 'Invalid email or password';
    res.status(400).json(error);
  }
  else{
  var user_id = results[0].id;
  var session_id = users.appLogin(req, user_id);
  var response = users.getResponse(req,results);
  res.status(200).json(response);
  }
})
.catch((err) => {
  console.log(err);
});
}
}

var changePassword = (req, res) => {
req.checkBody('old_password', 'Old Password field is required').notEmpty();
req.checkBody('new_password', 'New Password field is required').notEmpty();
errors = req.validationErrors();
if(errors){
var msg = {};
msg.error = "bad request";
errors.forEach((err) => {
  msg.error_description = err.msg;
})
res.status(400).json(msg);
return ;
}

else{
var old_password = md5(req.body.old_password);
var new_password = md5(req.body.new_password);

var session_id = req.body.session_id;
// var user_id = users.getId(req.body.session_id);

connection.query(mysql.format('Select * from app_login where session_id = ?', [session_id]))
.then((results) => {
  var user_id;
  results.forEach((data) => {
    user_id = data.user_id;
  })
  return user_id;
})
.then((user_id) => {
  console.log(user_id);
  connection.query(mysql.format('Select * from users where id = ? and password = ?' , [user_id, old_password]))
  .then((results) => {
    if(results.length >= 1){
      connection.query(mysql.format('Update users set password = ? where id = ?' , [new_password , user_id]))
      .then(() => {
        var success = {};
        success.message = 'Your password has been changed successfully';
        res.status(200).json(success);
      })
    }
    else{
      var error = {};
      error.error = 'bad request';
      error.error_description = 'Password incorrect';
      res.status(400).json(error);
    }
  });
})
.catch((err) => {
  console.log(err);
});
}
}

var forgotPassword = (req, res) => {

  req.checkBody('email', 'Email field is required').notEmpty().isEmail().withMessage('Invalid email address');
  var errors = req.validationErrors();
  if(errors){
  var msg = {};
  msg.error = "bad request";
  errors.forEach((err) => {
    msg.error_description = err.msg;
  })
  res.status(400).json(msg);
  return ;
  }
  else{
  var email = req.body.email;
  connection.query(mysql.format('Select * from users where email = ?' ,[email]))
  .then((results) => {
    if(results.length < 1){
      var msg = {};
      msg.error = "bad request";
      msg.error_description = "Email doesnt exist";
      res.status(400).json(msg);
      return ;
    }
    else{
      var userToken = deleteTokens(email);
      connection.query(mysql.format('Select * from users where email = ?', [email]))
      .then((results) => {
        var token = randomString.generate(10);
        connection.query("Insert into token(user_id,token) values('"+results[0].id+"' , '"+token+"')")
      .then((results) => {
        var recoveryLink = 'http://18.224.152.176:3000/api/resetPassword/' + token;
        var email = sendMail.sendEmail(req.body.email, recoveryLink);
        //connection.query(mysql.format('Delete from token where user_id = ?' , [results[0].id]))
        var success = {};
        success.message = 'Please check your email for link to reset your password.';
        res.status(200).json(success);
        });
        })
      .catch((err) => {
        console.log(err);
      });
    }
  });
}
}

var showResetPassword = (req, res) => {
  var token = req.params.token;
  res.render('reset_password' , {token : token});
}

var resetPassword = (req, res) => {
var new_password = req.body.new_password;
var confirm_password = req.body.confirm_password;
req.checkBody('confirm_password', 'passwords do not match').equals(new_password);
var errors = req.validationErrors();
if(errors){
var msg = {};
msg.error = "bad request";
errors.forEach((err) => {
  msg.error_description = err.msg;
})
res.status(400).json(msg);
return ;
}
else{
  var token = req.body.token;
  connection.query(mysql.format('Select * from token where token = ?' , [token]))
  .then((results) => {
    var password = md5(req.body.new_password);
    connection.query(mysql.format('Update users set password = ? where id = ?' , [password , results[0].user_id]))
    .then((results) => {
      var success = {};
      success.message = 'Your password has been reset';
      res.status(200).json(success);
    })
  })
  .catch((err) => {
    console.log(err);
  });
}
}

var imageProcess = (req, res ,next) => {
  var folder = req.params.folder;
  var image = req.params.image;
  var url = 'http://18.224.152.176:3000/public/assets/img/' + folder + '/' + image;
  if(req.params.w){
    var width = parseInt(req.params.w, 10);
  }
  else{
    var width = 500;
  }
  if(req.params.h){
    var height = parseInt(req.params.h, 10);
  }
  else{
    var height = 500;
  }

var input = '/home/ubuntu/shayer/public/assets/img/' + folder + '/' + image;
var output = '/home/ubuntu/shayer/public/assets/img/' + folder + 'new.png';

res.set('Content-Type', 'image/png');

gm(input)
  .resize(width,height)
    .stream(function (err, stdout, stderr) {
      stdout.pipe(res)
    });
  // sharp('./public/assets/img/user/default.png')
  //   .rotate()
  //   .resize(200)
  //   .toBuffer(function(err, outputBuffer) {
  //       if (err) {console.log(err)}
  //       var encodedBuffer = outputBuffer.toString('base64');
  //       res.send(encodedBuffer);
  //     });


  // jimp.read(url , (err ,image) => {
  //   if(err) { console.log(err) ;}
  //   image.resize(width, height).getBase64( jimp.AUTO , function(error,img64){
  //       if(error) {console.log(error);}
  //       var img = new Buffer(img64, 'base64');
  //       res.writeHead(200, {
  //        'Content-Type': 'image/png',
  //        'Content-Length': img64.length
  //       });
  //       res.end(img);
  //   });
  // });
}

module.exports = {
  showHome,
  login,
  signup,
  changePassword,
  forgotPassword,
  showResetPassword,
  resetPassword,
  imageProcess
};
