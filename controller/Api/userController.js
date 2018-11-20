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
};



module.exports = {
    addInvoice
};