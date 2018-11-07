var moment = require('moment');
var mysql = require('mysql');
var serialize = require('node-serialize');

var connection = require('../connect');
const UniversalFunction = require('../utils/universalFunctions');
const CONSTANTS = require('../const/constants');


/**
 * @description get event list
 * @param {*} req 
 * @param {*} res 
 */
var showEvents = (req, res) => {
  connection.query('Select events.name as event_name,events.id,events.event_start_time,events.event_end_time,events.description,events.total_prizes from events')
    .then((results) => {
      UniversalFunction.sendSuccess(res, {
        events: results
      });
      //res.render('events', {events : results});
    })
    .catch((err) => {
      console.log(err);
      UniversalFunction.sendError(res, err);
    });
}

/**
 * @description returns list of restaurants
 * @param {*} req 
 * @param {*} res 
 */
var getRestaurantList = (req, res) => {
  connection.query('SELECT * from restaurant')
    .then((results) => {
      return UniversalFunction.sendSuccess(res, results);
      //res.render('add_events' , {companies : results});
    })
    .catch((err) => {
      console.log(err);
      return UniversalFunction.sendError(res, err);
    })
}

/**
 * @description add new restaurant
 * @param {*} req 
 * @param {*} res 
 */
const addRestaurant = (req, res) => {
  // console.log(req.files);process.exit()
  if (!req.files.restaurant_logo) {
    var image = '';
  } else {
    var image = req.files.restaurant_logo[0].key;
  }
  const resturant_name = req.body.name.trim();
  insertObj = {
    name: resturant_name,
    logo: image
  }
  // connection.query(mysql.format("Insert into gameplay SET ?", [insertGamePlay]))

  connection.query(mysql.format("Insert into restaurant SET ?", [insertObj]))
    .then((restaurant) => {
      var restaurant_id = restaurant.insertId;
      return UniversalFunction.sendSuccess(res, restaurant_id);
    })
    .catch((err) => {
      console.log(err);
      return UniversalFunction.sendError(res, err);
    });
};

/**
 * @description returns restaurant details
 * @param {*} req 
 * @param {*} res 
 */
var getRestaurantDetails = (req, res) => {
  const restaurant_id = req.params.id;
  connection.query(mysql.format('SELECT * from restaurant where id = ?', [restaurant_id]))
    .then((results) => {
      return UniversalFunction.sendSuccess(res, results);
      //res.render('add_events' , {companies : results});
    })
    .catch((err) => {
      console.log(err);
      return UniversalFunction.sendError(res, err);
    })
}

/**
 * @description add new restaurant
 * @param {*} req 
 * @param {*} res 
 */
const editRestaurant = (req, res) => {
  const restaurant_id = req.params.id;
  connection.query(mysql.format("Select * from restaurant where id = ?", [restaurant_id]))
    .then((restaurantdata) => {
      if (!req.files.restaurant_logo) {
        var image = restaurantdata[0].logo;
      } else {
        var image = req.files.restaurant_logo[0].key;
      }
      var resturant_name = req.body.resturant_name ? req.body.resturant_name : restaurantdata[0].name;


      // const updatedAt = moment(new Date(), 'MM/DD/YYYY HH:mm A').format('YYYY-MM-DD HH:mm:ss');
      connection.query(mysql.format("Update restaurant set name = ?, logo = ? where id = ?", [resturant_name, image, restaurant_id]))
        .then((restaurant) => {
          return UniversalFunction.sendSuccess(res, CONSTANTS.STATUS_MSG.SUCCESS.RESTAURANT_UPDATED);
        })
        .catch((err) => {
          console.log(err);
          return UniversalFunction.sendError(res, err);
        });
    })
    .catch((err) => {
      console.log(err);
      return UniversalFunction.sendError(res, err);
    });
};

/**
 * @description deletes event by id in query param
 * @param {*} req 
 * @param {*} res 
 */
