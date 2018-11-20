var moment = require('moment');
var Moment = require('moment-timezone');

var mysql = require('mysql');
var serialize = require('node-serialize');

var connection = require('./../../connect');
var events = require('./../../Models/Events');
const UniversalFunction = require('../../utils/universalFunctions');
const CONSTANTS = require('./../../const/constants');
const constants = require('./../../const/const');


var showEvents = (req, res) => {
  var timezone = req.query.timezone ? req.query.timezone : '';

  if (timezone == '') {
    let statusCode = new constants.response().BAD_REQUEST;
    return res.json(constants.response.sendFailure('INVALID_EVENT_ID', req.params.lang, statusCode));
  }
  if (req.query.limit) {
    var limit = parseInt(req.query.limit, 10);
  } else {
    var limit = 50;
  }

  if (req.query.page) {
    var page = req.query.page;
  } else {
    var page = 1;
  }

  var skip = (page - 1) * limit;
  var date = Moment().tz(timezone).format('YYYY-MM-DD HH:mm:00');

  var dateTime = new Date();
  dateTime = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");

  var sql = 'Select events.name as event_name,events.id,events.event_start_time,events.event_end_time,events.description,events.total_prizes from events order by events.id DESC limit ? , ?';

  connection.query(mysql.format(sql, [skip, limit]))
    .then(async (results) => {
      var restaurants = [],
        cash_prizes = [];
      // TODO: remove default value of is_available, and update it according to availability of cash prize
      results.forEach((event) => {
        cash_prizes.push(connection.query(mysql.format('Select id, cash_prize, num_winners, sort_order, 1 as is_available from cash_prize where event_id = ?', [event.id])));
        restaurants.push(events.getResponse(event));
      });

      // get restaurants data
      let event_with_restaurants = await Promise.all(restaurants);
      // get all cash prizes
      let cashPrizeResult = await Promise.all(cash_prizes);

      event_with_restaurants.forEach((event, index) => {
        event.cash_prize = cashPrizeResult[index];
      });
      return res.json(constants.response.sendSuccess('DEFAULT_SUCCESS_MESSAGE', event_with_restaurants, req.params.lang));
      // res.status(200).json(event_with_restaurants);
    })
    .catch((err) => {
      console.log(err);
      let statusCode = new constants.response().SERVER_ERROR;
      return res.json(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode))
      // return UniversalFunction.sendError(res, err);
    });
}

var upcomingEvents = (req, res) => {
  var timezone = req.query.timezone ? req.query.timezone : '';
  console.log(timezone, 'upcomingEvents')
  if (timezone == '') {
    let statusCode = new constants.response().BAD_REQUEST;
    return res.json(constants.response.sendFailure('INVALID_EVENT_ID', req.params.lang, statusCode));
  }
  if (req.query.limit) {
    var limit = parseInt(req.query.limit, 10);
  } else {
    var limit = 50;
  }
  var timeZoneArray = timezone.split(' ')
  if (req.query.page) {
    var page = req.query.page;
  } else {
    var page = 1;
  }

  var skip = (page - 1) * limit;
  moment.tz.setDefault('Asia/Kuwait');

  var dateTime = new Date();

  var date = Moment().tz(timeZoneArray[0]).format('YYYY-MM-DD HH:mm:00')
  console.log(date, 'we got date')
  dateTime = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");

  var sql = 'Select events.name as event_name,events.id,events.event_start_time,events.event_end_time,events.description,events.total_prizes from events WHERE event_start_time > ? order by events.id DESC limit ? , ?';

  connection.query(mysql.format(sql, [date, skip, limit]))
    .then(async (results) => {
      var restaurants = [],
        cash_prizes = [];
      // TODO: remove default value of is_available, and update it according to availability of cash prize
      results.forEach((event) => {
        cash_prizes.push(connection.query(mysql.format('Select id, cash_prize, num_winners, sort_order, 1 as is_available from cash_prize where event_id = ?', [event.id])));
        restaurants.push(events.getResponse(event));
      });

      // get restaurants data
      let event_with_restaurants = await Promise.all(restaurants);
      // get all cash prizes
      let cashPrizeResult = await Promise.all(cash_prizes);

      event_with_restaurants.forEach((event, index) => {
        event.cash_prize = cashPrizeResult[index];
      });

      return res.json(constants.response.sendSuccess('DEFAULT_SUCCESS_MESSAGE', event_with_restaurants, req.params.lang));

    })
    .catch((err) => {
      console.log('err', err);
      let statusCode = new constants.response().SERVER_ERROR;
      return res.json(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode));
    });
}


