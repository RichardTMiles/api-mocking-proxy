'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  const server = _config2.default.has('server') ? _config2.default.get('server') : {};

  const port = server.port || 8088;
  const host = server.host || 'localhost';
  console.log('Starting server: [http://%s:%s]', host, port);
  _index2.default.listen(port, host);
};

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }