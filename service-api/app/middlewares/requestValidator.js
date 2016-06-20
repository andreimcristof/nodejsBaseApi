module.exports =
  {
    validateContentType: function (request, response, next) {
      var hasPayload = request.method === 'PUT' || request.method === 'PATCH'  || request.method === 'POST';

      if (hasPayload && request.headers['content-type'] !== 'application/json') {
        var notAcceptable = 406;
        var errMsg = 'Content type must be application/json';
        return response.status(notAcceptable).send(errMsg);
      }
      
      if(typeof next !== "undefined"){
          next();
      }
    }
  };
