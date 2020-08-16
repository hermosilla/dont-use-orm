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

const { InformationError } = require('../../shared/utils/error');
const { success } = require('../../shared/utils/apiresponse');
const httpStatus = require('http-status');

module.exports = {
  /**
   * List all
   *
   * @param {{db: Object}} req Request
   * @param {Object} res Request
   * @param {Object} next Next
   */
  list: function({ db }, res, next) {
    db.query({ sql: 'SELECT * FROM customer' }, (err, results, fields) => {
      if (err) {
        next(new InformationError(undefined, err.message, httpStatus.BAD_REQUEST));
      } else {
        res.json(success(results));
      }
    });
  },

  /**
   * Get by id
   *
   * @param {{db: Object, params: Object}} req Request
   * @param {Object} res Request
   * @param {Object} next Next
   */
  getById: function({ db, params }, res, next) {
    db.query({ sql: 'SELECT * FROM customer WHERE id = ?' }, params.id, (err, results, fields) => {
      if (err) {
        next(new InformationError(undefined, err.message, httpStatus.NOT_FOUND));
      } else {
        res.json(success(results));
      }
    });
  },

  /**
   * Add
   *
   * @param {{db: Object, body: Object}} req Request
   * @param {Object} res Request
   * @param {Object} next Next
   */
  insert: function({ db, body }, res, next) {
    db.query('INSERT INTO customer SET ?', body, (err, results, fields) => {
      if (err) next(new InformationError(undefined, err, httpStatus.BAD_REQUEST));
      else {
        res.json(success({ insertId: results.insertId }));
      }
    });
  },

  /**
   * Update
   *
   * @param {{db: Object, body: Object, params: Object}} req Request
   * @param {Object} res Request
   * @param {Object} next Next
   */
  update: function({ db, body, params }, res, next) {
    body.update_date = new Date();
    console.log(body.update_date);
    db.query('UPDATE customer SET ? WHERE id = ?', [body, params.id], (err, results) => {
      if (err) next(new InformationError(undefined, err, httpStatus.BAD_REQUEST));
      else {
        res.json(success({
          affectedRows: results.affectedRows,
          changedRows: results.affectedRows
        }));
      }
    });
  },

  /**
   * Delete
   *
   * @param {{db: Object, params: Object}} req Request
   * @param {Object} res Request
   * @param {Object} next Next
   */
  del: function({ db, params }, res, next) {

    db.query('DELETE FROM customer WHERE id = ?', params.id, (err, results, fields) => {
      if (err) next(new InformationError(undefined, err, httpStatus.BAD_REQUEST));
      else {
        res.json(success({ affectedRows: results.affectedRows }));
      }
    });
  },

};
