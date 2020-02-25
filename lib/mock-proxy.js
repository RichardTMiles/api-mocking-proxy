'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _pify = require('pify');

var _pify2 = _interopRequireDefault(_pify);

var _typeIs = require('type-is');

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

var _cacher = require('./cacher');

var _cacher2 = _interopRequireDefault(_cacher);

var _appUtils = require('./app-utils');

var _cli = require('./cli');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const proxyConfig = _config2.default.has('proxy') ? _config2.default.get('proxy') : {};
const timeout = proxyConfig.timeout || 5000;
const disabled = !!proxyConfig.disable;

// Add OPTIONS convenience wrapper
_request2.default.options = (opts, callback) => {
  opts.method = 'OPTIONS';
  return (0, _request2.default)(opts, callback);
};

const requestp = (0, _pify2.default)(_request2.default, { multiArgs: true });

const eh = res => err => (0, _appUtils.errorHandler)(res, err);

const responseHandler = (req, res) => (_ref) => {
  var _ref2 = _slicedToArray(_ref, 2);

  let retRes = _ref2[0],
      body = _ref2[1];

  // payload prepended with text so backwards compatibility checks do not fail
  var data = {
    payload: 'Original request body :: ' + JSON.stringify(req.props),
    code: retRes.statusCode,
    headers: retRes.headers,
    body: body
  };
  _cacher2.default.set(req, data).then(() => (0, _appUtils.passthru)(res, data), eh(res));
};

const middleware = () => (req, res, next) => {
  if ((0, _appUtils.shouldIgnore)(req)) {
    return next();
  }
  if (disabled || req.conf.noproxy) {
    res.writeHead(204);
    res.end();
    return;
  }
  const url = req.conf.host.replace(/\/+$/, "") + "/" + req.urlToProxy.replace(/^\/+/, "");

  const method = req.method.toLowerCase();
  const urlConf = { url, timeout, headers: req.headers };
  if (urlConf.headers['accept-encoding'] && urlConf.headers['accept-encoding'] === 'gzip') {
    urlConf.gzip = true;
  }
  // Remove encoding because we've processed the body already.
  delete urlConf.headers['content-encoding'];
  // Reset host
  delete urlConf.headers.host;
  if ((0, _typeIs.hasBody)(req)) {
    urlConf.body = req.body;
  }

  console.log("urlConf", urlConf);

  // This fetches the request then passes data to response handler
  (0, _cli.temporarilyDisableSSLSecurity)(req.secureEnabled, () => requestp[method](urlConf)).then(responseHandler(req, res));
};

exports.default = middleware;