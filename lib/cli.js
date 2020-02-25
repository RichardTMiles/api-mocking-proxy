'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.temporarilyDisableSSLSecurity = undefined;

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _cacher = require('./cacher');

var _cacher2 = _interopRequireDefault(_cacher);

var _serve = require('./serve');

var _serve2 = _interopRequireDefault(_serve);

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* globals process */
const argv = (0, _minimist2.default)(process.argv.slice(2), { alias: { root: ['r', 'data'] } });

if (argv.root) {
  _cacher2.default.root = argv.root;
}

if (!_config2.default.has('mappings')) {
  console.log('You have no proxy mappings defined... create a default.toml file.');
  process.exit(0);
}

const temporarilyDisableSSLSecurity = exports.temporarilyDisableSSLSecurity = async function temporarilyDisableSSLSecurity(secureBool, next) {
  if (secureBool) {
    return next();
  }
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
  const returnResult = await next();
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = 1;
  return returnResult;
};

(0, _serve2.default)();