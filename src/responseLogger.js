/**
 * Middleware that
 * Console logs in the format of [2022-01-02 13:49:52] GET my.workers.dev/api/v1/users HTTP/1.1 200 OK
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
    // log response info after res is sent
    res.on('finish', function () {
      const method = req.method.toUpperCase();
      const url = req.hostname + req.path;
      const msg = `${method} ${url} HTTP/1.1 ${res.statusCode} ${res.statusText}`;
      console.log(msg);
    });
    next();
  };
}
