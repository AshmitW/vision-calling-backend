'use strict'

const httpStatus = require('http-status')

// hanlde not found error
exports.handleNotFound = (req, res, next) => {
  res.status(httpStatus.NOT_FOUND)
  res.json({
    'message': 'Not Found'
  })
  res.end()
}

// handle errors
exports.handleError = (err, req, res, next) => {
  res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR)
  res.json({
    message: err.message,
    extra: err.extra,
    errors: err
  })
  res.end()
}
