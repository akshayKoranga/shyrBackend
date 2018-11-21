var moment = require('moment');
var mysql = require('mysql');
var serialize = require('node-serialize');

var connection = require('./../../connect');
var events = require('./../../Models/Events');
const constants = require('./../../const/const');
const CONSTANTS = require('./../../const/constants');
const UniversalFunction = require('../../utils/universalFunctions');
const gameManager = require('../../lib/gameManager');

var {
  checkCode
} = require('./../../utils/codes');

const getGame = async (req, res) => {
  console.log(req.query, 'get api')
  req.query.event_id = parseInt(req.query.event_id);
  var cash_prize_id = req.query.cash_prize_id ? req.query.cash_prize_id : '';
  // console.log(cash_prize_id);process.exit()
  if (req.query.event_id === '' || isNaN(req.query.event_id) || cash_prize_id == '') {
    let statusCode = new constants.response().BAD_REQUEST;
    return res.json(constants.response.sendFailure('INVALID_EVENT_ID', req.params.lang, statusCode));
  }

  let gameLevel = 1,
    game;
  // console.log(req.user_id, req.query.event_id, cash_prize_id);process.exit()
  // check if user alredy played game for the given event
  connection.query(mysql.format("Select * from gameplay where user_id = ? AND event_id = ? AND cash_prize_id = ? ORDER BY id DESC ", [req.user_id, req.query.event_id, cash_prize_id])) // cash_prize_id  commented as requirement
    .then((oldGame) => {
      //console.log(oldGame);process.exit()
      connection.query(mysql.format("Select * from cash_prize where id = ?", [cash_prize_id]))
        .then((cashPrizeData) => {
          connection.query(mysql.format("Select * from events where id = ?", [req.query.event_id]))
            .then((eventData) => {

              if (oldGame && oldGame.length > 0) {
                oldGame = oldGame[0];
                if (oldGame.game_lost == 1) {
                 // console.log(oldGame);process.exit()

                  let lost_game_chk = new Promise((resolve, reject) => {

                    //------------------ chk gameplay ------------------
                    // ------------
                    console.log('111111111')
                    // new game request
                    try {
                      game = getNewGame(gameLevel);
                    } catch (error) {
                      let statusCode = new constants.response().GATEWAY_TIMEOUT;
                      resolve(constants.response.sendFailure('INVALID_GAME_LEVEL', req.params.lang, statusCode));
                    }
                    // console.log(game);process.exit()
                    let insertGamePlay = {
                      event_id: req.query.event_id,
                      user_id: req.user_id,
                      level: gameLevel,
                      isComplete: 0,
                      cash_prize_id: cash_prize_id
                    }
                    connection.query(mysql.format("Insert into gameplay SET ?", [insertGamePlay]))
                      .then((newGame) => {
                        game['id'] = newGame.insertId;
                        game['event_id'] = req.query.event_id;

                        // -------------- event data ---------
                        if (cashPrizeData.length > 0) {
                          game.cash_prize_data = cashPrizeData[0];
                        } else {
                          game.cash_prize_data = {};
                        }
                        if (eventData.length > 0) {
                          game.event_data = eventData[0];
                        } else {
                          game.event_data = {};
                        }
                        connection.query(mysql.format("Select * from event_game_rules where event_id = ? AND cash_prize_id = ?  AND level = ?", [req.query.event_id, cash_prize_id, gameLevel]))
                          .then((gameRuleData) => {
                            if (gameRuleData.length > 0) {
                              game.game_rule = gameRuleData[0]
                            } else {
                              game.game_rule = {}
                            }
                            connection.query(mysql.format("Select * from gameplay where id = ?", [newGame.insertId]))
                              .then((gamePlayData) => {
                                game.game_play = gamePlayData[0]
                                // ------- select booster pack --------------
                                connection.query(mysql.format("SELECT * FROM `booster_pack` WHERE user_id = ? AND event_id = ? AND cash_prize_id = ? ", [req.user_id, req.query.event_id, cash_prize_id]))
                                  .then((getBooster) => {
                                    game.booster_pack = getBooster
                                    resolve(constants.response.sendSuccess('DEFAULT_SUCCESS_MESSAGE', game, req.params.lang));
                                  })
                                  .catch((error) => {
                                    console.log(error, 'err')
                                    let statusCode = new constants.response().SERVER_ERROR;
                                    resolve(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode));
                                  }); // --- end of select booster
                              }).catch((err) => {
                                console.log(err);
                                let statusCode = new constants.response().SERVER_ERROR;
                                resolve(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode));
                              });
                          }).catch((err) => {
                            console.log(err);
                            let statusCode = new constants.response().SERVER_ERROR;
                            resolve(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode));
                          });
                        //return UniversalFunction.sendSuccess(res, game);
                      })
                      .catch((error) => {
                        console.log(error, 'err')
                        let statusCode = new constants.response().SERVER_ERROR;
                        resolve(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode));
                      });
                  });
                  lost_game_chk.then(objectDetail => {
                    if (oldGame.game_lost == 1) {
                      return res.json(objectDetail);

                    }
                  }).catch((error) => {
                    console.log(error, 'err')
                    let statusCode = new constants.response().SERVER_ERROR;
                    return res.json(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode));
                  });
                  //-------------------delete this part --------------

                  //----------------already completed ------------
                  // let statusCode = new constants.response().GATEWAY_TIMEOUT;
                  // return res.json(constants.response.sendFailure('GAME_ALREADY_COMPLETED', req.params.lang, statusCode));
                } else {

                  console.log('yo')


                  if (oldGame.isComplete == 0) {
                    // console.log('hhhheee');process.exit()
                    // current level in progress, return a game of same level
                    gameLevel = oldGame.level;
                  } else if (oldGame.level < 3) {
                    //console.log('oooooo');process.exit()

                    // last level game completed, send next level
                    gameLevel = oldGame.level + 1;
                  } else {
                    //console.log('yes here i am');process.exit()

                    //------------------ chk gameplay ------------------
                    let statusCode = new constants.response().GATEWAY_TIMEOUT;
                    return res.json(constants.response.sendFailure('GAME_ALREADY_COMPLETED', req.params.lang, statusCode));
                  }



                  try {
                    game = getNewGame(gameLevel);
                  } catch (error) {
                    console.log(error)
                    let statusCode = new constants.response().GATEWAY_TIMEOUT;
                    return res.json(constants.response.sendFailure('INVALID_GAME_LEVEL', req.params.lang, statusCode));
                  }
                  // update
                  connection.query(mysql.format("Update gameplay set level = ?, isComplete = ? where id = ?", [gameLevel, 0, oldGame.id]))
                    .then((result) => {
                      game['id'] = oldGame.id;
                      game['event_id'] = req.query.event_id;

                      // -------------- event data ---------
                      if (cashPrizeData.length > 0) {
                        game.cash_prize_data = cashPrizeData[0];
                      } else {
                        game.cash_prize_data = {};
                      }
                      if (eventData.length > 0) {
                        game.event_data = eventData[0];
                      } else {
                        game.event_data = {};
                      }
                      connection.query(mysql.format("Select * from event_game_rules where event_id = ? AND cash_prize_id = ?  AND level = ?", [req.query.event_id, cash_prize_id, gameLevel]))
                        .then((gameRuleData) => {
                          if (gameRuleData.length > 0) {
                            game.game_rule = gameRuleData[0]
                          } else {
                            game.game_rule = {}
                          }
                          connection.query(mysql.format("Select * from gameplay where id = ?", [oldGame.id]))
                            .then((gamePlayData) => {
                              game.game_play = gamePlayData[0]
                              // ------- select booster pack --------------
                              connection.query(mysql.format("SELECT * FROM `booster_pack` WHERE user_id = ? AND event_id = ? AND cash_prize_id = ? ", [req.user_id, req.query.event_id, cash_prize_id]))
                                .then((getBooster) => {
                                  game.booster_pack = getBooster
                                  return res.json(constants.response.sendSuccess('DEFAULT_SUCCESS_MESSAGE', game, req.params.lang));

                                })
                                .catch((error) => {
                                  console.log(error, 'err')
                                  let statusCode = new constants.response().SERVER_ERROR;
                                  return res.json(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode));
                                }); // --- end of select booster

                            }).catch((err) => {
                              console.log(err);
                              let statusCode = new constants.response().SERVER_ERROR;
                              return res.json(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode));
                            });
                        }).catch((err) => {
                          console.log(err);
                          let statusCode = new constants.response().SERVER_ERROR;
                          return res.json(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode));
                        });

                    })
                    .catch((error) => {
                      console.log(error)
                      let statusCode = new constants.response().SERVER_ERROR;
                      return res.json(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode));
                    });
                }
              } else {
                // new game request
                try {
                  game = getNewGame(gameLevel);
                } catch (error) {
                  let statusCode = new constants.response().GATEWAY_TIMEOUT;
                  return res.json(constants.response.sendFailure('INVALID_GAME_LEVEL', req.params.lang, statusCode));
                }
                // console.log(game);process.exit()
                let insertGamePlay = {
                  event_id: req.query.event_id,
                  user_id: req.user_id,
                  level: gameLevel,
                  isComplete: 0,
                  cash_prize_id: cash_prize_id
                }
                connection.query(mysql.format("Insert into gameplay SET ?", [insertGamePlay]))
                  .then((newGame) => {
                    game['id'] = newGame.insertId;
                    game['event_id'] = req.query.event_id;

                    // -------------- event data ---------
                    if (cashPrizeData.length > 0) {
                      game.cash_prize_data = cashPrizeData[0];
                    } else {
                      game.cash_prize_data = {};
                    }
                    if (eventData.length > 0) {
                      game.event_data = eventData[0];
                    } else {
                      game.event_data = {};
                    }
                    connection.query(mysql.format("Select * from event_game_rules where event_id = ? AND cash_prize_id = ?  AND level = ?", [req.query.event_id, cash_prize_id, gameLevel]))
                      .then((gameRuleData) => {
                        if (gameRuleData.length > 0) {
                          game.game_rule = gameRuleData[0]
                        } else {
                          game.game_rule = {}
                        }
                        connection.query(mysql.format("Select * from gameplay where id = ?", [newGame.insertId]))
                          .then((gamePlayData) => {
                            game.game_play = gamePlayData[0]
                            // ------- select booster pack --------------
                            connection.query(mysql.format("SELECT * FROM `booster_pack` WHERE user_id = ? AND event_id = ? AND cash_prize_id = ? ", [req.user_id, req.query.event_id, cash_prize_id]))
                              .then((getBooster) => {
                                game.booster_pack = getBooster
                                return res.json(constants.response.sendSuccess('DEFAULT_SUCCESS_MESSAGE', game, req.params.lang));

                              })
                              .catch((error) => {
                                console.log(error, 'err')
                                let statusCode = new constants.response().SERVER_ERROR;
                                return res.json(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode));
                              }); // --- end of select booster
                          }).catch((err) => {
                            console.log(err);
                            let statusCode = new constants.response().SERVER_ERROR;
                            return res.json(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode));
                          });
                      }).catch((err) => {
                        console.log(err);
                        let statusCode = new constants.response().SERVER_ERROR;
                        return res.json(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode));
                      });
                    //return UniversalFunction.sendSuccess(res, game);
                  })
                  .catch((error) => {
                    console.log(error, 'err')
                    let statusCode = new constants.response().SERVER_ERROR;
                    return res.json(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode));
                  });
              }
            }).catch((err) => {
              console.log(err);
              let statusCode = new constants.response().SERVER_ERROR;
              return res.json(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode));
            });
        }).catch((err) => {
          console.log(err);
          let statusCode = new constants.response().SERVER_ERROR;
          return res.json(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode));
        });
    })
    .catch((err) => {
      console.log(err);
      let statusCode = new constants.response().SERVER_ERROR;
      return res.json(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode));
    });
};

