var validate = require('express-validation');
var itemModelValidator = require('../middlewares/modelValidation/item.js');
module.exports = function (options) {

    // basic route
    options.router.get('/', function(request, response){
        response.status(200).send({
            "name": "itemService-api",
            "status" : "up"
        })
    })

    //read list
    options.router.get('/items', function (request, response) {
        options.services.itemService.readItems()
        .then(function (items) {
            response.status(200).json(items);
        })
        .catch(function (err) {
            response.status(500).send(err);
        });
    });

    //create (if model is valid)
    options.router.put('/item', [validate(itemModelValidator), function (request, response) {
        var itemObject = request.body;

        options.services.itemService.createItem(itemObject)
        .then(function (createditem) {
                response.status(200).json(createditem);
        })
        .catch(function(err){
            response.status(500).send(err);
        });
    }]);

    //create (if model is valid)
    options.router.patch('/item', [validate(itemModelValidator), function (request, response) {
        var itemObject = request.body;

        options.services.itemService.updateItem(itemObject)
        .then(function (updatedItem) {
                response.status(200).json(updatedItem);
        })
        .catch(function(err){
            response.status(500).send(err);
        });
    }]);

    //read single
    options.router.get('/item/:id', function (request, response) {
        var itemId = request.params.id;

        options.services.itemService.readItem(itemId)
        .then(function (foundItem) {
            response.status(200).json(foundItem);
        })
        .catch(function(err){
            response.status(500).send(err);
        });
    });

    options.router.delete('/item/:id', function (request, response) {
        var itemId = request.params.id;
        options.services.itemService.deleteItem(itemId)
        .then(function (deletionResult) {
            response.status(200).json(deletionResult);
        })
        .catch(function(err){
            response.status(500).send(err);
        });
    });
};
