const getServiceConfig = require('./getConfig');

module.exports = {
  dependencies: {
    'hello-world': {
      url: {
        hostname: 'localhost',
        protocol: 'https',
      },
      timeout: 20000,
    },
  },
  logger: {
    transports: {
      console: {
        level: 'info',
        preset: 'prod',
      },
      http: {
        host: 'localhost',
        port: 1000,
        level: 'critical',
      },
    },
    httpRequest: {
      logHeaders: false,
      logBody: false,
    },
  },
  services: {
    purchaseTransactions: getServiceConfig('hello-world', {
      url: {
        pathname: '/hello_world',
      },
    }),
  },
  tunnels: false,
  port: 3000,
  coverage: false,
  tracing: {
    enabled: true,
    debug: false,
  },
};
