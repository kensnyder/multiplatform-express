class Stats {}
const fs = {
  // used by ?
  ReadStream: ReadableStream,
  // used by etag/index.js(22) to check if something is instance of Stats
  Stats,
  // used by express/lib/view.js(178) in defining View.prototype.resolve
  statSync: () => false,
  // used by send/index.js(721) in sending file over http
  stat: async () => false,
  // used by mime/mime.js(52) in defining Mime.prototype.load for loading apache mime type list
  readFileSync: () => '',
};

module.exports = fs;

/*
https://nodejs.org/api/stream.html

const { Readable } = require('stream');
const fs = require('fs');

class ReadStream extends Readable {
  constructor(filename) {
    super();
    this.filename = filename;
    this.fd = null;
  }
  _construct(callback) {
    fs.open(this.filename, (err, fd) => {
      if (err) {
        callback(err);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }
  _read(n) {
    const buf = Buffer.alloc(n);
    fs.read(this.fd, buf, 0, n, null, (err, bytesRead) => {
      if (err) {
        this.destroy(err);
      } else {
        this.push(bytesRead > 0 ? buf.slice(0, bytesRead) : null);
      }
    });
  }
  _destroy(err, callback) {
    if (this.fd) {
      fs.close(this.fd, (er) => callback(er || err));
    } else {
      callback(err);
    }
  }
}
 */
