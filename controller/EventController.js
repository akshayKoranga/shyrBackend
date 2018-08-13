var moment = require('moment');
var mysql = require('mysql');
var serialize = require('node-serialize');

var connection = require('../connect');

var showEvents = (req, res) => {
  connection.query('Select events.name as event_name,events.id,events.event_start_time,events.event_end_time,events.description,restaurant.name,events.cash_prize,events.winning_code from events left join restaurant on events.restaurant_id = restaurant.id')
  .then((results) => {
    res.render('events', {events : results});
  })
  .catch((err) => {
    console.log(err);
  });
}

var showAddEvents = (req, res) => {
  connection.query('SELECT * from restaurant')
  .then((results) => {
      res.render('add_events' , {companies : results});
  })
  .catch((err) => {
      console.log(err);
  })
}

var deleteEvents = (req, res) => {
  var event_id = req.query.event_id;
  connection.query(mysql.format('Delete from events where id = ?',[event_id]))
  .then((results) => {
    connection.query(mysql.format('Delete from winners where event_id = ?' , [event_id]))
    .then((results) => {
      connection.query(mysql.format('Delete from events_restaurant where event_id = ?', [event_id]))
      .then((results) => {
            res.redirect('/admin/events');
      })
    })
  })
  .catch((err) => {
    console.log(err);
  });
}

var addEvents = (req, res) => {
  console.log(req.body);
var event_name = req.body.event_name;
var restaurant = req.body.restaurant_name;
var description = req.body.description;
var event_start_time = moment(req.body.event_start_time,'MM/DD/YYYY HH:mm A').format('YYYY-MM-DD HH:mm:ss');
var event_end_time = moment(req.body.event_end_time,'MM/DD/YYYY HH:mm A').format('YYYY-MM-DD HH:mm:ss');
var submission_start_time = moment(req.body.submission_start_time,'MM/DD/YYYY HH:mm A').format('YYYY-MM-DD HH:mm:ss');
var submission_end_time = moment(req.body.submission_end_time,'MM/DD/YYYY HH:mm A').format('YYYY-MM-DD HH:mm:ss');
var event_time = req.body.event_time ? req.body.event_time : 0;
// var invoice_order_number = req.body.invoice_order_number;
// var invoice_date = moment(req.body.invoice_date,'MM/DD/YYYY HH:mm A').format('YYYY-MM-DD HH:mm:ss');
var cash_prize = req.body.cash_prize;
var num_winners = req.body.num_winners;

// restaurant_name.forEach((rest) => {
//   restaurant.push(rest);
// })

// var restaurant = serialize.serialize(restaurant_name);

// var invoice = req.files.invoice;
// var invoice_name = event_name + req.files.invoice.name;
//
// invoice.mv('./public/assets/img/invoice/' + invoice_name ,(err) => {
//   if(err){
//     console.log(err);
//     return;
//   }
// });

connection.query("Insert into events(name,description,cash_prize,event_start_time,event_end_time,submission_start_time,submission_end_time,num_winners,event_time) values('"+event_name+"','"+description+"','"+cash_prize+"','"+event_start_time+"','"+event_end_time+"','"+submission_start_time+"','"+submission_end_time+"','"+num_winners+"','"+event_time+"')")
.then((events) => {
  var event_id = events.insertId;
  // var rest = JSON.parse("[" + restaurant + "]");
  for(var j = 0;j < restaurant.length ; j++){
    connection.query("Insert into events_restaurant(event_id,restaurant_id) values('"+event_id+"','"+restaurant[j]+"')")
  }

  for(var i = 1; i <= num_winners; i++ ){
   var winner = 'winner' + i;
   var winning_code = 'winning_code' + i;
   var jumbled_code = 'jumbled_code' + i;

   var cash = req.body[winner];
   var code = req.body[winning_code];
   var j_code = req.body[jumbled_code];

   connection.query("Insert into winners(event_id,position,cash_prize,winning_code,jumbled_code) values('"+event_id+"','"+i+"','"+cash+"','"+code+"','"+j_code+"')")
}
})
.then(() => {
  showEvents(req,res);
})
.catch((err) => {
  console.log(err);
});
}

