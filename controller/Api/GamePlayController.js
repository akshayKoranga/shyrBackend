var moment = require('moment');
var mysql = require('mysql');
var serialize = require('node-serialize');

var connection = require('./../../connect');
var events = require('./../../Models/Events');
const CONSTANTS = require('./../../const/constants');
const UniversalFunction = require('../../utils/universalFunctions');
const gameManager = require('../../lib/gameManager');

var {checkCode} = require('./../../utils/codes');

const getGame = (req, res) => {
  if(req.query.event_id === '' || isNaN(req.query.event_id)) {
    return UniversalFunction.sendError(res, 'Invalid event_id');
  }
  req.query.event_id = parseInt(req.query.event_id);

  let gameLevel = 1, game;
  // check if user alredy played game for the given event
  connection.query(mysql.format("Select * from gameplay where user_id = ? AND event_id = ?", [req.user_id, req.query.event_id]))
    .then((oldGame) => {
      if (oldGame && oldGame.length > 0) {
        oldGame = oldGame[0];
        
        if(oldGame.game_lost === 1) {
          return UniversalFunction.sendError(res, CONSTANTS.STATUS_MSG.ERROR.GAME_ALREADY_COMPLETED);
        }
        else if (oldGame.isComplete == 0) {
          // current level in progress, return a game of same level
          gameLevel = oldGame.level;
        }else if (oldGame.level < 3) {
          // last level game completed, send next level
          gameLevel = oldGame.level + 1;
        }else {
          return UniversalFunction.sendError(res, CONSTANTS.STATUS_MSG.ERROR.GAME_ALREADY_COMPLETED);
        }

        try{
          game = getNewGame(gameLevel);
        }catch (error) {
          return UniversalFunction.sendError(res, CONSTANTS.STATUS_MSG.ERROR.INVALID_GAME_LEVEL);
        }
        // update
        connection.query(mysql.format("Update gameplay set level = ?, isComplete = ? where id = ?", [gameLevel, 0, oldGame.id]))
        .then((result) => {
          game['id'] = oldGame.id;
          game['event_id'] = req.query.event_id;
          return UniversalFunction.sendSuccess(res, game);
        })
        .catch((error) => {
          return UniversalFunction.sendError(res, error);
        });

      }else {
        // new game request
        try{
          game = getNewGame(gameLevel);
        }catch (error) {
          return UniversalFunction.sendError(res, CONSTANTS.STATUS_MSG.ERROR.INVALID_GAME_LEVEL);
        }

        connection.query("Insert into gameplay(event_id, user_id, level, isComplete) values('"+ req.query.event_id +"','"+ req.user_id +"','"+ gameLevel +"','"+ 0 +"')")
        .then((newGame) => {
          game['id'] = newGame.insertId;
          game['event_id'] = req.query.event_id;
          return UniversalFunction.sendSuccess(res, game);
        })
        .catch((error) => {
          return UniversalFunction.sendError(res, error);
        });
      }
    })
    .catch((err) => {
      console.log(err);
      UniversalFunction.sendError(res, err);
    });
};

const getNewGame = (gameLevel) => { 
  let game;
  switch(gameLevel) {
    case 1:
      game = gameManager.levelOneGame();
    break;
    case 2:
      game = gameManager.levelTwoGame();
    break;
    case 3:
      game = gameManager.levelThreeGame();
    break;
    default:
      throw new Error(CONSTANTS.STATUS_MSG.ERROR.INVALID_GAME_LEVEL.message);
  }

  return  game;
};

const updateResult = (req, res) => {
  connection.query(mysql.format("Select * from gameplay where id = ?", [req.body.id]))
  .then((oldGame) => {
    if (oldGame && oldGame.length > 0) {
      oldGame = oldGame[0];
      // update game play time of last level
      if (req.body.game_play_time && req.body.game_play_time !== '' && !isNaN(req.body.game_play_time)) {
        req.body.game_play_time = parseInt(req.body.game_play_time);
        if(oldGame.level === 1) {
          oldGame.level_one_time = req.body.game_play_time;
        }else if (oldGame.level === 2) {
          oldGame.level_two_time = req.body.game_play_time;
        }else if (oldGame.level === 3) {
          oldGame.level_three_time = req.body.game_play_time;
        }

        if(oldGame.game_lost === 1) {
          return UniversalFunction.sendError(res, CONSTANTS.STATUS_MSG.ERROR.GAME_ALREADY_LOST);
        }
        if(req.body.game_lost && req.body.game_lost != '' && !isNaN(req.body.game_lost)) {
          req.body.game_lost = parseInt(req.body.game_lost);
          oldGame.game_lost = req.body.game_lost > 1 ? 1 : req.body.game_lost;
        }

        // update
        connection.query(mysql.format("Update gameplay set isComplete = ?, game_lost = ?, level_one_time = ?, level_two_time = ?, level_three_time = ? where id = ?", [1, oldGame.game_lost, oldGame.level_one_time, oldGame.level_two_time, oldGame.level_three_time, oldGame.id]))
        .then((result) => {
          if(oldGame.game_lost === 1) {
            return UniversalFunction.sendSuccess(res, CONSTANTS.STATUS_MSG.SUCCESS.GAME_LOST);
          }
          if (oldGame.level === 3 ) {
            let total_play_time = oldGame.level_one_time + oldGame.level_two_time + oldGame.level_three_time;
            // insert in leader board
            connection.query("Insert into leaderboard(event_id, game_id, user_id, total_play_time) values('"+ oldGame.event_id +"', '"+ oldGame.id +"', '"+ oldGame.user_id +"', '"+ total_play_time +"')")
            .then((gameOver) => {
              return UniversalFunction.sendSuccess(res, CONSTANTS.STATUS_MSG.SUCCESS.GAME_FINISHED);
            })
            .catch((error) => {
              return UniversalFunction.sendError(res, error);
            });
          }else {
            // get next level game
            req.query.event_id = oldGame.event_id;
            getGame(req, res);
          }
        })
        .catch((error) => {
          return UniversalFunction.sendError(res, error);
        });
      }else {
        return UniversalFunction.sendError(res, CONSTANTS.STATUS_MSG.ERROR.INVALID_GAME_PLAY_TIME);
      }
    }else {
      return UniversalFunction.sendError(res, CONSTANTS.STATUS_MSG.ERROR.INVALID_GAME_ID);
    }
  })
  .catch((error) => {
    return UniversalFunction.sendError(res, error);
  });
};

const getFunGame = (req, res) => {
  try {
    let gameLevel = Math.ceil(Math.random() * 10) % 3;
    gameLevel = gameLevel > 0 ? gameLevel : 1;
    let game = getNewGame(gameLevel);
    return UniversalFunction.sendSuccess(res, game);
  }catch (error) {
    return UniversalFunction.sendError(res, error);
  }
};

module.exports = {
  getGame: getGame,
  getFunGame: getFunGame,
  updateResult: updateResult
};


/*
  var checkUserCode = (req, res, io) => {
    io.socket.on('newCode', (data) => {
      checkCode(data.event_id , data.code , (response) => {
        socket.emit('checkCode',response);
      });
    });
  }

  module.exports = {
    checkUserCode
  };

  module.exports = exports = function checkUserCode(io){
    io.sockets.on('newCode', (data) => {
        checkCode(data.event_id , data.code , (response) => {
          sockets.emit('checkCode',response);
        });
      });
  }
*/
