

module.exports = function (app) {
    const controller = require('../controllers/cv.controller')

    
    app.post('/api/cv/:jobId/upload', controller.uploadCV);

}