
function initRouters(app) {
    require('./cv.route')(app);
    require('./job.route')(app);
    

 }
 
 module.exports = initRouters;