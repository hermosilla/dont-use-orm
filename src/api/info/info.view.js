const appinfo = require('./../../../package.json');

module.exports = {
  /**
   * Application info
   *
   * @param {Object} req Request
   * @param {Object} res Request
   */
  index: function(req, res) {
    delete appinfo.dependencies;
    delete appinfo.devDependencies;
    delete appinfo.scripts;
    delete appinfo.main;
    delete appinfo.keywords;
    res.json(appinfo);
  },

  /**
   * Vista principal
   *
   * @param {Object} req Request
   * @param {Object} res Request
   */
  status: function(req, res) {
    res.send({
      status: 'online'
    });
  }
};
