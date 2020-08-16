/*
 * This file is part of the Detritus distribution (https://gitlab.com/detritus/core/detritus-core.git).
 * Copyright (c) 2019 Antonio Hermosilla.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

const express = require('express');
const logger = require('morgan');
// const debug = require('debug')('detritus');
const httpStatus = require('http-status');
// const settings = require('./settings');
const apiResponse = require('./shared/utils/apiresponse');
const api = require('./api');

module.exports = (() => {

  /**
   * @typedef {Object} AppExpress
   * @property {Object} app Express app.
   * @property {Function} init Init app.
   * @property {Function} notFound Not found function.
   * @property {Function} errorHandler Error handler function.
   */

  /** @type {AppExpress} appExpress */
  const appExpress = {

    // Express APP
    app: undefined,

    init() {

      this.app = express();

      // Middleware

      this.app.use(logger('combined'));

      this.app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header(
          'Access-Control-Allow-Headers',
          'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, \
          Access-Control-Allow-Request-Method'
        );
        next();
      });

      this.app.use(api);    // Api

      this.notFound();      // 404 Error handler

      this.errorHandler();  // First error handler
    },

    notFound() {
      // catch 404 and forward to error handler
      this.app.use((req, res) => {
        res.status(httpStatus.NOT_FOUND).json(apiResponse.error(
          httpStatus.NOT_FOUND,
          httpStatus[httpStatus.NOT_FOUND],
          'Page not found'));
      });
    },

    errorHandler() {
      /* eslint-disable no-unused-vars */
      this.app.use((err, req, res, next) => {
        const status = res.statusCode !==
          httpStatus.OK ? res.statusCode : null || err.status || httpStatus.INTERNAL_SERVER_ERROR;
        res.status(status);
        res.json(apiResponse.error(status, err.message, req.app.get('env') === 'development' ? err : {}));
      });
    }
  };

  return {
    AppExpress: {
      /**
       * Factory method
       * @returns {Object} Create new object with prototype DetritusExpress
       */
      create() {
        /** @type {AppExpress} */
        const expressApp = Object.create(appExpress);

        expressApp.init();
        return expressApp.app;
      }
    }
  };

})();
