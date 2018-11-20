let Boom = require('boom');

let localisedStrings = {
    'DEFAULT_SUCCESS_MESSAGE': {
        en: 'Successful.',
        es: 'Spanish successful'
    },
    'DEFAULT_FAILURE_MESSAGE': {
        en: 'Failure.',
        es: 'Spanish failure.'
    },
    'INVALID_EVENT_ID': {
        en: 'Invalid event id.',
        es: 'Spanish Invalid event id.'
    },
    'GAME_ALREADY_COMPLETED': {
        en: 'You have already played this game and you can’t play it again, please choose other cash prize or play other running events.',
        es: 'Spanish You have already played this game and you can’t play it again, please choose other cash prize or play other running events.'
    },
    'INVALID_GAME_LEVEL': {
        en: 'Invalid game level.',
        es: 'Spanish Invalid game level.'
    },
    'INVALID_GAME_PLAY_TIME': {
        en: 'Invalid game play',
        es: 'Spanish Invalid game play.'
    },
    'INVALID_GAME_ID': {
        en: 'Invalid game ID',
        es: 'Spanish Invalid game ID.'
    },
    'GAME_FINISHED': {
        en: 'Game completed successfully',
        es: 'Spanish Game completed successfully'
    },
    'GAME_LOST': {
        en: 'You lost the game. Better luck next time!',
        es: 'Spanish You lost the game. Better luck next time!'
    },
    "GAME_ALREADY_LOST": {
        en: 'You already lost the game please try next time.',
        es: 'Spanish You already lost the game please try next time.'
    },
    "INVALID_CASH_PRIZE_ID": {
        en: 'Invalid cash prize id.',
        es: 'Spanish Invalid cash prize id.'
    },
    'GAME_ALREADY_LOST1': {
        en: 'Sorry you lost the game.',
        es: 'Sorry you lost the game.'
    },
    'MANDATORY_PARAMETER_MISSING': {
        en: 'One or more of the required parameters are missing.',
        es: 'Spanish - mandatory parameters missing.'
    },
    'BOOSTER_PACK_ALREADY_EXSIT': {
        en: 'Booster pack for this event is already exist.',
        es: 'Spanish - Booster pack for this event is already exist.'
    },
}

// 3. about the error-pop ups:
// Currently, i have completed the game (cash prize), and if i try playing same game, it gives me error - “You completed the game” it should say: “You have already played this game and you can’t play it again, please choose other cash prize or play other running events”



class sendResponse {

    constructor() {

        //---sucess code
        this.SUCCESS = 200;
        //-----Server errors
        this.SERVER_ERROR = 500;
        this.GATEWAY_TIMEOUT = 504;
        // ----Client errors
        this.NOT_FOUND = 404;
        this.UNAUTHORIZED = 401;
        this.FORBIDDEN = 403;
        this.BAD_REQUEST = 400;
        this.REQUEST_TIMEOUT = 408
        this.ALREADY_EXIST = 409;
        this.PRECONDITION_FAILED = 412;

        // ----System Error Codes 
        this.PARAMETER_MISSING = 1100;
        this.FILE_NOT_UPLOADED = 1101;
        this.VALUE_NOT_UNIQUE = 1102;

        // ---- Unofficial codes
        this.METHOD_FAILURE = 420;

        // ----Internet Information Services
        this.TIME_OUT = 440;
        this.RETRY = 449;
        this.REDIRECT = 451;
    }


    static sendFailure(errObj, lang, statusCode) {
        if (typeof errObj === typeof '') {
            var message = localiseStrings.getLocalisedTextFor(errObj, lang);
            message = message === undefined ? localisedStrings.DEFAULT_FAILURE_MESSAGE.lang : message;
            return new Boom(message, {
                statusCode: statusCode
            });
        } else {
            return Boom.boomify(errObj, {
                statusCode: statusCode
            })
        }
    }

    static sendSuccess(strKey, data, lang) {
        var message = localiseStrings.getLocalisedTextFor(strKey, lang);
        message = message === undefined ? localisedStrings.DEFAULT_SUCCESS_MESSAGE.lang : message;
        return {
            success: 200,
            message: message,
            data: data
        };
    }
}

class localiseStrings {
    static getLocalisedTextFor(key, lang) {
        try {
            var message = localisedStrings[key][lang];
            console.log(message)
            message = message === undefined ? localisedStrings['DEFAULT_FAILURE_MESSAGE']['en'] : message;
            return message;
        } catch (e) {
            message = message === undefined ? localisedStrings['INVALID_LANGUAGE']['en'] : message;
            return message;
        }
    }
}


class userRole {
    constructor() {
        this.ADMIN = 1;
        this.USER = 2;
    }
}


//let rand = '24785139'

module.exports.userRole = userRole
module.exports.response = sendResponse;
module.exports.localise = localiseStrings;