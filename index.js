module.exports = getExpress();

function getExpress() {
  if (process.version) {
    // real node
    return require('./src/nodeExpress.js');
  } else {
    // cloudflare workers
    return require('./src/cloudflareWorkersExpress.js');
  }
}
