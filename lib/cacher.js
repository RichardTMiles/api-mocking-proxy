'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _appUtils = require('./app-utils');

var _files = require('./files');

var file = _interopRequireWildcard(_files);

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

var _path = require('path');

var _touch = require('touch');

var _touch2 = _interopRequireDefault(_touch);

var _pify = require('pify');

var _pify2 = _interopRequireDefault(_pify);

var _cachePersist = require('./cache-persist');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const cacheConfig = _config2.default.has('cache') ? _config2.default.get('cache') : {};
const dataRoot = (0, _path.resolve)(cacheConfig.dataRoot || 'data');
const disabled = !!cacheConfig.disable;
const touchFiles = !!cacheConfig.touchFiles;
const touchp = (0, _pify2.default)(_touch2.default);

const tap = function tap(fn) {
  for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    params[_key - 1] = arguments[_key];
  }

  return input => {
    return fn(input, ...params).then(() => input);
  };
};

const doTouch = (content, file, conf) => {
  if (!content && (touchFiles || conf.touchFiles)) {
    return touchp(file);
  }
  return Promise.resolve(false);
};

class Cacher {
  constructor() {
    this.root = dataRoot;
  }

  get(req) {
    const mockFile = (0, _appUtils.resolveMockPath)(req, this.root);
    if (disabled || req.conf.nocache) {
      return doTouch(false, mockFile, req.conf);
    }
    return file.read(mockFile).then(_cachePersist.parse).then(tap(doTouch, mockFile, req.conf));
  }

  set(req, data) {
    if (!data) {
      return Promise.reject(new Error('Invalid argument: data must be provided!'));
    }
    var mockPath = (0, _appUtils.resolveMockPath)(req, this.root);

    return file.write(mockPath, (0, _cachePersist.stringify)(data));
  }
}

exports.default = new Cacher();