var deleteEvents = (req, res) => {
  req.assert('event_id', 'Event id required').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    console.log(errors);
    return UniversalFunction.sendError(res, errors);
  }
  var event_id = req.query.event_id;
  connection.query(mysql.format('Select * from events where id = ?', [event_id]))
    .then((event) => {
      if (event.length === 0)
        return UniversalFunction.sendError(res, CONSTANTS.STATUS_MSG.ERROR.INVALID_EVENT_ID);
      connection.query(mysql.format('Delete from events where id = ?', [event_id]))
        .then((results) => {
          connection.query(mysql.format('Delete from cash_prize where event_id = ?', [event_id]))
            .then((results) => {
              connection.query(mysql.format('Delete from events_restaurant where event_id = ?', [event_id]))
                .then((results) => {
                  connection.query(mysql.format('Delete from event_game_rules where event_id = ?', [event_id]))
                    .then((result) => {
                      UniversalFunction.sendSuccess(res, CONSTANTS.STATUS_MSG.SUCCESS.EVENT_DELETED);
                    });
                })
            })
        });
    })
    .catch((err) => {
      console.log(err);
      UniversalFunction.sendError(res, err);
    });
}

/**
 * @description adds event - old handler
 * @param {*} req 
 * @param {*} res 
 */
var addEvents = (req, res) => {
  console.log(req.body);
  var event_name = req.body.event_name;
  // var restaurant = req.body.restaurant_name;
  var restaurant = req.body.restaurants; // an array of restaurant ids
  var description = req.body.description;
  var event_start_time = moment(req.body.event_start_time, 'MM/DD/YYYY HH:mm A').format('YYYY-MM-DD HH:mm:ss');
  var event_end_time = moment(req.body.event_end_time, 'MM/DD/YYYY HH:mm A').format('YYYY-MM-DD HH:mm:ss');
  var submission_start_time = moment(req.body.submission_start_time, 'MM/DD/YYYY HH:mm A').format('YYYY-MM-DD HH:mm:ss');
  var submission_end_time = moment(req.body.submission_end_time, 'MM/DD/YYYY HH:mm A').format('YYYY-MM-DD HH:mm:ss');
  var event_time = req.body.event_time ? req.body.event_time : 0;
  // var invoice_order_number = req.body.invoice_order_number;
  // var invoice_date = moment(req.body.invoice_date,'MM/DD/YYYY HH:mm A').format('YYYY-MM-DD HH:mm:ss');
  var cash_prize = req.body.cash_prize;
  var num_winners = req.body.num_winners;

  connection.query("Insert into events(name,description,cash_prize,event_start_time,event_end_time,submission_start_time,submission_end_time,num_winners,event_time) values('" + event_name + "','" + description + "','" + cash_prize + "','" + event_start_time + "','" + event_end_time + "','" + submission_start_time + "','" + submission_end_time + "','" + num_winners + "','" + event_time + "')")
    .then((events) => {
      var event_id = events.insertId;
      // var rest = JSON.parse("[" + restaurant + "]");
      for (var j = 0; j < restaurant.length; j++) {
        connection.query("Insert into events_restaurant(event_id,restaurant_id) values('" + event_id + "','" + restaurant[j] + "')")
      }

      for (var i = 1; i <= num_winners; i++) {
        var winner = 'winner' + i;
        var winning_code = 'winning_code' + i;
        var jumbled_code = 'jumbled_code' + i;

        var cash = req.body[winner] || 0;
        var code = req.body[winning_code];
        var j_code = req.body[jumbled_code];

        connection.query("Insert into winners(event_id,position,cash_prize,winning_code,jumbled_code) values('" + event_id + "','" + i + "','" + cash + "','" + code + "','" + j_code + "')")
      }
      return Promise.resolve(event_id);
    })
    .then((event_id) => {
      return UniversalFunction.sendSuccess(res, event_id);
      //showEvents(req,res);
    })
    .catch((err) => {
      console.log(err);
      UniversalFunction.sendError(res, err);
    });
}

/**
 * @description adds event
 * @param {*} req 
 * @param {*} res 
 */
