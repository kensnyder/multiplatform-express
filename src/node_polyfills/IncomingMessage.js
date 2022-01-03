const { parse } = require('qs');

/**
 *
 */
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

module.exports = IncomingMessage;
