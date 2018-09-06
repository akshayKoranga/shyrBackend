module.exports = {
    
    DATABASE: {
        RESTAURANT_IMAGE_PATH : 'http://52.202.52.164:3000/api/assets/img/restaurant/',
        INVOICE_IMAGE_PATH : 'http://52.202.52.164:3000/api/assets/img/invoice/',
        USER_IMAGE_PATH : 'http://52.202.52.164:3000/api/assets/img/user/',
        CURRENCY : ' KD'
    },

    STATUS_MSG: {
        
        SUCCESS: {
            
            LOGIN_SUCCESS: {
                code: 200,
                status: 'SUCCESS',
                type: 'LOGIN_SUCCESS',
                message: 'Logged in successfully'
            },

            EVENT_DELETED: {
                code: 200,
                status: 'SUCCESS',
                type: 'EVENT_DELETED',
                message: 'Event deleted successfully'
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
            }
            /** 400 END */
        }
    }
}