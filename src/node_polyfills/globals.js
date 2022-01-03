/*
> Object.keys(global)
  "scheduler",
  "caches",
  "crypto",
  "self",
  "ServiceWorkerGlobalScope",
  "kvStore",
  "fetch"
 */

global.location = { protocol: 'https:' };
global.fetch = (function (oldFetch) {
  return function fetch(...args) {
    if (typeof args[0] === 'object') {
      const { mode, credentials, ...rest } = args[0];
      args[0] = rest;
    }
    if (typeof args[1] === 'object') {
      const { mode, credentials, ...rest } = args[1];
      args[1] = rest;
    }
    return oldFetch.apply(global, args);
  };
})(global.fetch);

process.emitWarning = function emitWarning(warning, type, code, ctor) {
  let detail = '';
  let stack = '';
  let message = warning;
  if (typeof type === 'object') {
    code = type.code;
    ctor = type.ctor;
    type = type.type;
    detail = type.detail;
  }
  if (warning instanceof Error) {
    stack = warning.stack;
    message = warning.message;
  } else if (
    typeof warning === 'string' &&
    ctor &&
    typeof ctor.captureStackTrace === 'function'
  ) {
    stack = ctor.captureStackTrace();
  }
  type = type || 'Warning';
  const event = {
    name: type,
    message,
    code,
    stack,
    detail,
  };
  const toLog = (code ? `[${code}] ` : '') + `${type}: ${message}`;
  console.error(toLog);
  process.emit('warning', event);
};

process.version = global.COMPATIBILITY_DATE;
process.versions.node = null;