const addEvent = async (req, res) => {
  try {
    console.log(`====== Add Event API ======`);
    console.log(req.body);
    let event = {
      name: req.body.name.trim(),
      description: req.body.description.trim(),
      event_start_time: moment(req.body.event_start_time, 'MM/DD/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss'),
      event_end_time: moment(req.body.event_end_time, 'MM/DD/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss'),
      submission_start_time: moment(req.body.submission_start_time, 'MM/DD/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss'),
      submission_end_time: moment(req.body.submission_end_time, 'MM/DD/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss'),
      total_prizes: req.body.cash_prize.length
    };

    let eventResult = await connection.query("Insert into events(name,description,event_start_time,event_end_time,submission_start_time,submission_end_time,total_prizes) values('" + event.name + "','" + event.description + "','" + event.event_start_time + "','" + event.event_end_time + "','" + event.submission_start_time + "','" + event.submission_end_time + "','" + event.total_prizes + "')");

    // insert event
    let event_id = eventResult.insertId; // now we have event id

    // now insert associated restaurants
    req.body.restaurants.forEach((rValue) => {
      let restaurant = {
        event_id: event_id,
        restaurant_id: rValue
      };
      // insert associated restaurant details
      connection.query("Insert into events_restaurant(event_id,restaurant_id) values('" + restaurant.event_id + "','" + restaurant.restaurant_id + "')");
    });

    // now insert cash prizes, corresponding to every prize, insert game rules too
    let cashPrizeArray = [];
    req.body.cash_prize.forEach((cValue, cIndex) => {
      let cash_prize = {
        event_id: event_id,
        cash_prize: cValue.cash_prize,
        num_winners: cValue.num_winners,
        sort_order: cIndex + 1
      };
      // insert the cash prize
      cashPrizeArray.push(connection.query("Insert into cash_prize(event_id,cash_prize,num_winners,sort_order) values('" + cash_prize.event_id + "','" + cash_prize.cash_prize + "','" + cash_prize.num_winners + "','" + cash_prize.sort_order + "')"));
    });

    let cashPrizeResult = await Promise.all(cashPrizeArray);

    let gamePlayArray = [];
    req.body.cash_prize.forEach((cValue, cIndex) => {
      // now we have the cash prize id
      let cash_prize_id = cashPrizeResult[cIndex].insertId;
      // now insert associated game rules for different levels
      cValue.game_rules.forEach((gValue, gIndex) => {
        let game_rule = {
          event_id: event_id,
          cash_prize_id: cash_prize_id,
          level: gValue.level,
          max_time_to_complete: gValue.max_time_to_complete,
          max_attempts: gValue.max_attempts,
          in_app_purchase: gValue.in_app_purchase || 0,
          max_attempts_buy: gValue.max_attempts_buy || 0,
          max_time_buy: gValue.max_time_buy || 0
        };
        // insert game rule for given event, cash prize 
        gamePlayArray.push(connection.query("Insert into event_game_rules(event_id, cash_prize_id, level, max_time_to_complete, max_attempts, in_app_purchase, max_attempts_buy, max_time_buy) values('" + game_rule.event_id + "','" + cash_prize_id + "','" + game_rule.level + "','" + game_rule.max_time_to_complete + "','" + game_rule.max_attempts + "','" + game_rule.in_app_purchase + "','" + game_rule.max_attempts_buy + "','" + game_rule.max_time_buy + "')"));
      });
    });

    let gameRuleResult = await Promise.all(gamePlayArray);

    UniversalFunction.sendSuccess(res, {
      event_id: event_id
    });
  } catch (error) {
    UniversalFunction.sendError(res, error);
  }
}

/**
 * @description Get event details
 * @param {*} req 
 * @param {*} res 
 * @param {*} err 
 */
var showEditEvent = (req, res, err) => {
  var error = {};
  var id = req.params.id;
  var company;
  connection.query(mysql.format('Select events.total_prizes, events.name as event_name, events.id, events.event_start_time, events.event_end_time, events.submission_start_time, events.submission_end_time, events.description from events where events.id = ?', [id]))
    .then((results) => {
      connection.query('Select restaurant.id, restaurant.name from restaurant')
        .then((restaurant) => {
          getWinners(req.params.id, (response) => {
            getRestaurants(req.params.id, async (rest_data) => {
              let cash_prize = await connection.query(mysql.format('Select id, cash_prize, num_winners, sort_order from cash_prize where event_id = ?', [id]));
              if (cash_prize && cash_prize.length > 0) {
                let game_rules = [];
                cash_prize.forEach((cValue, cIndex) => {
                  game_rules.push(connection.query(mysql.format('Select id, level, max_time_to_complete, max_attempts, in_app_purchase, max_attempts_buy, max_time_buy, is_active from event_game_rules where cash_prize_id = ?', [cValue.id])));
                });

                let game_rules_result = await Promise.all(game_rules);
                cash_prize.forEach((cValue, cIndex) => {
                  cValue['game_rules'] = game_rules_result[cIndex] || [];
                });
              } else {
                cash_prize = [];
              }
              return UniversalFunction.sendSuccess(res, {
                events: results[0],
                cash_prize: cash_prize,
                event_restaurants: rest_data,
                restaurants: restaurant
              });
              //  res.render('edit_events',{events : results, event_restaurants : rest_data ,
              //                            restaurants : restaurant,winners : response, errors :error});
            });
          });

        })
        .catch((err) => {
          console.log(err);
          return UniversalFunction.sendError(res, err);
        })
    })
    .catch((err) => {
      console.log(err);
      return UniversalFunction.sendError(res, err);
    });
}

