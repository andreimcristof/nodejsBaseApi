var Promise = require('bluebird');
var mockStore = function () { };

mockStore.prototype.readAll = function(){
    var noItemsInStore = [];
    return Promise.resolve(noItemsInStore);
};

mockStore.prototype.read = function(id){
    return Promise.resolve({id: id, content: 'test'});
};

mockStore.prototype.create = function (item) {
    return item;
};

mockStore.prototype.ensureDatabaseExists = function(){
    
}

module.exports = mockStore;
