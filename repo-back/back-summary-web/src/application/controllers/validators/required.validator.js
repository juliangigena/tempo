const _ = require('lodash');
exports.validate = async (accountId, dateFrom, dateThru) => {
  if (
    _.isEmpty(accountId) ||
    accountId == 0 ||
    accountId == '0' ||
    isNaN(accountId)
  ) {
    const error = new Error();
    return Object.assign(error, {
      code: 'bad_request',
      severity: 'MEDIUM',
      layer: 'domain',
      message: `accountId is mandatory`,
      status: 400,
    });
  }

  if (_.isEmpty(dateFrom) || dateFrom == 0) {
    const error = new Error();
    return Object.assign(error, {
      code: 'bad_request',
      severity: 'MEDIUM',
      layer: 'domain',
      message: `dateFrom is mandatory`,
      status: 400,
    });
  }

  if (_.isEmpty(dateThru) || dateThru == 0 || dateFrom > dateThru) {
    const error = new Error();
    return Object.assign(error, {
      code: 'bad_request',
      severity: 'MEDIUM',
      layer: 'domain',
      message: `dateFrom greatest dateThr`,
      status: 400,
    });
  }
};
