module.exports = {
    
    DATABASE: {
        RESTAURANT_IMAGE_PATH : 'http://18.224.152.176:3000/api/assets/img/restaurant/',
        INVOICE_IMAGE_PATH : 'http://18.224.152.176:3000/api/assets/img/invoice/',
        USER_IMAGE_PATH : 'http://18.224.152.176:3000/api/assets/img/user/',
        CURRENCY : ' KD'
    },

    STATUS_MSG: {
        
        SUCCESS: {

            EVENT_DELETED: {
                code: 200,
                status: 'SUCCESS',
                type: 'EVENT_DELETED',
                message: 'Event deleted successfully'
            },

            EVENT_UPDATED: {
                code: 200,
                status: 'SUCCESS',
                type: 'EVENT_UPDATED',
                message: 'Event updated successfully'
            },

            GAME_FINISHED: {
                code: 200,
                status: 'SUCCESS',
                type: 'GAME_FINISHED',
                message: 'Game completed successfully'
            },

            GAME_LOST: {
                code: 200,
                status: 'SUCCESS',
                type: 'GAME_LOST',
                message: 'You lost the game. Better luck next time!'
            },

            LOGIN_SUCCESS: {
                code: 200,
                status: 'SUCCESS',
                type: 'LOGIN_SUCCESS',
                message: 'Logged in successfully'
            },

            LOGOUT_SUCCESS: {
                code: 200,
                status: 'SUCCESS',
                type: 'LOGOUT_SUCCESS',
                message: 'Logged out successfully'
            },

            PASSWORD_UPDATED: {
                code: 200,
                status: 'SUCCESS',
                type: 'PASSWORD_UPDATED',
                message: 'Password updated successfully'
            },

            RESTAURANT_UPDATED: {
                code: 200,
                status: 'SUCCESS',
                type: 'RESTAURANT_UPDATED',
                message: 'Restaurant updated successfully'
            }
        },

        ERROR: {
            /** 403 ERRORS Forbidden*/
            UNAUTHORIZED_ACCESS: {
                code: 403,
                status: 'ERROR',
                type: 'UNAUTHORIZED_ACCESS',
                message: 'Unauthorized access'
            },
            /** 403 END */

            /** 401 ERRORS Unauthorized */
            INVALID_TOKEN: {
                code: 401,
                status: 'ERROR',
                type: 'INVALID_TOKEN',
                message: 'Invalid token'
            },
            /** 401 END */

            /** 400 ERRORS Bad Request*/
            GAME_ALREADY_COMPLETED: {
                code: 400,
                status: 'ERROR',
                type: 'GAME_ALREADY_COMPLETED',
                message: 'Already completed the game'
            },

            GAME_ALREADY_LOST: {
                code: 400,
                status: 'ERROR',
                type: 'GAME_ALREADY_LOST',
                message: 'Already lost the game'
            },

            INCORRECT_PASSWORD: {
                code: 400,
                status: 'ERROR',
                type: 'INCORRECT_PASSWORD',
                message: 'Incorrect password'
            },

            INVALID_CREDENTIALS: {
                code: 400,
                status: 'ERROR',
                type: 'INVALID_CREDENTIALS',
                message: 'Invalid credentials'
            },

            INVALID_EVENT_ID: {
                code: 400,
                status: 'ERROR',
                type: 'INVALID_EVENT_ID',
                message: 'Invalid event id'
            },

            INVALID_GAME_ID: {
                code: 400,
                status: 'ERROR',
                type: 'INVALID_GAME_ID',
                message: 'Invalid game id'
            },

            INVALID_GAME_LEVEL: {
                code: 400,
                status: 'ERROR',
                type: 'INVALID_GAME_LEVEL',
                message: 'Invalid game level'
            },

            INVALID_GAME_PLAY_TIME: {
                code: 400,
                status: 'ERROR',
                type: 'INVALID_GAME_PLAY_TIME',
                message: 'Invalid game play time'
            },

            PASSWORD_MISMATCH: {
                code: 400,
                status: 'ERROR',
                type: 'PASSWORD_MISMATCH',
                message: 'Password mismatch'
            }
            /** 400 END */
        }
    }
}