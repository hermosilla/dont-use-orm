// @Author: Antonio Hermosilla
// @Date: 2018.09.28
//
// mongo.service.js

const mysql = require('mysql');
const debug = require('debug')('dontuseorm');
const httpStatus = require('http-status');
const settings = require('../../settings');
const { InformationError } = require('../utils/error');

/* eslint no-magic-numbers: off */

// Declare singleton key
const SINGLETON_KEY = Symbol.for('dontuseorm.api.db');

const mysqlService = {

  /**
   * Configure Database Object
   *
   * @param {Object} connection Database connection
   */
  configureSingleton(connection) {
    global[SINGLETON_KEY].connection = connection;
    // global[SINGLETON_KEY].db = settings.mongo.db ? database.db(settings.mongo.db) : database;
    global[SINGLETON_KEY].active = true;
  },

  /**
   * Connect to database.
   */
  connect() {

    debug(`Connecting to database ${settings.mysql.database} on ${settings.mysql.host}`);

    var connection = mysql.createConnection({
      host: settings.mysql.host,
      user: settings.mysql.user,
      password: settings.mysql.password,
      database: settings.mysql.database
    });

    connection.connect(function(err) {
      if (err) {
        debug(`[!] Warning: Error connecting to database - ${err.stack}`);
        debug(`Try reconnecting to database in ${settings.mysql.options.connectTimeoutMS || 30000} ms`);
        setTimeout(mysqlService.connect, settings.mysql.options.connectTimeoutMS || 30000);
      } else {
        connection.on('error', mysqlService.onError);
        debug(`Database connection successfull to MySQL on ${settings.mysql.host}:${settings.mysql.database}`);
        debug('Database connection id: ' + connection.threadId);
        mysqlService.configureSingleton(connection);
      }
    });
  },

  /**
   * On error connection.
   */
  onError() {
    global[SINGLETON_KEY].active = false;

    debug(`Database connection lost - ${settings.mysql.host}:${settings.mysql.database}`);
    debug('[!] Warning: Server has no database connection now');

    debug(`Try reconnecting to database in ${settings.mysql.options.connectTimeoutMS || 30000} ms`);
    setTimeout(mysqlService.connect, settings.mysql.options.connectTimeoutMS || 30000);
  }
};

module.exports = {
  mysql: global[SINGLETON_KEY],
  connect: () => {
    if (Object.getOwnPropertySymbols(global).indexOf(SINGLETON_KEY) === -1) {
      global[SINGLETON_KEY] = { active: false };
      mysqlService.connect();
    }
  },
  middleware: (req, res, next) => {
    const mysqlService = global[SINGLETON_KEY];
    if (mysqlService.active) {
      req.db = mysqlService.connection;
      next();
    } else {
      next(new InformationError('Database connection error', 'Database connection lost', httpStatus.INTERNAL_SERVER_ERROR));
    }
  }
};
