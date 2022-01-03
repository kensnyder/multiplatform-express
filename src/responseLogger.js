/**
 * Middleware that
 * Console logs in the following format:
 * "[2022-01-02 13:49:52] GET my.workers.dev/api/v1/users HTTP/1.1 200 OK"
 * @returns {undefined}
 */
function responseLogger() {
  return function (req, res, next) {
    if (req.app.isCfWorker) {
      // we are on wrangler
      // wrangler already logs this way
      next();
      return;
    }
    // we are on Node
    // output response info after res is sent
    res.once('finish', function (...args) {
      const method = req.method.toUpperCase();
      const status = `${res.statusCode} ${res.statusMessage}`;
      const date = new Date()
        .toJSON()
        .replace(/^([\d-]+)T([\d:]+).+$/, '$1 $2');
      const msg = `[${date}] ${method} ${req.path} HTTP/1.1 ${status}`;
      console.log(msg);
    });
    next();
  };
}

module.exports = responseLogger;
