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
    // TODO: do something with encoding?
    this._workerResolver(
      new Response(data, { status: this.statusCode, headers: this._headers })
    );
    this._wasResponseSent = true;
    this.emit('finish');
    return this;
  }
}

module.exports = ServerResponse;
