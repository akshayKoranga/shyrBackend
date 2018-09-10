module.exports = {
    
    DATABASE: {
        RESTAURANT_IMAGE_PATH : 'http://52.202.52.164:3000/api/assets/img/restaurant/',
        INVOICE_IMAGE_PATH : 'http://52.202.52.164:3000/api/assets/img/invoice/',
        USER_IMAGE_PATH : 'http://52.202.52.164:3000/api/assets/img/user/',
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