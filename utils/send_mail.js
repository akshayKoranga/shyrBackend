var nodemailer = require('nodemailer');

var sendEmail = (email, recoveryLink) => {
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'testaativa@gmail.com',
    pass: 'aativa123'
  }
});

var mailOptions = {
  from: 'testaativa@gmail.com',
  to: email,
  subject: 'Shayer',
  text: recoveryLink
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
}

module.exports = {
  sendEmail
}
