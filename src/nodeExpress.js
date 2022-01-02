const express = require('express');
const resPrototype = require('express/lib/response.js');

resPrototype.afterSend = function afterSend(promiseOrFunction) {
  if (typeof promiseOrFunction === 'function') {
    setTimeout(promiseOrFunction, 0);
  }
  return this;
};

module.exports = express;
