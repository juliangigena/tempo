const English = require('yadda').localisation.English;
const request = require('@tn-golden-api/functional-tests/src/superagentWrapper');
const generateToken = require('@tn-golden-api/functional-tests/src/tokenGenerator');

module.exports = English.library()
  .given('un usuario visita', function () {
    this.ctx.account_id = '13268413';
  })
  .when('hago una petición al componente Hello World', async function () {
    const tokenValue = `Bearer ${generateToken(this.ctx.account_id)}`;
    this.ctx.response = await request(this.ctx.serviceUrl)
      .get(`/hello_world`)
      .set('Authorization', tokenValue);
  })
  .then('recibo una respuesta positiva', function () {
    expect(this.ctx.response.status).to.equal(200);
  });
