var
    express = require('express'),
    bodyParser = require('body-parser'),
    logger = require('./app/lib/logger.js'),
    bluebird = require("bluebird"),
    corsHandler = require('./app/middlewares/corsHandler.js'),
    cacheHandler = require('./app/middlewares/cacheHandler.js'),
    requestValidator = require('./app/middlewares/requestValidator.js'),
    itemService = require('./app/services/item.service.js'),
    rethinkdbStore = require('./app/lib/database/store.rethinkdb.js'),
    jsonConverter = require('./app/middlewares/jsonConverter.js'),
    noRouteFoundForRequest = require('./app/middlewares/noRouteFoundForRequest.js'),
    mockDbStore = require('./app/lib/database/store.mock.js');

var app = express();
app.use(bodyParser.json());

var router = express.Router();

var serviceConfig = {
    rethinkDbConfig: {
        host: '192.168.99.100',
        timeout: process.env.STORE_RETHINKDB_TIMEOUTINSECONDS || 20,
        db: process.env.STORE_RETHINKDB_DEFAULTDATABASE || 'itemDatabase',
        defaultTable: 'items',
        port: process.env.STORE_RETHINKDB_PORT || 28015
    },
    port: process.env.SERVICE_PORT || 1337,
    environmentLevel: process.env.ENVIRONMENT_LEVEL || 'prod'
}

router.all('*',
    corsHandler.allow,
    cacheHandler.addNoCacheHeaders,
    requestValidator.validateContentType
);
logger.logOnlyErrorsInProduction(router);

var dbStore = serviceConfig.environmentLevel === 'prod' ?
    new rethinkdbStore({ config: serviceConfig.rethinkDbConfig }) :
    new mockDbStore();
dbStore.ensureDatabaseExists();

require('./app/routes/item.js')({
    router: router,
    services: {
        itemService: new itemService({
            databaseStore: dbStore
        })
    }
});

app.use('/', router);
app.use(jsonConverter.responseErrorsAsJsonObjects);
app.use(noRouteFoundForRequest.terminateRequest);
app.listen(serviceConfig.port);
console.info('itemservice-api running on port ' + serviceConfig.port + '...');

module.exports.getApp = app;
