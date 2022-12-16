const ErrorResponse = require('../util/errorResponse');
const errorHandler = (err, req, res, next) => {
    console.log(err);
    let error = {...err};
    error.message = err.message;
    // Log to Console for developer
    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = new ErrorResponse(message, 404);
    }
    if (err.code === 11000) {
        const message = 'Duplicate field value entered.';
        error = new ErrorResponse(message, 400);
    }

    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((val) => val.message);
        error = new ErrorResponse(message, 400);
    }

    if (!err.message) {
        error = new ErrorResponse(err, 400);
    }
    res.status(error.statusCode || 500).json({
        success: false,
        error: {
            code: error.statusCode,
            message: error.message || 'Server Error'
        },
        time: Date.now(),
    });
};

module.exports = errorHandler;
