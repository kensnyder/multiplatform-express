// cloudflare workers
require('./node_polyfills/globals.js');
const http = require('http');
const express = require('express');
const appPrototype = require('express/lib/application.js');
const resPrototype = require('express/lib/response.js');

appPrototype.listen = function listen(...args) {
  const onReady = args.pop() || function () {};
  const app = this;
  app.isCfWorker = true;
  addEventListener('fetch', event => {
    return event.respondWith(
      new Promise(async resolve => {
        const req = new http.IncomingMessage();
        req._workerInit(event.request);
        const res = new http.ServerResponse(req);
        res._workerInit(event, resolve);
        res.req = req;
        const next = error => {
          if (error) {
            console.log(
              'final next: error = ' +
                (error.stack || error.message || String(error))
            );
            resolve(
              new Response(null, {
                status: 500,
              })
            );
          } else {
            console.log('final next: complete');
          }
        };
        // try {
        app(req, res, next);
        // } catch (error) {
        //   console.log('caught error: ' + error.stack || error.message);
        //   new Response(null, {
        //     status: 500,
        //   });
        // }
      })
    );
  });
  onReady.call(app);
};

resPrototype.afterSend = function afterSend(promiseOrFunction) {
  if (typeof promiseOrFunction === 'function') {
    this._afterSends.push(promiseOrFunction);
  } else {
    this.workerEvent.waitUntil(promiseOrFunction);
  }
  return this;
};

module.exports = express;
