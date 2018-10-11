var moment = require('moment');
var mysql = require('mysql');
var serialize = require('node-serialize');

var connection = require('./../../connect');
var events = require('./../../Models/Events');
const UniversalFunction = require('../../utils/universalFunctions');
const CONSTANTS = require('./../../const/constants');

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

   var sql = 'Select events.id,events.event_time,events.name as event_name,events.cash_prize,events.id,events.description from events order by events.id DESC limit ? , ?';

  connection.query(mysql.format(sql , [skip , limit]))
  .then((results) => {
      var winnersRequest = [], restaurants = [];

      results.forEach((event) => {
        winnersRequest.push(connection.query(mysql.format('Select cash_prize,winning_code,jumbled_code,position,user_id,name,image from winners left join users on users.id = winners.user_id where event_id = ?' , [event.id])));
      });
      // get winners data
      Promise.all(winnersRequest)
      .then((winnersResult) => {
        winnersResult.forEach((winners, index) => {
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
                var user_image = CONSTANTS.DATABASE.USER_IMAGE_PATH + data.image;
              }
              else{
                var user_image = '';
              }

              result.push({cash_prize : data.cash_prize + CONSTANTS.DATABASE.CURRENCY , position : data.position ,
                          winning_code : data.winning_code, jumbled_code : data.jumbled_code , is_available : is_available ,
                          user_name : user_name , user_image : user_image});
            }
          })
          let event = results[index];
          // get restuarants details
          restaurants.push(events.getResponse(event,result));
        });

        // get restaurants details
        Promise.all(restaurants)
        .then((finalResult) => {
          res.status(200).json(finalResult);
        })
        .catch((error) => {
          console.log(error);
        return UniversalFunction.sendError(res, error);
        });

      })
      .catch((error) => {
        console.log(error);
        return UniversalFunction.sendError(res, error);
      });
  })
  .catch((err) => {
    console.log(err);
    return UniversalFunction.sendError(res, err);
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

   var sql = 'Select events.id,events.event_time,events.name as event_name,events.cash_prize,events.id,events.description from events WHERE event_start_time > ? order by events.id DESC limit ? , ?';

  connection.query(mysql.format(sql , [dateTime, skip , limit]))
  .then((results) => {
    var winnersRequest = [], restaurants = [];

    results.forEach((event) => {
      winnersRequest.push(connection.query(mysql.format('Select cash_prize,winning_code,jumbled_code,position,user_id,name,image from winners left join users on users.id = winners.user_id where event_id = ?' , [event.id])));
    });
    // get winners data
    Promise.all(winnersRequest)
    .then((winnersResult) => {
      winnersResult.forEach((winners, index) => {
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
              var user_image = CONSTANTS.DATABASE.USER_IMAGE_PATH + data.image;
            }
            else{
              var user_image = '';
            }

            result.push({cash_prize : data.cash_prize + CONSTANTS.DATABASE.CURRENCY , position : data.position ,
                        winning_code : data.winning_code, jumbled_code : data.jumbled_code , is_available : is_available ,
                        user_name : user_name , user_image : user_image});
          }
        })
        let event = results[index];
        // get restuarants details
        restaurants.push(events.getResponse(event,result));
      });

      // get restaurants details
      Promise.all(restaurants)
      .then((finalResult) => {
        res.status(200).json(finalResult);
      })
      .catch((error) => {
        console.log(error);
      return UniversalFunction.sendError(res, error);
      });

    })
    .catch((error) => {
      console.log(error);
      return UniversalFunction.sendError(res, error);
    });
  })
  .catch((err) => {
    console.log(err);
    return UniversalFunction.sendError(res, err);
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