/**
 * @description Edit event by id - deprecated
 * @param {*} req 
 * @param {*} res 
 */
var editEvent = (req, res) => {
  var event_id = req.params.id;
  var event_name = req.body.event_name;
  //var restaurant = req.body.restaurant_name;
  var restaurant = req.body.restaurants; // an array of restaurant ids
  var description = req.body.description;
  var event_start_time = moment(req.body.event_start_time, 'MM/DD/YYYY HH:mm A').format('YYYY-MM-DD HH:mm:ss');
  var event_end_time = moment(req.body.event_end_time, 'MM/DD/YYYY HH:mm A').format('YYYY-MM-DD HH:mm:ss');
  var submission_start_time = moment(req.body.submission_start_time, 'MM/DD/YYYY HH:mm A').format('YYYY-MM-DD HH:mm:ss');
  var submission_end_time = moment(req.body.submission_end_time, 'MM/DD/YYYY HH:mm A').format('YYYY-MM-DD HH:mm:ss');
  var cash_prize = req.body.cash_prize;
  var num_winners = req.body.num_winners;
  var event_time = req.body.event_time ? req.body.event_time : 0;

  var sql = "Update events set name = ? , description = ? , cash_prize = ? ,event_start_time = ? , event_end_time = ? , submission_start_time = ? , submission_end_time = ? , num_winners = ? ,event_time = ? where id = ?";
  var params = [event_name, description, cash_prize, event_start_time, event_end_time, submission_start_time, submission_end_time, num_winners, event_time, event_id];
  connection.query(mysql.format(sql, params))
    .then((events) => {
      connection.query(mysql.format("Delete from events_restaurant where event_id = ?", [event_id]));
      // var rest = JSON.parse("[" + restaurant + "]");

      if (restaurant.length >= 1) {
        for (var j = 0; j < restaurant.length; j++) {
          connection.query("Insert into events_restaurant(event_id,restaurant_id) values('" + event_id + "','" + restaurant[j] + "')");
        }
      }
      // else{
      //   connection.query("Insert into events_restaurant(event_id,restaurant_id) values('"+event_id+"','"+restaurant+"')");
      // }
      connection.query(mysql.format("Delete from winners where event_id = ?", [event_id]));
      for (var i = 1; i <= num_winners; i++) {
        var winner = 'winner' + i;
        var winning_code = 'winning_code' + i;
        var jumbled_code = 'jumbled_code' + i;

        var cash = req.body[winner] || 0;
        var code = req.body[winning_code];
        var j_code = req.body[jumbled_code];

        connection.query("Insert into winners(event_id,position,cash_prize,winning_code,jumbled_code) values('" + event_id + "','" + i + "','" + cash + "','" + code + "','" + j_code + "')")
      }
    })
    .then(() => {
      UniversalFunction.sendSuccess(res, CONSTANTS.STATUS_MSG.SUCCESS.EVENT_UPDATED);
    })
    .catch((err) => {
      console.log(err);
      UniversalFunction.sendError(res, err);
    });
}

/**
 * @description Edit event by id
 * @param {*} req 
 * @param {*} res 
 */
