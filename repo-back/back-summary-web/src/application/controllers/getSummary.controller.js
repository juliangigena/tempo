/* eslint-disable */
const moment = require('moment');
const getSummary = require('../../domain/summary/repositories/summary.respository');
const requiredValidator = require('./validators/required.validator');
exports.get = async (req, res) => {
  const { accountId, dateFrom, dateThru } = req.params;
  const validate = await requiredValidator.validate(
    accountId,
    dateFrom,
    dateThru
  );
  if (validate) {
    return res.status(400).json({
      datos: validate,
    });
  }

  const fecha = await loadDates();

  let resumhis = false;
  let resumpro = false;

  switch (true) {
    case dateFrom <= fecha && dateThru >= fecha:
      resumhis = true;
      resumpro = true;
      break;
    case dateFrom <= fecha:
      resumhis = true;
      break;
    case dateFrom >= fecha:
      resumpro = true;
      break;
  }

  try {
    const resultado = await getSummary.getSummaryBy(
      accountId,
      dateFrom,
      dateThru,
      resumhis,
      resumpro
    );
    // si no hay resumenes para ese periodo, envio el mensaje indicando
    if (isObjEmpty(resultado)) {
      return res.status(200).json({
        resultado: [
          {
            datos: "No hay resumen para ese titular en periodo/vto",
          },
        ],
      });
    }
    return res.status(200).json({
      resultado,
    });
  } catch (err) {
    return res.status(500).json({
      datos: err,
    });
  }
};

function isObjEmpty(obj) {
  for (const prop in obj) {
    // eslint-disable-next-line
    if (obj.hasOwnProperty(prop)) return false;
  }
  return true;
}

function loadDates() {
  let fecha = moment().format("YYYY-MM-DD");
  const day = parseInt(fecha.split("-")[2]);
  if (day >= 26) {
    fecha = moment().add(1, 'M').format('YYYY-MM-10');
  }
  return moment(fecha).subtract(2, 'y').format('YYYY-MM-10');
}
