'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _serveFavicon = require('serve-favicon');

var _serveFavicon2 = _interopRequireDefault(_serveFavicon);

var _path = require('path');

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _mappings = require('./mappings');

var _mappings2 = _interopRequireDefault(_mappings);

var _props = require('./props');

var _props2 = _interopRequireDefault(_props);

var _cacheMiddleware = require('./cache-middleware');

var _cacheMiddleware2 = _interopRequireDefault(_cacheMiddleware);

var _mockProxy = require('./mock-proxy');

var _mockProxy2 = _interopRequireDefault(_mockProxy);

var _delayMiddleware = require('./delay-middleware');

var _delayMiddleware2 = _interopRequireDefault(_delayMiddleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var appRoot = (0, _path.join)(__dirname, '..');

// Initialization
var app = (0, _express2.default)();
app.use((0, _serveFavicon2.default)((0, _path.join)(appRoot, 'public', 'favicon.ico')));
app.use((0, _morgan2.default)('dev'));
app.use(_bodyParser2.default.raw(_mappings2.default.bodyParserConfig));
// Setup proxy middleware
app.use((0, _mappings2.default)());
app.use((0, _delayMiddleware2.default)());
app.use((0, _props2.default)());
app.use((0, _cacheMiddleware2.default)());
app.use((0, _mockProxy2.default)());

app.use(_bodyParser2.default.json());
app.use(_express2.default.static((0, _path.join)(appRoot, 'public')));

// View engine setup
app.set('views', (0, _path.join)(appRoot, 'views'));
app.set('view engine', 'ejs');

/* Routing */
// GET home page
app.get('/', (req, res) => {
  res.render('index', { title: 'API Mocking Proxy Server', mappings: Array.from(_mappings2.default.mappings.values()) });
});

exports.default = app;