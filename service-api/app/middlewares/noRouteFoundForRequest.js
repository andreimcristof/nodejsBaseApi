module.exports =
  {
    terminateRequest: function (request, response) {
      console.error("Unhandled request at "+request.originalUrl);
      response.status(404).json({ 'message': 'Resource ' + request.originalUrl + ' is not available.'});
   }
 };
