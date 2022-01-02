const os = require('os');

os.release = function release() {
  return 'cf-worker@' + global.COMPATIBILITY_DATE;
};