const getNewGame = (gameLevel) => {
  let game;
  switch (gameLevel) {
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

  return game;
};

const updateResult = (req, res) => {
  //--------------- Define variable ----------
  let game_play_id = req.body.game_play_id ? req.body.game_play_id : '';
  var game_lost = req.body.game_lost ? req.body.game_lost : '';
  var game_play_time = req.body.game_play_time ? req.body.game_play_time : '';

  console.log(req.body, 'input app')
  // ---------- check mandatory param --------------
  if (game_play_id == '' || game_lost.trim() == '' || game_play_time.trim() == '') {
    let statusCode = new constants.response().PARAMETER_MISSING;
    return res.json(constants.response.sendFailure('MANDATORY_PARAMETER_MISSING', req.params.lang, statusCode));
  }
  // ---------------- parse Int ------------------
  game_lost = parseInt(game_lost);
  game_play_time = parseInt(game_play_time);
  if (isNaN(game_lost) || isNaN(game_play_time)) {
    let statusCode = new constants.response().BAD_REQUEST;
    return res.json(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode));
  }

  connection.query(mysql.format("Select * from gameplay where id = ? ORDER BY id DESC", [req.body.game_play_id]))
    .then((oldGame) => {
      if (oldGame && oldGame.length > 0) {
        oldGame = oldGame[0];
        // update game play time of last level

        if (oldGame.level == '1') {
          oldGame.level_one_time = game_play_time;
        } else if (oldGame.level == '2') {
          oldGame.level_two_time = game_play_time;
        } else if (oldGame.level == '3') {
          oldGame.level_three_time = game_play_time;
        }

        if (oldGame.game_lost == '1') {
          let statusCode = new constants.response().REQUEST_TIMEOUT;
          return res.json(constants.response.sendFailure('GAME_ALREADY_LOST1', req.params.lang, statusCode));
        }
        req.body.game_lost = parseInt(req.body.game_lost);
        if (req.body.game_lost && req.body.game_lost != '' && !isNaN(req.body.game_lost)) {
          oldGame.game_lost = game_lost > 1 ? 1 : game_lost;
        }

        // update
        connection.query(mysql.format("Update gameplay set isComplete = ?, game_lost = ?, level_one_time = ?, level_two_time = ?, level_three_time = ? where id = ?", [1, oldGame.game_lost, oldGame.level_one_time, oldGame.level_two_time, oldGame.level_three_time, oldGame.id]))
          .then((result) => {
            //  console.log(result);process.exit()
            if (oldGame.game_lost === 1) {
              return res.json(constants.response.sendSuccess('GAME_LOST', '', req.params.lang));
            }
            if (oldGame.level === 3) {
              let total_play_time = oldGame.level_one_time + oldGame.level_two_time + oldGame.level_three_time;
              // insert in leader board
              connection.query("Insert into leaderboard(event_id, game_id, user_id, total_play_time) values('" + oldGame.event_id + "', '" + oldGame.id + "', '" + oldGame.user_id + "', '" + total_play_time + "')")
                .then((gameOver) => {
                  return res.json(constants.response.sendSuccess('GAME_FINISHED', '', req.params.lang));
                })
                .catch((error) => {
                  console.log(error, 'error')
                  let statusCode = new constants.response().SERVER_ERROR;
                  return res.json(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode));
                });
            } else {
              // --------------- select game rules ----------
              connection.query(mysql.format("Select * from event_game_rules where event_id = ?  AND level = ?", [oldGame.event_id, 2]))
                .then((gameRuleData) => {
                  if (gameRuleData.length > 0) {
                    req.query.cash_prize_id = oldGame.cash_prize_id
                    req.query.event_id = oldGame.event_id;
                    getGame(req, res);
                  } else {
                    console.log('here is error')
                    let statusCode = new constants.response().SERVER_ERROR;
                    return res.json(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode));
                  }
                })
                .catch((error) => {
                  console.log(error);
                  let statusCode = new constants.response().SERVER_ERROR;
                  return res.json(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode));
                });
            }
          })
          .catch((error) => {
            console.log(error);
            let statusCode = new constants.response().SERVER_ERROR;
            return res.json(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode));
          });

      } else {
        let statusCode = new constants.response().BAD_REQUEST;
        return res.json(constants.response.sendFailure('INVALID_GAME_PLAY_TIME', req.params.lang, statusCode));
      }
    })
    .catch((error) => {
      console.log(error, 'error')
      let statusCode = new constants.response().SERVER_ERROR;
      return res.json(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode));
    });
};


