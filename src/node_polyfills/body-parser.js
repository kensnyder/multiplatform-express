const { parse } = require('qs');

function json(options) {
  if (options) {
    console.info(
      'cfw-real-express: options passed to express.json() body parser are not supported.'
    );
  }
  return async function json(req, res, next) {
    const contentType = req.headers['content-type'];
    if (/\bjson\b/i.test(contentType)) {
      try {
        req.body = await req._workerRequest.json();
      } catch (err) {
        return next(err);
      }
    }
    next();
  };
}

function raw(options) {
  if (options) {
    console.info(
      'cfw-real-express: options passed to express.raw() body parser are not supported.'
    );
  }
  return async function raw(req, res, next) {
    try {
      req.body = await req._workerRequest.text();
    } catch (err) {
      return next(err);
    }
    next();
  };
}

function text(options) {
  if (options) {
    console.info(
      'cfw-real-express: options passed to express.text() body parser are not supported.'
    );
  }
  return async function text(req, res, next) {
    const contentType = req.headers['content-type'];
    if (/\btext\b/i.test(contentType)) {
      try {
        req.body = await req._workerRequest.text();
      } catch (err) {
        return next(err);
      }
    }
    next();
  };
}

function urlencoded(options) {
  if (options) {
    console.info(
      'cfw-real-express: options passed to express.urlencoded() body parser are not supported.'
    );
  }
  return async function urlencoded(req, res, next) {
    const contentType = req.headers['content-type'];
    if (/\bwww-form-urlencoded\b/i.test(contentType)) {
      try {
        req.body = parse(await req._workerRequest.formData());
      } catch (err) {
        return next(err);
      }
    }
    next();
  };
}

module.exports = { json, raw, text, urlencoded };
