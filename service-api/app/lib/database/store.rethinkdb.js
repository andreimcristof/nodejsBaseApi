var promise = require('bluebird');
var r = require('rethinkdb');

var rethinkdbStore = function (options) {
    this.options = options;
    this.rethinkHandler = r;
    this.items = this.rethinkHandler.table(this.options.config.defaultTable);
    this.updateInsteadOfInsertIfRowAlreadyExists = { conflict: "update" };
};

rethinkdbStore.prototype.connectToDb = function () {
    var self = this;
    return new promise(function (resolve, reject) {

        self.rethinkHandler.connect(self.options.config, function (err, connection) {
            if (err) {
                console.error(err);
                reject(err);
            }
            resolve(connection);
        });
    });
};

rethinkdbStore.prototype.readItem = function (id) {
    var self = this;
    return new promise(function (resolve, reject) {
        self.connectToDb()
            .then(function (conn) {
                self.items.get(id).run(conn, function (err, result) {
                    if(err){
                        console.error(err);
                        reject(err);
                    };

                    resolve(result);
                });
            })
            .catch(function (error) {
                console.error(error);
                reject(error);
            });
    });
};

rethinkdbStore.prototype.readItems = function () {
    var self = this;
    return new promise(function (resolve, reject) {
        return self.connectToDb()
            .then(function (conn) {
                self.items.run(conn, function (err, cursor) {
                    if(err){
                        console.error(err);
                        reject(err);
                    };

                    cursor.toArray(function (err, items) {
                        if(err){
                            console.error(err)
                            reject(err);
                        };

                        resolve(items);
                    });
                });
            })
            .catch(function (error) {
                console.error(error);
                reject(error);
            });
    });
};

rethinkdbStore.prototype.createItem = function (item) {
    var self = this;
    return new promise(function (resolve, reject) {
        self.connectToDb()
            .then(function (conn) {
                self.items.insert(item).run(conn, function (err, result) {
                    if(err){
                        console.error(err);
                        reject(err);
                    };

                    var insertedId = result.generated_keys[0];
                    self.items.get(insertedId).run(conn, function (err, result) {
                        if(err){
                            console.error(err);
                            reject(err);
                        };

                        resolve(result);
                    });
                });
            })
            .catch(function (err) {
                console.error(err);
                reject(err);
            });
    });
};

rethinkdbStore.prototype.deleteItem = function (id) {
    var self = this;
    return new promise(function (resolve, reject) {
        self.connectToDb()
            .then(function (conn) {
                self.items.get(id).delete().run(conn, function (err, result) {
                    if(err){
                        console.error(err);
                        reject(err);
                    };

                    resolve(result);
                });
            })
            .catch(function (error) {
                console.error(error);
                reject(error);
            });
    });
};

rethinkdbStore.prototype.updateItem = function (item) {
    var self = this;
    return new promise(function (resolve, reject) {
        self.connectToDb()
            .then(function (conn) {
                self.items.get(item.id).update(item).run(conn, function (err, updateResult) {
                    if(err){
                        console.error(err);
                        reject(err);
                    };

                    self.items.get(item.id).run(conn, function (err, getResult) {
                        if(err){
                            console.error(err);
                            reject(err);
                        };

                        resolve(getResult);
                    });
                });
            })
            .catch(function (err) {
                console.error(err);
                reject(err);
            });
    });
};

rethinkdbStore.prototype.ensureDatabaseExists = function(){
    var self = this;

    self.connectToDb()
    .then(function(conn){
        self.rethinkHandler.dbList().run(conn, function(err, databasesList){
            if (err) {
                console.error(err);
                return;
            };

            var databaseExists = databasesList.indexOf(self.options.config.db) > -1;
            if(!databaseExists){
                self.rethinkHandler.dbCreate(self.options.config.db).run(conn, function(err, result){
                    console.info('database: ' + self.options.config.db + " has been created.");
                    self.rethinkHandler.tableCreate(self.options.config.defaultTable).run(conn, function(err, result){
                        console.info('table: ' + self.options.config.defaultTable + " has been created in rethink store.");
                    });
                });
            } else {
                self.rethinkHandler.tableCreate(self.options.config.defaultTable).run(conn, function(err, result){
                    console.info('table: ' + self.options.config.defaultTable + " has been created in rethink store.");
                });
            }
        })
    })
};

module.exports = rethinkdbStore;
