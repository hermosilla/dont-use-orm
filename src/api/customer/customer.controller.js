const { Router } = require('express');
const { list, getById, insert, update, del } = require('./customer.view');

module.exports = Router()
  .get('/$', list)
  .get('/:id', getById)
  .post('/$', insert)
  .put('/:id', update)
  .delete('/:id', del);
