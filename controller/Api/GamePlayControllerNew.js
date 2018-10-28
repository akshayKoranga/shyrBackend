let express = require('express');
var mysql = require('mysql');
var connection = require('./../../connect');
const UniversalFunction = require('../../utils/universalFunctions');
const gameManager = require('../../lib/gameManager');
const constants = require('./../../const/const');
const CONSTANTS = require('./../../const/constants');




module.exports = function gameControllerNew() {

    //========================== Helper function====================
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

    // ========================= En of helper function =====================
    let api = express.Router();



    api.get('/startGame',  (req, res) => {
        try {
           // req.params.lang = 'en'
//  console.log(req.params());process.exit()
            // ---------------define Variable -----------------------------
            var user_id = req.user_id;
            var event_id = req.query.event_id ? req.query.event_id : '';
            // ---------------End of define Variable-----------------------
            //-----------check mandatory params--------------
            if ((!user_id) || event_id.trim() == '') {
                let statusCode = new constants.response().PARAMETER_MISSING;
                return res.json(constants.response.sendFailure('MANDATORY_PARAMETER_MISSING', req.params.lang, statusCode));
            } else {
                event_id = parseInt(event_id);
                if (event_id === '' || isNaN(event_id)) {
                    let statusCode = new constants.response().BAD_REQUEST;
                    return res.json(constants.response.sendFailure('INVALID_EVENT_ID', req.params.lang, statusCode));
                }

                let gameLevel = 1,
                    game;
                // check if user alredy played game for the given event
                connection.query(mysql.format("Select * from gameplay where user_id = ? AND event_id = ?", [user_id, event_id]))
                    .then((oldGame) => {
                        //console.log(oldGame);process.exit()
                        if (oldGame && oldGame.length > 0) {
                            oldGame = oldGame[0];

                            if (oldGame.game_lost === 1) {
                                let statusCode = new constants.response().GATEWAY_TIMEOUT;
                                return res.json(constants.response.sendFailure('GAME_ALREADY_COMPLETED', req.params.lang, statusCode));
                            } else if (oldGame.isComplete == 0) {
                                // current level in progress, return a game of same level
                                gameLevel = oldGame.level;
                            } else if (oldGame.level < 3) {
                                // last level game completed, send next level
                                gameLevel = oldGame.level + 1;
                            } else {
                                let statusCode = new constants.response().GATEWAY_TIMEOUT;
                                return res.json(constants.response.sendFailure('GAME_ALREADY_COMPLETED', req.params.lang, statusCode));
                            }

                            try {
                                game = getNewGame(gameLevel);
                            } catch (error) {
                                let statusCode = new constants.response().GATEWAY_TIMEOUT;
                                return res.json(constants.response.sendFailure('INVALID_GAME_LEVEL', req.params.lang, statusCode));
                            }
                            // update
                            connection.query(mysql.format("Update gameplay set level = ?, isComplete = ? where id = ?", [gameLevel, 0, oldGame.id]))
                                .then((result) => {
                                    game['id'] = oldGame.id;
                                    game['event_id'] = event_id;
                                    return res.json(constants.response.sendSuccess('DEFAULT_SUCCESS_MESSAGE', game, req.params.lang));
                                })
                                .catch((error) => {
                                    return UniversalFunction.sendError(res, error);
                                });

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
                                event_id: event_id,
                                user_id: user_id,
                                level: gameLevel,
                                isComplete: 0
                            }
                            connection.query(mysql.format("Insert into gameplay SET ?", [insertGamePlay]))
                                .then((newGame) => {
                                    game['id'] = newGame.insertId;
                                    game['event_id'] = event_id;
                                    return res.json(constants.response.sendSuccess('DEFAULT_SUCCESS_MESSAGE', game, req.params.lang));

                                    //return UniversalFunction.sendSuccess(res, game);
                                })
                                .catch((error) => {
                                    console.log(error, 'err')
                                    let statusCode = new constants.response().SERVER_ERROR;
                                    return res.json(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode));
                                });
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        let statusCode = new constants.response().SERVER_ERROR;
                        return res.json(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode));
                    });
            }
        } catch (e) {
            console.log(e);
            let statusCode = new constants.response().SERVER_ERROR;
            return res.json(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode));
        }
    });




    return api;
}