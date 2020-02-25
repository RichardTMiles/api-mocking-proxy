'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.read = read;
exports.write = write;

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _fs = require('fs');

var _path = require('path');

var _pify = require('pify');

var _pify2 = _interopRequireDefault(_pify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const writep = (0, _pify2.default)(_fs.writeFile);
const readp = (0, _pify2.default)(_fs.readFile);
const accessp = (0, _pify2.default)(_fs.access);
const mkdirpp = (0, _pify2.default)(_mkdirp2.default);

function read(path) {
  return accessp(path, _fs.R_OK).then(() => readp(path, { encoding: 'utf8' })).catch(() => 'false').then(input => input || 'false'); // Empty files are cache miss
}

function write(path, content) {
  console.log("Write Content To File < " + path + " > \n", content);
  return mkdirpp((0, _path.dirname)(path)).then(() => writep(path, content, { encoding: 'utf8', flag: 'w' }));
}