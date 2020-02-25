'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

var _appUtils = require('./app-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const mappings = _config2.default.has('mappings') ? _config2.default.get('mappings') : {};

const mapmap = new Map();

Object.keys(mappings).forEach(key => mapmap.set(key, _extends({ key }, mappings[key])));

const middleware = () => (req, res, next) => {
  if ((0, _appUtils.shouldIgnore)(req)) {
    return next();
  }
  // remove a leading slash if there is any
  const reqUrl = req.url.startsWith('/') ? req.url.substr(1) : req.url;
  const key = reqUrl.split('/')[0];
  if (mappings.has(key)) {
    const mapping = mappings.get(key);
    const conf = {
      key: key,
      dir: mapping.dir || key,
      host: mapping.host,
      matchHeaders: mapping.matchHeaders || false,
      matchProps: mapping.matchProps === false ? false : mapping.matchProps || true,
      ignoreProps: mapping.ignoreProps,
      contentType: mapping.contentType,
      noproxy: mapping.noproxy,
      nocache: mapping.nocache,
      touchFiles: mapping.touchFiles,
      delay: mapping.delay,
      matchPropsRecursive: mapping.matchPropsRecursive || false,
      secure: mapping.hasOwnProperty('secure') ? mapping.secure : true
    };
    req.conf = conf;
    req.urlToProxy = reqUrl.replace(key, '');
    req.secureEnabled = conf.secure;

    return next();
  }
  console.log('WARN: No mapping found for ' + key);
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.write('No proxy mapping found for this URL.');
  res.end();
};

middleware.mappings = mapmap;
middleware.bodyParserConfig = { type: req => !(0, _appUtils.shouldIgnore)(req) };

exports.default = middleware;