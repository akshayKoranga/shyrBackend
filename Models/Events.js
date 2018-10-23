var mysql = require('mysql');
var connection = require('../connect');

const CONSTANTS = require('./../const/constants');

var getResponse = (event) => {
  return new Promise((resolve, reject) => {
    //var event = {};
    //event.id = events.id;
    //event.name = events.event_name;
    //event.cash_prize = events.cash_prize + CONSTANTS.DATABASE.CURRENCY;
    //event.description = events.description;
    //event.game_play_time = events.event_time ? events.event_time*1000 : 0;
    //event.winners = result;

    connection.query(mysql.format('Select restaurant.name,restaurant.logo from restaurant left join events_restaurant on restaurant.id = events_restaurant.restaurant_id where event_id = ? limit 3' , [event.id]))
    .then((results) => {
      var rest_data = [];
      results.forEach((rest) => {
        if(rest){
          rest_data.push({name : rest.name , logo : CONSTANTS.DATABASE.RESTAURANT_IMAGE_PATH + rest.logo});
        }
      })
      event.restaurant = rest_data;
      resolve(event);
    })
  });
}

var getTestResponse = (events,result,sockets) => {
  var event = {};
  event.id = events.id;
  event.name = events.event_name;
  event.cash_prize = events.cash_prize + CONSTANTS.DATABASE.CURRENCY;
  event.jumbled_code = '32323';
  event.description =sockets.toString();
  event.winners = result;
  // event.socket = sockets.toString();

  connection.query(mysql.format('Select restaurant.name,restaurant.logo from restaurant left join events_restaurant on restaurant.id = events_restaurant.restaurant_id where event_id = ? limit 3' , [events.id]))
  .then((results) => {
    var rest_data = [];
    results.forEach((rest) => {
      if(rest){
        rest_data.push({name : rest.name , logo : CONSTANTS.DATABASE.RESTAURANT_IMAGE_PATH + rest.logo});
      }
    })
    event.restaurant = rest_data;
  });

  return event;
}

module.exports = {
  getResponse,
  getTestResponse
}
