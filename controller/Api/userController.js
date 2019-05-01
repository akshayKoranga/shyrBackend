var mysql = require('mysql');
var connection = require('./../../connect');
const constants = require('./../../const/const');


var {
    checkCode
} = require('./../../utils/codes');

// invoice upload  -- image
//     user id
//     event id
//     resturent id
// chk game start user event crossponding upload 




const addInvoice = (req, res) => {
    //--------------- Define variable ----------
    let user_id = req.user_id
    let event_id = req.body.event_id ? req.body.event_id : '';
    let restaurant_id = req.body.restaurant_id ? req.body.restaurant_id : '';

    // -------------- check mandatory param --------------
    if (restaurant_id.trim() == '' || event_id.trim() == '') {
        let statusCode = new constants.response().PARAMETER_MISSING;
        return res.json(constants.response.sendFailure('MANDATORY_PARAMETER_MISSING', req.params.lang, statusCode));
    }
    // ---- Image url
    if (!req.files.user_invoice_image) {
        var image = '';
    } else {
        var image = req.files.user_invoice_image[0].key;
    }
    // ----- get inserted booster pack ----- 
    connection.query(mysql.format("SELECT * FROM `events` WHERE id = ? AND event_status != 0", [event_id]))
        .then((getEvent) => {
            if (getEvent.length > 0) {
                //SELECT * FROM `events` WHERE id = 39 AND event_status != 0 
                let inserInvoice = {
                    restaurant_id: restaurant_id,
                    event_id: event_id,
                    user_id: user_id,
                    user_invoice_image: image
                }

                connection.query(mysql.format("Insert into user_invoice SET ?", [inserInvoice]))
                    .then((userInvoice) => {
                        var user_invoice_id = userInvoice.insertId;
                        connection.query(mysql.format('SELECT * FROM `user_invoice` as r  where user_invoice_id = ?', [user_invoice_id]))
                            .then((results) => {
                                return res.json(constants.response.sendSuccess('DEFAULT_SUCCESS_MESSAGE', results, req.params.lang));
                            })
                            .catch((err) => {
                                console.log(err)
                                let statusCode = new constants.response().SERVER_ERROR;
                                return res.json(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode));
                            })
                    })

                    .catch((err) => {
                        console.log(err);
                        let statusCode = new constants.response().SERVER_ERROR;
                        return res.json(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode));
                    });
            } else {
                let statusCode = new constants.response().UNAUTHORIZED;
                return res.json(constants.response.sendFailure('DEFAULT_FAILURE_MESSAGE', req.params.lang, statusCode));
            }
        });

};


const user_win = (req, res) => {
    //--------------- Define variable ----------
    // let user_id = req.user_id
  let user_id = req.query.user_id ? req.query.user_id : '';


    // -------------- check mandatory param --------------
    if (user_id.trim() == '') {
        let statusCode = new constants.response().PARAMETER_MISSING;
        return res.json(constants.response.sendFailure('MANDATORY_PARAMETER_MISSING', req.params.lang, statusCode));
    }

    // ----- get inserted booster pack ----- 
    connection.query(mysql.format("SELECT  g.*, c.*, l.*,u.* FROM `leaderboard` as l JOIN users as u ON u.id = l.user_id JOIN gameplay as g ON g.id = l.game_id JOIN cash_prize as c ON c.id = l.cash_prize_id WHERE l.`user_id` = ?  ORDER BY `total_play_time` ASC", [user_id]))
        .then((allUserRecord) => {
            let user_win_detail = {
                count: allUserRecord.length,
                Win_datail: allUserRecord
            }
            return res.json(constants.response.sendSuccess('DEFAULT_SUCCESS_MESSAGE', user_win_detail, req.params.lang));

        });

};

module.exports = {
    addInvoice,
    user_win
};