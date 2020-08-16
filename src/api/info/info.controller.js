const { Router } = require('express');
const { index, status } = require('./info.view');

module.exports = Router()
  .get('/$', index)
  .get('/status', status);
