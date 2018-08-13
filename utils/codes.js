var mysql = require('mysql');

var connection = require('./../connect');
var users = require('./../Models/Users');
var events = require('./../Models/Events');
var constants = require('./../lib/constants');

var eventConnect = (data ,socket_id ,callback) => {
  console.log('start');
  var event_id = data.event_id;
  var position = data.position;

  users.getId(data.session_id , (response) => {
    var user_id = response;
    if(user_id){
      connection.query(mysql.format("Insert into gameplay(event_id,user_id,position,socket_id) values('"+event_id+"','"+user_id+"','"+position+"','"+socket_id+"')"))
      .then((results) => {
        console.log('User entered gameplay for event' + event_id);
      })
      .catch((err) => {
        console.log(err);
      });

      connection.query(mysql.format('Select * from winners where event_id = ? and position = ? and user_id IS NOT NULL',[event_id , position]))
      .then((results) => {
        if(results.length >= 1) {
            connection.query(mysql.format('Select socket_id from gameplay where event_id = ? and position = ?', [event_id , position]))
            .then((sockets) => {
              var res = [];
              sockets.forEach((data) => {
                res.push(data.socket_id);
              })
              fetchEvent(event_id , res, (response) => {
                 callback(response,sockets);
              });
            })
        }
        else{
          return;
        }
      })
      .catch((err) => {
        console.log(err);
      });
    }
  });
  return;
}

var winnerCode = (data ,callback) => {
  console.log('Winning code');
  var event_id = data.event_id;
  var position = data.position;

  users.getId(data.session_id,(response) => {
      var user_id = response;
      if(user_id){
      connection.query(mysql.format('Update winners set user_id = ? where event_id = ? and position = ?', [user_id,event_id,position]))
      .then((results) => {
        connection.query(mysql.format('Select socket_id from gameplay where event_id = ? and position = ?', [event_id , position]))
        .then((sockets) => {
          var res = [];
          sockets.forEach((data) => {
            res.push(data.socket_id);
          })
          fetchEvent(event_id , res, (response) => {
             callback(response ,sockets);
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
  });
}

var fetchEvent = (event_id , sockets ,callback) => {
  var sql = 'Select events.id,events.name as event_name,events.cash_prize,events.id,events.winning_code,events.description,events.restaurant_id from events where events.id = ?';
  var params = [event_id];
  connection.query(mysql.format(sql,params))
  .then((results) => {
    var response;
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
      response = events.getResponse(event,result,sockets);
      // response.push(final);
      })
      .catch((err) => {
        console.log(err);
      });
    })
    setTimeout( () => {
      callback(response);
    }, 100);
  })
  .catch((err) => {
    console.log(err);
  });
}

module.exports = {
  eventConnect,
  winnerCode
}
