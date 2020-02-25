'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cacher = require('./cacher');

var _cacher2 = _interopRequireDefault(_cacher);

var _appUtils = require('./app-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const middleware = () => (req, res, next) => {
  if ((0, _appUtils.shouldIgnore)(req)) {
    return next();
  }
  _cacher2.default.get(req).then(payload => {
    if (!payload) {
      // Not in cache, keep on moving.
      return next();
    }
    (0, _appUtils.passthru)(res, payload);
  }).catch(err => {
    console.log('Cache error', err);
    next();
  });
};

exports.default = middleware;