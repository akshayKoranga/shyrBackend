var moment = require('moment');
var mysql = require('mysql');
var serialize = require('node-serialize');

var connection = require('./../../connect');
var events = require('./../../Models/Events');
const CONSTANTS = require('./../../const/constants');
const UniversalFunction = require('../../utils/universalFunctions');
const gameManager = require('../../lib/gameManager');

var {checkCode} = require('./../../utils/codes');

const getNewGame = (req, res) => {
  let game;
  switch(req.params.level) {
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
      return UniversalFunction.sendError(res, INVALID_GAME_LEVEL);
    break;
  }
};

const updateResult = (req, res) => {

};

module.exports = {
  getNewGame: getNewGame,
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
