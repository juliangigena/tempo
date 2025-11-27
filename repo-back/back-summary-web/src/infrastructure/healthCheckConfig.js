const url = require('url');
const config = require('config');

module.exports = {
  api: [
    {
      url:
        url.format(config.get('dependencies.hello-world.url')) +
        '/api/health/readiness',
      method: 'GET',
      expectedStatusCode: 200,
    },
  ],
};
