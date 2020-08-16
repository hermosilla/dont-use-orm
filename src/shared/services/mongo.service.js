// @Author: Antonio Hermosilla
// @Date: 2018.09.28
//
// mongo.service.js

const MongoClient = require('mongodb').MongoClient;
const debug = require('debug')('detritus-api');
const statuscode = require('http-status-codes');
const settings = require('../../settings');
const { InformationError } = require('../util');

/* eslint no-magic-numbers: off */

// Declare singleton key
const SINGLETON_KEY = Symbol.for('detritus.api.db');

const mongo = {

  /**
   * Configure Database Object
   *
   * @param {Object} database Database
   */
  configureSingleton(database) {
    global[SINGLETON_KEY].database = database;
    global[SINGLETON_KEY].db = settings.mongo.db ? database.db(settings.mongo.db) : database;
    global[SINGLETON_KEY].active = true;
  },

  /**
   * Connect to database.
   */
  connect() {
    debug(`Connecting to database ${settings.mongo.uri}`);

    MongoClient.connect(settings.mongo.uri, settings.mongo.options,
                        (err, database) => {
                          if (err) {
                            debug(`Error connecting to database - ${err.stack}`);
                            debug(`Try reconnecting to database in ${settings.mongo.options.connectTimeoutMS || 30000} ms`);
                            setTimeout(mongo.connect, settings.mongo.options.connectTimeoutMS || 30000);
                          } else {
                            database.on('close', mongo.onClose);
                            database.on('reconnect', () => { mongo.onReconnect(database); });

                            debug(`Database connection successfull - ${settings.mongo.uri}`);
                            mongo.configureSingleton(database);
                          }
                        });
  },

  /**
   * On close connection.
   */
  onClose() {
    debug(`Database connection lost - ${settings.mongo.uri}`);
    global[SINGLETON_KEY].active = false;
  },

  /**
   * On reconnect
   * @param {Object} database Database
   */
  onReconnect(database) {
    debug(`Database reconnect successfull - ${settings.mongo.uri}`);
    mongo.configureSingleton(database);
  }
};

if (Object.getOwnPropertySymbols(global).indexOf(SINGLETON_KEY) === -1) {
  global[SINGLETON_KEY] = { active: false };
  mongo.connect();
}

module.exports = {
  mongo: global[SINGLETON_KEY],
  middleware: (req, res, next) => {
    const mongo = require('./mongo.service').mongo;
    if (mongo.active) {
      req.db = mongo.db;
      next();
    } else {
      next(new InformationError('Database connection error', 'Database connection lost', statuscode.INTERNAL_SERVER_ERROR));
    }
  }
};
