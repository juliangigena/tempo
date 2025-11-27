/* eslint-disable max-len */
const {
  executeQuery,
} = require('../../../infrastructure/database/baseOracleRepository');

async function getSummaryBy(accountId, dateFrom, dateThru, resumhis, resumpro) {
  let result;
  const datos = [];
  if (resumhis) {
    const historical = true;
    result = await executeQuery(accountId, dateFrom, dateThru, historical);
    if (!isObjEmpty(result)) {
      for (let i = 0; i < result.rows.length; i++) {
        const string = result.rows[i].toString().split(',');
        datos.push({
          dni: string[0],
          archivo: string[1],
          fecha_vto: string[2],
        });
      }
    }
  }
  if (resumpro) {
    const historical = false;
    result = await executeQuery(accountId, dateFrom, dateThru, historical);
    if (!isObjEmpty(result)) {
      // recorro el resultado y envio en formato json
      for (let i = 0; i < result.rows.length; i++) {
        const string = result.rows[i].toString().split(',');
        datos.push({
          dni: string[0],
          archivo: string[1],
          fecha_vto: string[2],
        });
      }
    }
  }
  return datos;
}

function isObjEmpty(obj) {
  for (const prop in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(prop)) return false;
  }

  return true;
}
module.exports = {
  getSummaryBy,
};
