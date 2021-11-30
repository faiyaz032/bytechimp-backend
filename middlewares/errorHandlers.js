//internal imports
const AppError = require('../utils/AppError');

// Not found handler
const notFoundHandler = function (req, res, next) {
   next(new AppError(404, `Your requested url ${req.originalUrl} was not found on this server!`));
};

// Default error Handler
const defaultErrorHandler = function (error, req, res, next) {
   error.status = error.status || 'error';
   error.statusCode = error.statusCode || 500;

   res.status(error.statusCode).json({ status: error.status, message: error.message });
};

module.exports = { notFoundHandler, defaultErrorHandler };
