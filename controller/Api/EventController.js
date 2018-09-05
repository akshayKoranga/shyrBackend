var moment = require('moment');
var mysql = require('mysql');
var serialize = require('node-serialize');

var connection = require('./../../connect');
var events = require('./../../Models/Events');
var constants = require('./../../lib/constants');

var showEvents = (req, res) => {
  if(req.query.limit){
    var limit = parseInt(req.query.limit, 10);
  }
  else{
    var limit = 50;
  }

  if(req.query.page){
    var page = req.query.page;
  }
  else{
    var page = 1;
  }

  var skip = (page - 1) * limit;

  var dateTime = new Date();
  dateTime = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");

   var sql = 'Select events.id,events.event_time,events.name as event_name,events.cash_prize,events.id,events.winning_code,events.description,events.restaurant_id from events order by events.id DESC limit ? , ?';

  connection.query(mysql.format(sql , [skip , limit]))
  .then((results) => {
    var response = [];
      var final;
      results.forEach((event) => {
      connection.query(mysql.format('Select cash_prize,winning_code,jumbled_code,position,user_id,name,image from winners left join users on users.id = winners.user_id where event_id = ?' , [event.id]))
      .then((winners) => {
        var result = [];
        winners.forEach((data) => {
          if(data){
            if(data.user_id){
              var is_available = 0;
            }
            else{
              var is_available = 1;
            }
            if(data.name){
              var user_name = data.name;
            }
            else{
              var user_name = '';
            }
            if(data.image){
              var user_image = constants.USER_IMAGE_PATH + data.image;
            }
            else{
              var user_image = '';
            }

            result.push({cash_prize : data.cash_prize + constants.CURRENCY , position : data.position ,
                         winning_code : data.winning_code, jumbled_code : data.jumbled_code , is_available : is_available ,
                         user_name : user_name , user_image : user_image});
          }
        })
      final = events.getResponse(event,result);
      response.push(final);

      })
      .catch((err) => {
        console.log(err);
      });
    })
    setTimeout( () => {
      res.status(200).json(response);
    }, 100);

  })
  .catch((err) => {
    console.log(err);
  });
}

var upcomingEvents = (req, res) => {
  if(req.query.limit){
    var limit = parseInt(req.query.limit, 10);
  }
  else{
    var limit = 50;
  }

  if(req.query.page){
    var page = req.query.page;
  }
  else{
    var page = 1;
  }

  var skip = (page - 1) * limit;

  var dateTime = new Date();
  dateTime = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");

   var sql = 'Select events.id,events.event_time,events.name as event_name,events.cash_prize,events.id,events.winning_code,events.description,events.restaurant_id from events WHERE event_statrt_time > ? order by events.id DESC limit ? , ?';

  connection.query(mysql.format(sql , [dateTime, skip , limit]))
  .then((results) => {
    var response = [];
      var final;
      results.forEach((event) => {
      connection.query(mysql.format('Select cash_prize,winning_code,jumbled_code,position,user_id,name,image from winners left join users on users.id = winners.user_id where event_id = ?' , [event.id]))
      .then((winners) => {
        var result = [];
        winners.forEach((data) => {
          if(data){
            if(data.user_id){
              var is_available = 0;
            }
            else{
              var is_available = 1;
            }
            if(data.name){
              var user_name = data.name;
            }
            else{
              var user_name = '';
            }
            if(data.image){
              var user_image = constants.USER_IMAGE_PATH + data.image;
            }
            else{
              var user_image = '';
            }

            result.push({cash_prize : data.cash_prize + constants.CURRENCY , position : data.position ,
                         winning_code : data.winning_code, jumbled_code : data.jumbled_code , is_available : is_available ,
                         user_name : user_name , user_image : user_image});
          }
        })
      final = events.getResponse(event,result);
      response.push(final);

      })
      .catch((err) => {
        console.log(err);
      });
    })
    setTimeout( () => {
      res.status(200).json(response);
    }, 100);

  })
  .catch((err) => {
    console.log(err);
  });
}

var showHints = (req,res) => {
  connection.query('Select * from hints')
  .then((results) => {
    var response = [];
    for(var i = 0; i < results.length ; i++){
      response.push(hints.getResponse(results[i]));
    }
    res.status(200).json(response);
  })
  .catch((err) => {
    console.log(err);
  });
}

module.exports = {
  showEvents,
  upcomingEvents,
  showHints
};
