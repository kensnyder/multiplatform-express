const http = require('../node_modules/stream-http/index.js');
const { parse } = require('qs');
const { v4: uuidv4 } = require('uuid');

class IncomingMessage {
  _workerInit(request) {
    this.method = request.method;
    this.headers = headersToObject(request.headers);
    this.url = request.url;
    const requestUrl = new URL(request.url);
    this.pathname = requestUrl.pathname;
    this.query = parse(requestUrl.search, { ignoreQueryPrefix: true });
    this._workerRequest = request;
    this.body = null;
    this.cf = request.cf;
    this.ip = this.headers['x-real-ip'];
    this.ips = [this.ip];
    this.protocol = 'https';
  }
}

function headersToObject(headers) {
  const obj = {};
  if (headers instanceof Headers) {
    for (const [name, value] of headers.entries()) {
      obj[name.toLowerCase()] = value;
    }
  }
  return obj;
}

class ServerResponse {
  _workerInit(event, resolver) {
    this.workerEvent = event;
    this.statusCode = 200;
    this.statusMessage = 'OK';
    this._headers = {};
    this._wasResponseSent = false;
    this._workerResolver = resolver;
    this._errors = [];
    this._warnings = [];
    this._new = null;
    this._pagination = null;
    this._afterSends = [];
  }
  setHeader(name, value) {
    this._headers[name] = value;
  }
  getHeader(name) {
    return this._headers[name];
  }
  // _finish() {}
  // assignSocket() {}
  // detachSocket() {}
  // writeContinue() {}
  // writeProcessing() {}
  // _implicitHeader() {}
  writeHead(statusCode, headers) {
    this.statusCode = statusCode;
    this._headers = headers;
  }
  // writeHeader() {}
  end(data, encoding) {
    if (this._wasResponseSent) {
      // already responded!
      return;
    }
    this._afterSends.forEach(fn => this.workerEvent.waitUntil(fn()));
    // TODO: do something with encoding?
    this._workerResolver(
      new Response(data, { status: this.statusCode, headers: this._headers })
    );
    this._wasResponseSent = true;
    return this;
  }
}

http.IncomingMessage = IncomingMessage;
http.ServerResponse = ServerResponse;

module.exports = http;
