var validateModel = require('joi');

module.exports = {
    body: {
        content: validateModel.string().required(),
        date: validateModel.object().required().keys({
            start: validateModel.date().optional(),
            end: validateModel.date().optional()
        })
    }
};
