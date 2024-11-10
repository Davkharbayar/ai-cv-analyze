

module.exports = function (app) {
    const controller = require('../controllers/job.controller')


    app.get('/api/job', controller.list);


    app.get('/api/job/:jobid', controller.detail);

}