const allUserRecord = (req, res) => {
  //--------------- Define variable ----------
  let static_user_id = req.query.static_user_id ? req.query.static_user_id : '';

  // ---------- check mandatory param --------------
  if (static_user_id == '') {
    let statusCode = new constants.response().PARAMETER_MISSING;
    return res.json(constants.response.sendFailure('MANDATORY_PARAMETER_MISSING', req.params.lang, statusCode));
  }
  // ---------------- parse Int ------------------
  static_user_id = parseInt(static_user_id);
  if (isNaN(static_user_id)) {
    let statusCode = new constants.response().BAD_REQUEST;
    return res.json(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode));
  }

  connection.query(mysql.format("Select gp.*, e.* from gameplay as gp LEFT JOIN events AS e ON e.id = gp.event_id where user_id = ? ", [static_user_id]))
    .then((allUserRecord) => {
      return res.json(constants.response.sendSuccess('DEFAULT_SUCCESS_MESSAGE', allUserRecord, req.params.lang));
      //neLy8oDlJdbfe8swefqanZlyhgXKKg6F
    })
    .catch((error) => {
      console.log(error, 'error')
      let statusCode = new constants.response().SERVER_ERROR;
      return res.json(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode));
    });
};

const getFunGame = (req, res) => {
  try {
    let gameLevel = Math.ceil(Math.random() * 10) % 3;
    gameLevel = gameLevel > 0 ? gameLevel : 1;
    let game = getNewGame(gameLevel);
    return res.json(constants.response.sendSuccess('GAME_LOST', game, req.params.lang));
  } catch (error) {
    console.log(error)
    return res.json(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode));
  }
};

module.exports = {
  getGame: getGame,
  getFunGame: getFunGame,
  updateResult: updateResult,
  allUserRecord
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