const sendError = (res, error) => {
    if (!error.hasOwnProperty('code')) {
        error = {
            code: 400,
            status: 'ERROR',
            message: error
        }
    }

    res.send(JSON.stringify(error, null, 4));
}

const sendSuccess = (res, data) => {
    if(!data.hasOwnProperty('code')) {
        data = {
            code: 200,
            status: 'SUCCESS',
            message: '',
            data: data
        }
    }

    res.send(JSON.stringify(data, null, 4));
}

module.exports = {
    sendError: sendError,
    sendSuccess: sendSuccess
}