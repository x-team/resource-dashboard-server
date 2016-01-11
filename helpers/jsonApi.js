'use strict';
const decamelize = require('decamelize');

module.exports = {
    mongoosetoJsonApiObject(obj, type) {
        obj = obj.toObject();
        let id = obj._id;
        delete obj._id;
        let result = {};
        for(let key of Object.keys(obj)) {
            let processedKey = decamelize(key, '-');
            result[processedKey] = obj[key]
        }
        return {
            type,
            id,
            attributes: result
        };
    }
};
