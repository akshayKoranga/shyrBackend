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

  var sql = 'Select events.name as event_name,events.id,events.event_start_time,events.event_end_time,events.description,events.total_prizes from events order by events.id DESC limit ? , ?';

  connection.query(mysql.format(sql , [skip , limit]))
  .then(async (results) => {
      var restaurants = [], cash_prizes = [];
      // TODO: remove default value of is_available, and update it according to availability of cash prize
      results.forEach((event) => {
        cash_prizes.push(connection.query(mysql.format('Select id, cash_prize, num_winners, sort_order, 1 as is_available from cash_prize where event_id = ?', [event.id])));
        restaurants.push(events.getResponse(event));
      });

      // get restaurants data
      let event_with_restaurants = await Promise.all(restaurants);
      // get all cash prizes
      let cashPrizeResult = await Promise.all(cash_prizes);

      event_with_restaurants.forEach( (event, index) => {
        event.cash_prize = cashPrizeResult[index];
      });

      res.status(200).json(event_with_restaurants);
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

   var sql = 'Select events.name as event_name,events.id,events.event_start_time,events.event_end_time,events.description,events.total_prizes from events WHERE event_start_time > ? order by events.id DESC limit ? , ?';

  connection.query(mysql.format(sql , [dateTime, skip , limit]))
  .then(async (results) => {
    var restaurants = [], cash_prizes = [];
      // TODO: remove default value of is_available, and update it according to availability of cash prize
      results.forEach((event) => {
        cash_prizes.push(connection.query(mysql.format('Select id, cash_prize, num_winners, sort_order, 1 as is_available from cash_prize where event_id = ?', [event.id])));
        restaurants.push(events.getResponse(event));
      });

      // get restaurants data
      let event_with_restaurants = await Promise.all(restaurants);
      // get all cash prizes
      let cashPrizeResult = await Promise.all(cash_prizes);

      event_with_restaurants.forEach( (event, index) => {
        event.cash_prize = cashPrizeResult[index];
      });

      res.status(200).json(event_with_restaurants);
    
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