var showEditEvent = (req, res ,err) => {
  var error = {};
  var id = req.params.id;
  var company;
  connection.query(mysql.format('Select events.event_time,events.num_winners,events.name as event_name,events.id,events.event_start_time,events.event_end_time,events.submission_start_time,events.submission_end_time,events.description,events.cash_prize from events where events.id = ?' , [id]))
  .then((results) => {
    connection.query('Select restaurant.id, restaurant.name from restaurant')
    .then((restaurant) => {
         getWinners(req.params.id , (response) => {
             getRestaurants(req.params.id , (rest_data) => {
                 res.render('edit_events',{events : results, event_restaurants : rest_data ,
                                           restaurants : restaurant,winners : response, errors :error});
             });
            });

    })
    .catch((err) => {
      console.log(err);
    })
  })
  .catch((err) => {
    console.log(err);
  });
}

var editEvent = (req, res) => {
  var event_id = req.params.id;
  var event_name = req.body.event_name;
  var restaurant = req.body.restaurant_name;
  var description = req.body.description;
  var event_start_time = moment(req.body.event_start_time,'MM/DD/YYYY HH:mm A').format('YYYY-MM-DD HH:mm:ss');
  var event_end_time = moment(req.body.event_end_time,'MM/DD/YYYY HH:mm A').format('YYYY-MM-DD HH:mm:ss');
  var submission_start_time = moment(req.body.submission_start_time,'MM/DD/YYYY HH:mm A').format('YYYY-MM-DD HH:mm:ss');
  var submission_end_time = moment(req.body.submission_end_time,'MM/DD/YYYY HH:mm A').format('YYYY-MM-DD HH:mm:ss');
  var cash_prize = req.body.cash_prize;
  var num_winners = req.body.num_winners;
  var event_time = req.body.event_time ? req.body.event_time : 0;

  var sql = "Update events set name = ? , description = ? , cash_prize = ? ,event_start_time = ? , event_end_time = ? , submission_start_time = ? , submission_end_time = ? , num_winners = ? ,event_time = ? where id = ?";
  var params = [event_name , description , cash_prize , event_start_time , event_end_time, submission_start_time , submission_end_time, num_winners ,event_time ,event_id];
  connection.query(mysql.format(sql,params))
  .then((events) => {
    connection.query(mysql.format("Delete from events_restaurant where event_id = ?" ,[event_id]));
    // var rest = JSON.parse("[" + restaurant + "]");

    if(restaurant.length >= 1){
    for(var j = 0;j < restaurant.length ; j++){
      connection.query("Insert into events_restaurant(event_id,restaurant_id) values('"+event_id+"','"+restaurant[j]+"')");
    }
  }
  else{
    connection.query("Insert into events_restaurant(event_id,restaurant_id) values('"+event_id+"','"+restaurant+"')");
  }
    connection.query(mysql.format("Delete from winners where event_id = ?" ,[event_id]));
    for(var i = 1; i <= num_winners; i++ ){
     var winner = 'winner' + i;
     var winning_code = 'winning_code' + i;
     var jumbled_code = 'jumbled_code' + i;

     var cash = req.body[winner];
     var code = req.body[winning_code];
     var j_code = req.body[jumbled_code];

     connection.query("Insert into winners(event_id,position,cash_prize,winning_code,jumbled_code) values('"+event_id+"','"+i+"','"+cash+"','"+code+"','"+j_code+"')")
  }
  })
  .then(() => {
    showEvents(req,res);
  })
  .catch((err) => {
    console.log(err);
  });
}

var eventDesc = (req, res) => {
 var event_id = req.params.id;
 connection.query(mysql.format('Select events.id,events.name,events.description,events.event_start_time,events.event_end_time,events.submission_start_time,events.submission_end_time,events.num_winners,restaurant.name as rest_name,restaurant.logo,winners.position,winners.cash_prize,winners.winning_code,winners.jumbled_code from events left join events_restaurant on events_restaurant.event_id = events.id left join restaurant on restaurant.id = events_restaurant.restaurant_id left join winners on winners.event_id = events.id where events.id = ?',[event_id]))
 .then((results) => {
   var restaurants = [];
   results.forEach((data) => {
     restaurants.push({name : data.rest_name , id : data.id});
   })
   res.render('event_description',{events : results , restaurants : restaurants});
 })
 .catch((err) => {
   console.log(err);
 });

}

var getWinners = (event_id ,callback) => {
connection.query(mysql.format('Select * from winners where event_id = ?' ,[event_id]))
.then((results) => {
  callback(results);
})
.catch((err) => {
  console.log(err);
});
}

var getRestaurants = (event_id ,callback) => {
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

module.exports = {
  showEvents,
  showAddEvents,
  addEvents,
  showEditEvent,
  editEvent,
  eventDesc,
  deleteEvents
};
