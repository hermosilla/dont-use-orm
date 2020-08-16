/*
 * This file is part of the DontuseORM distribution (https://github.com/hermosilla/dont-use-orm.git).
 * Copyright (c) 2020 Antonio Hermosilla.
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


const figlet = require('figlet');
const debug = require('debug')('dontuseorm');
const settings = require('./settings');
const mysqlService = require('./shared/services/mysql.service');
const { AppExpress } = require('./app-express');

const dontuseorm = {

  server: null,

  /**
   * Init dontuseorm app
   */
  run() {
    figlet(settings.name, function(err, data) {
      if (!err) {
        debug(data);
        debug('                                               @Hermosilla');
      }

      mysqlService.connect();

      const app = AppExpress.create();

      app.set('port', settings.port);
      dontuseorm.server = app.listen(settings.port);
      dontuseorm.server.on('error', dontuseorm.onError);
      dontuseorm.server.on('listening', dontuseorm.onListening);
    });
  },

  /**
   * Event listener for HTTP server "error" event.
   * @param {Object} error Información de error.
   */
  onError(error) {

    if (error.syscall !== 'listen') { throw error; }
    var bind = typeof settings.port === 'string' ? 'Pipe ' + settings.port : 'Port ' + settings.port;

    // Handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        debug(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        debug(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  },

  /**
   * On listening express server.
   */
  onListening() {
    var addr = dontuseorm.server.address();
    var bind = typeof addr === 'string' ?
      'pipe ' + addr :
      'port ' + addr.port;

    debug(`${settings.name} server listening on ${bind}`);
    debug(`${settings.name} server started in ${settings.env} mode`);
  }
};

module.exports = { run: dontuseorm.run, server: dontuseorm.server };
