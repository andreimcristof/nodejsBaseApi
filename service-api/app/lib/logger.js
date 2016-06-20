const logSingleRequest = require('morgan');

module.exports = {
    //this disables console.log for production environment so that output logs are not unnecessarily spammed
    //it will still work in development; for production, ideally log ONLY errors, by using console.error()
    logOnlyErrorsInProduction : function (router){
        if(process.env.ENVIRONMENT_LEVEL === 'prod'){
            console.log = function() {};
        }else {
            router.all('*', [logSingleRequest('short')])
        }
    }
}