var ongoingEvents = (req, res) => {
  var timezone = req.query.timezone ? req.query.timezone : '';
  console.log(timezone, 'ongoingEvents')

  if (timezone == '') {
    let statusCode = new constants.response().BAD_REQUEST;
    return res.json(constants.response.sendFailure('INVALID_EVENT_ID', req.params.lang, statusCode));
  }
  if (req.query.limit) {
    var limit = parseInt(req.query.limit, 10);
  } else {
    var limit = 50;
  }

  if (req.query.page) {
    var page = req.query.page;
  } else {
    var page = 1;
  }

  var skip = (page - 1) * limit;

  var dateTime = new Date();
  var date = Moment().tz(timezone).format('YYYY-MM-DD HH:mm:00');

  dateTime = moment(dateTime).format("YYYY-MM-DD HH:mm:ss");

  var sql = 'Select events.name as event_name,events.id,events.event_start_time,events.event_end_time,events.description,events.total_prizes from events WHERE event_start_time < ? AND event_end_time > ? order by events.id DESC limit ? , ?';

  var query = connection.query(mysql.format(sql, [date, date, skip, limit]))
    .then(async (results) => {
      console.log(query.sql)
      var restaurants = [],
        cash_prizes = [];
      // TODO: remove default value of is_available, and update it according to availability of cash prize
      results.forEach((event) => {
        cash_prizes.push(connection.query(mysql.format('Select id, cash_prize, num_winners, sort_order, 1 as is_available from cash_prize where event_id = ?', [event.id])));
        console.log(events.getResponse(event))
        restaurants.push(events.getResponse(event));
      });

      // get restaurants data
      let event_with_restaurants = await Promise.all(restaurants);
      // get all cash prizes
      let cashPrizeResult = await Promise.all(cash_prizes);

      event_with_restaurants.forEach((event, index) => {
        event.cash_prize = cashPrizeResult[index];
      });

      return res.json(constants.response.sendSuccess('DEFAULT_SUCCESS_MESSAGE', event_with_restaurants, req.params.lang));

    })
    .catch((err) => {
      console.log('err', err);
      let statusCode = new constants.response().SERVER_ERROR;
      return res.json(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode));
    });
}

var showHints = (req, res) => {
  connection.query('Select * from hints')
    .then((results) => {
      var response = [];
      for (var i = 0; i < results.length; i++) {
        response.push(hints.getResponse(results[i]));
      }
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
    });
}

let addBoosterPack = (req, res) => {

  var event_id = req.body.event_id ? req.body.event_id : '';
  var cash_prize_id = req.body.cash_prize_id ? req.body.cash_prize_id : '';
  var booster_time = req.body.booster_time ? req.body.booster_time : 0;
  var booster_attempt = req.body.booster_attempt ? req.body.booster_attempt : 0;
  if (event_id.trim() == '' || cash_prize_id.trim() == '') {
    let statusCode = new constants.response().PARAMETER_MISSING;
    return res.json(constants.response.sendFailure('MANDATORY_PARAMETER_MISSING', req.params.lang, statusCode));
  }
  // ----- get inserted booster pack ----- 
  connection.query(mysql.format("SELECT * FROM `booster_pack` WHERE user_id = ? AND event_id = ? AND cash_prize_id = ?", [req.user_id, event_id, cash_prize_id]))
    .then((getBooster) => {
      if (getBooster.length > 0) {
        getBooster[0].booster_pack_id
        connection.query(mysql.format("Update booster_pack set booster_time = ?, booster_attempt = ? where booster_pack_id = ?", [booster_time, booster_attempt, getBooster[0].booster_pack_id]))
          .then((updateBooster) => {
            connection.query(mysql.format("SELECT * FROM `booster_pack` WHERE booster_pack_id = ?", [getBooster[0].booster_pack_id]))
              .then((getBooster) => {
                return res.json(constants.response.sendSuccess('DEFAULT_SUCCESS_MESSAGE', getBooster, req.params.lang));
              })
              .catch((error) => {
                console.log(error, 'err')
                let statusCode = new constants.response().SERVER_ERROR;
                return res.json(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode));
              });
          })
          .catch((err) => {
            console.log(err);
            return UniversalFunction.sendError(res, err);
          });
      } else {

        // --- add booster pack ------
        let insertBoosterPack = {
          event_id: event_id,
          user_id: req.user_id,
          cash_prize_id: cash_prize_id,
          booster_time: booster_time,
          booster_attempt: booster_attempt,
        }
        connection.query(mysql.format("Insert into booster_pack SET ?", [insertBoosterPack]))
          .then((addBoosterPack) => {
            // let booster_pack_id = addBoosterPack.insertId;
            // ----- get inserted booster pack ----- 
            connection.query(mysql.format("SELECT * FROM `booster_pack` WHERE booster_pack_id = ?", [addBoosterPack.insertId]))
              .then((getBooster) => {
                return res.json(constants.response.sendSuccess('DEFAULT_SUCCESS_MESSAGE', getBooster, req.params.lang));
              })
              .catch((error) => {
                console.log(error, 'err')
                let statusCode = new constants.response().SERVER_ERROR;
                return res.json(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode));
              });
          })
          .catch((error) => {
            console.log(error, 'err')
            let statusCode = new constants.response().SERVER_ERROR;
            return res.json(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode));
          });
      }
    })

    .catch((error) => {
      console.log(error, 'err')
      let statusCode = new constants.response().SERVER_ERROR;
      return res.json(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode));
    });

}

module.exports = {
  showEvents,
  upcomingEvents,
  showHints,
  ongoingEvents,
  addBoosterPack
};