const updateEvent = async (req, res) => {
  try {
    console.log(`====== Update Event API ======`);
    console.log(req.body);
    let event = {
      id: req.body.id,
      name: req.body.event_name.trim(),
      description: req.body.description.trim(),
      event_start_time: moment(req.body.event_start_time, 'MM/DD/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss'),
      event_end_time: moment(req.body.event_end_time, 'MM/DD/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss'),
      submission_start_time: moment(req.body.submission_start_time, 'MM/DD/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss'),
      submission_end_time: moment(req.body.submission_end_time, 'MM/DD/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss'),
      total_prizes: req.body.cash_prize.length
    };

    let sql = "Update events set name = ?, description = ?, event_start_time = ?, event_end_time = ?, submission_start_time = ?,submission_end_time = ?, total_prizes = ? where id = ?";
    let params = [event.name, event.description, event.event_start_time, event.event_end_time, event.submission_start_time, event.submission_end_time, event.total_prizes, event.id];
    let eventResult = await connection.query(mysql.format(sql, params));

    // update event
    let event_id = event.id

    // delete already associated restaurants
    await connection.query(mysql.format("Delete from events_restaurant where event_id = ?", [event_id]));

    // now insert associated restaurants
    req.body.restaurants.forEach((rValue) => {
      let restaurant = {
        event_id: event_id,
        restaurant_id: rValue
      };
      // insert associated restaurant details
      connection.query("Insert into events_restaurant(event_id,restaurant_id) values('" + restaurant.event_id + "','" + restaurant.restaurant_id + "')");
    });

    // now update cash prizes, corresponding to every prize, update game rules too
    let cashPrizeArray = [];
    req.body.cash_prize.forEach((cValue, cIndex) => {
      let cash_prize = {
        id: cValue.id || -1,
        event_id: event_id,
        cash_prize: cValue.cash_prize,
        num_winners: cValue.num_winners,
        sort_order: cIndex + 1
      };
      if (cash_prize.id == -1) {
        // insert the cash prize
        cashPrizeArray.push(connection.query("Insert into cash_prize(event_id,cash_prize,num_winners,sort_order) values('" + cash_prize.event_id + "','" + cash_prize.cash_prize + "','" + cash_prize.num_winners + "','" + cash_prize.sort_order + "')"));
      } else {
        // update cash prize
        let sql = "Update cash_prize set cash_prize = ?, num_winners = ?, sort_order = ? where id = ?";
        let params = [cash_prize.cash_prize, cash_prize.num_winners, cash_prize.sort_order, cash_prize.id];

        cashPrizeArray.push(connection.query(mysql.format(sql, params)));
      }

    });

    let cashPrizeResult = await Promise.all(cashPrizeArray);

    let gamePlayArray = [];
    req.body.cash_prize.forEach((cValue, cIndex) => {
      // now we have the cash prize id
      let cash_prize_id = cValue.id || cashPrizeResult[cIndex].insertId;
      // now insert associated game rules for different levels
      cValue.game_rules.forEach((gValue, gIndex) => {
        let game_rule = {
          id: gValue.id || -1,
          event_id: event_id,
          cash_prize_id: cash_prize_id,
          level: gValue.level,
          max_time_to_complete: gValue.max_time_to_complete,
          max_attempts: gValue.max_attempts,
          in_app_purchase: gValue.in_app_purchase || 0,
          max_attempts_buy: gValue.max_attempts_buy || 0,
          max_time_buy: gValue.max_time_buy || 0
        };
        if (game_rule.id == -1) {
          // insert game rule for given event, cash prize 
          gamePlayArray.push(connection.query("Insert into event_game_rules(event_id, cash_prize_id, level, max_time_to_complete, max_attempts, in_app_purchase, max_attempts_buy, max_time_buy) values('" + game_rule.event_id + "','" + cash_prize_id + "','" + game_rule.level + "','" + game_rule.max_time_to_complete + "','" + game_rule.max_attempts + "','" + game_rule.in_app_purchase + "','" + game_rule.max_attempts_buy + "','" + game_rule.max_time_buy + "')"));
        } else {
          // update game rule
          let sql = "Update event_game_rules set level = ?, max_time_to_complete = ?, max_attempts = ?, in_app_purchase = ?, max_attempts_buy = ?, max_time_buy = ? where id = ?";
          let params = [game_rule.level, game_rule.max_time_to_complete, game_rule.max_attempts, game_rule.in_app_purchase, game_rule.max_attempts_buy, game_rule.max_time_buy, game_rule.id];
          gamePlayArray.push(connection.query(mysql.format(sql, params)));
        }
      });
    });

    let gameRuleResult = await Promise.all(gamePlayArray);

    UniversalFunction.sendSuccess(res, {
      event_id: event_id
    });
  } catch (error) {
    UniversalFunction.sendError(res, error);
  }
}

