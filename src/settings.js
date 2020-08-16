// const path = require('path');
const merge = require('lodash/merge');

const DEVELOP_PORT = 3000;
const PRODUCTION_PORT = 3000;

// const requireProcessEnv = (name) => {
//   if (!process.env[name]) {
//     throw new Error('You must set the ' + name + ' environment variable');
//   }
//   return process.env[name];
// };

const appConfig = {
  all: {
    name: 'DontUseORM',
    env: process.env.NODE_ENV || 'development',
    // jwtSecret: requireProcessEnv('JWT_SECRET'),
    ip: process.env.IP || '0.0.0.0',
    port: process.env.PORT || DEVELOP_PORT
  },
  test: {},
  development: {
    mysql: {
      host: 'trinity',
      user: 'helio',
      password: 'helio',
      database: 'helio',
      options: {
        autoReconnect: true,
        keepAlive: true,
        connectTimeoutMS: 5000,
        socketTimeoutMS: 60000,
      }
    }
  },
  production: {
    ip: process.env.IP || undefined,
    port: process.env.PORT || PRODUCTION_PORT
  }
};

module.exports = merge(appConfig.all, appConfig[appConfig.all.env]);
