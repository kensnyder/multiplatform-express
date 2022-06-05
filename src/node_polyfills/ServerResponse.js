const EventEmitter = require('events');
/**
 * This is the base class that express's "res" extends
 */
class ServerResponse extends EventEmitter {
  _workerInit(event, resolver) {
    this.workerEvent = event;
    this.statusCode = 200;
    this.statusMessage = 'OK';
    this._headers = {};
    this._wasResponseSent = false;
    this._workerResolver = resolver;
    this._afterSends = [];
  }
  setHeader(name, value) {
    this._headers[name] = value;
  }
  getHeader(name) {
    return this._headers[name];
  }
  removeHeader(name) {
    this._headers[name] = undefined;
    return this;
  }
  writeHead(statusCode, headers) {
    this.statusCode = statusCode;
    this._headers = headers;
  }
  end(data, encoding) {
    if (this._wasResponseSent) {
      // already responded!
      return;
    }
    this._afterSends.forEach(fn => {
      this.workerEvent.waitUntil(fn());
    });
    if (this.statusCode >= 300 && this.statusCode <= 399) {
      // data may be empty string or undefined, but by spec, you should pass null
      // passing an empty string will trigger CloudFlare Workers to issue an error
      data = null;
    }
    // TODO: do something with encoding?
    this._workerResolver(
      new Response(data, { status: this.statusCode, headers: this._headers })
    );
    this._wasResponseSent = true;
    this.emit('finish');
    this.emit('close');
    return this;
  }
}

module.exports = ServerResponse;
