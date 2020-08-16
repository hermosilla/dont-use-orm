const bodyParser = require('body-parser');
const { Router } = require('express');
const info = require('./info/info.controller');
const customer = require('./customer/customer.controller');
// const files = require('./files/files.controller');
const swaggerUi = require('swagger-ui-express');
const openapi = require('./openapi.json');
const router = Router();

router
  // Database middleware injector
  // .use(require('./shared/services/mongo.service').middleware)
  // .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .use(require('../shared/services/mysql.service').middleware)

  .use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapi))
  .use('/customers', customer)
  .use('/', info);
// .use('/files', info);

module.exports = router;
