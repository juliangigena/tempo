const application = new (require('../index'))();

module.exports = {
  handler: application.getHandler(),
};
