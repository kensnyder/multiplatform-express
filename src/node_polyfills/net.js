const isIp = require('is-ip');

const noop = () => {};

const net = {
  createServer: noop,
  createConnection: noop,
  connect: noop,
  isIP: string => isIp.version(string) || 0,
  isIPv4: isIp.v4,
  isIPv6: isIp.v6,
};

module.exports = net;
