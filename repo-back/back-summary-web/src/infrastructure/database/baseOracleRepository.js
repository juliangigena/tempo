const dbconfig = require('./dbconfig');
const dbconfigHisto = require('./dbconfigHisto');

/* eslint-disable max-len */
// eslint-disable-next-line no-unused-vars
const oracledb = require('oracledb');
oracledb.fetchAsBuffer = [oracledb.BLOB];

async function executeQuery(accountId, dateFrom, dateThru, historical) {
  let queryWithReplecaedVariables = '';
  // valido si viene fecha hasta, dependiendo de esto
  // se ejecuta una u otra query
  if (dateThru === undefined) {
    queryWithReplecaedVariables = GET_BY_ACCOUNT_ID_AND_DATE_QUERY.replace(
      /\$accountId\$/g,
      accountId
    ).replace(/\$dateFrom\$/g, dateFrom);
  } else {
    queryWithReplecaedVariables =
      GET_BY_ACCOUNT_ID_AND_BETWEEN_DATE_QUERY.replace(
        /\$accountId\$/g,
        accountId
      )
        .replace(/\$dateFrom\$/g, dateFrom)
        .replace(/\$dateThru\$/g, dateThru);
  }

  const oracleDbResult = execute(queryWithReplecaedVariables, historical);
  return oracleDbResult;
}

const execute = async (query, historical) => {
  let connection;
  let result;
  try {
    if (!historical) {
      connection = await oracledb.getConnection(dbconfig);
    } else {
      connection = await oracledb.getConnection(dbconfigHisto);
    }
    result = await connection.execute(query);
  } catch (err) {
    console.log('error: ', err);
    return err;
  } finally {
    if (connection != null) await connection.close();
  }

  return result;
};

const GET_BY_ACCOUNT_ID_AND_DATE_QUERY = `
SELECT RCA_RES_TIT_DOC_NUMERO, RCA_ARCHIVO, RCA_RES_FECHA_VENCIMIENTO FROM RESUMEN.RESUMENES_CUENTA_ARCHIVOS
      WHERE RCA_RES_TIT_DOC_NUMERO = $accountId$ AND
      RCA_RES_FECHA_VENCIMIENTO = to_date('$dateFrom$','yyyy-MM-dd')
`;
const GET_BY_ACCOUNT_ID_AND_BETWEEN_DATE_QUERY = `
SELECT RCA_RES_TIT_DOC_NUMERO, RCA_ARCHIVO, RCA_RES_FECHA_VENCIMIENTO FROM RESUMEN.RESUMENES_CUENTA_ARCHIVOS
      WHERE RCA_RES_TIT_DOC_NUMERO = $accountId$ AND
      RCA_RES_FECHA_VENCIMIENTO >= to_date('$dateFrom$','yyyy-MM-dd') AND
      RCA_RES_FECHA_VENCIMIENTO <= to_date('$dateThru$','yyyy-MM-dd')
`;
module.exports = {
  executeQuery,
};
