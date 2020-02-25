'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _appUtils = require('./app-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ct = req => req.conf.contentType || req.headers['content-type'];

const middleware = () => (req, res, next) => {
  if ((0, _appUtils.shouldIgnore)(req)) {
    return next();
  }
  let bodyData = {};
  if (req.body) {
    const bodyStr = req.body.toString('utf8');

    try {
      if (ct(req) === 'application/json') {
        bodyData = JSON.parse(bodyStr);
      } else if (ct(req) === 'application/x-www-form-urlencoded') {
        bodyData = _querystring2.default.parse(bodyStr);
      }
    } catch (e) {}
  }
  req.props = _extends({}, req.query, bodyData);
  next();
};

exports.default = middleware;