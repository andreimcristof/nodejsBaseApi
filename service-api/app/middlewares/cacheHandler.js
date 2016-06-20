module.exports = {
	addNoCacheHeaders: function (request, response, next) {
		response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
		response.setHeader("Pragma", "no-cache");
		response.setHeader("Expires", "0");
		
		next();
	}
};