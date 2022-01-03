const http = require('../../node_modules/stream-http/index.js');
const IncomingMessage = require('./IncomingMessage.js');
const ServerResponse = require('./ServerResponse.js');

http.IncomingMessage = IncomingMessage;
http.ServerResponse = ServerResponse;

module.exports = http;
