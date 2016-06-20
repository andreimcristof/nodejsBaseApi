function itemService(options) {
    this.options = options;
}

//although this service might seem redundant seeing as it just calls the database,
//in a real application a lot more actions would be executed here not just a database call. Hence, a dedicated service
//the real intention of this service is that it is testable, by injecting a mockStore when process.env.ENVIRONMENT_LEVEL === 'dev'
//so that only the logic in the service is being tested, and not a store.

itemService.prototype.readItem = function(itemId){
    return this.options.databaseStore.readItem(itemId);
};

itemService.prototype.readItems = function () {
    return this.options.databaseStore.readItems();
};

itemService.prototype.createItem = function (item) {
    return this.options.databaseStore.createItem(item);
};

itemService.prototype.deleteItem = function (id) {
    return this.options.databaseStore.deleteItem(id);
};

itemService.prototype.updateItem = function (item) {
    return this.options.databaseStore.updateItem(item);
};

module.exports = itemService;