/**
 * @description Get event details of a specific event
 * @param {*} req 
 * @param {*} res 
 */
/*
var eventDesc = (req, res) => {
 var event_id = req.params.id;
 connection.query(mysql.format('Select events.id,events.name,events.description,events.event_start_time,events.event_end_time,events.submission_start_time,events.submission_end_time,events.num_winners,restaurant.name as rest_name,restaurant.logo,winners.position,winners.cash_prize,winners.winning_code,winners.jumbled_code from events left join events_restaurant on events_restaurant.event_id = events.id left join restaurant on restaurant.id = events_restaurant.restaurant_id left join winners on winners.event_id = events.id where events.id = ?',[event_id]))
 .then((results) => {
   var restaurants = [];
   results.forEach((data) => {
     restaurants.push({name : data.rest_name , id : data.id});
   });
   return UniversalFunction.sendSuccess(res, {events : results , restaurants : restaurants});
   //res.render('event_description',{events : results , restaurants : restaurants});
 })
 .catch((err) => {
   console.log(err);
   UniversalFunction.sendError(res, err);
 });

}
*/

var getWinners = (event_id, callback) => {
  connection.query(mysql.format('Select * from winners where event_id = ?', [event_id]))
    .then((results) => {
      callback(results);
    })
    .catch((err) => {
      console.log(err);
    });
}

/**
 * @description Get restaurants associated with an event
 * @param {*} event_id 
 * @param {*} callback 
 */
var getRestaurants = (event_id, callback) => {
  connection.query(mysql.format('Select * from events_restaurant where event_id = ?', [event_id]))
    .then((results) => {
      var data = [];
      results.forEach((result) => {
        data.push(result.restaurant_id);
      })
      callback(data);
    })
    .catch((err) => {
      console.log(err);
    });
}


const getEventsRestaurant = (req, res) => {
  try {
    //--------------- Define variable ----------
    let event_id = req.params.event_id ? req.params.event_id : '';
    // ---------- check mandatory param --------------
    if (event_id == '') {
      return UniversalFunction.sendError(res, 'Mandatory param missing');
    }
    connection.query(mysql.format("Select er.*, r.name, r.logo, e.name from events_restaurant as er left join restaurant as r on r.id =er.restaurant_id left join events as e on e.id =er.event_id where event_id = ?", [event_id]))
      .then((eventrestaurantdata) => {
        UniversalFunction.sendSuccess(res, eventrestaurantdata);
      })
      .catch((err) => {
        console.log(err);
        return UniversalFunction.sendError(res, err);
      });
  } catch (e) {
    console.log(e);
    UniversalFunction.sendError(res, e);

  }

};





const addInvoice = (req, res) => {
  req.assert('restaurant_id', 'Restaurant id is required').notEmpty();
  var errors = req.validationErrors();

  if (errors) {
    return UniversalFunction.sendError(res, errors);
  }
  var restaurant_id = req.body.restaurant_id ? req.body.restaurant_id : '';
  if (!req.files.invoice_image) {
    var image = '';
  } else {
    var image = req.files.invoice_image[0].key;
  }

  insertObj = {
    restaurant_id: restaurant_id,
    invoice_image: image
  }
  // connection.query(mysql.format("Insert into gameplay SET ?", [insertGamePlay]))

  connection.query(mysql.format("Insert into restaurant_invoice SET ?", [insertObj]))
    .then((restaurant) => {
      var restaurant_id = restaurant.insertId;
      return UniversalFunction.sendSuccess(res, restaurant_id);
    })
    .catch((err) => {
      console.log(err);
      return UniversalFunction.sendError(res, err);
    });
};


module.exports = {
  showEvents,
  getRestaurantList,
  addRestaurant,
  getRestaurantDetails,
  editRestaurant,
  addEvents, // old
  addEvent,
  showEditEvent,
  updateEvent,
  //editEvent,
  //eventDesc,
  deleteEvents,
  getEventsRestaurant,
  addInvoice
};