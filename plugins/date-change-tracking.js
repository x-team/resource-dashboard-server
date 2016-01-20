'use strict';

const _ = require('lodash');
const moment = require('moment');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChangeTrackDateSchema = new Schema({
    version: Number,
    value: Date,
    created_at: Date
});

module.exports = function lastModifiedPlugin (schema, options) {
    options.fields.forEach((fieldObj)=> {

        let historyLocation = `${fieldObj.field}History`
        schema.add({[historyLocation]: [ChangeTrackDateSchema]});

        schema.virtual(fieldObj.field)
            .get(function() {
                return _.chain(this[historyLocation]).sortBy('version').last().get('value').value() || null;
            })
            .set(function(val) {
                //validation checkings
                if(!val && fieldObj.required) {
                    return this.invalidate(fieldObj.field, fieldObj.required);
                }
                if(fieldObj.validate) {
                    let validate = fieldObj.validate[0];
                    if(!validate.apply(this, [val])) {
                        return this.invalidate(fieldObj.field, fieldObj.validate[1]);
                    }
                }

                let historyField = this[historyLocation];
                let lastUpdated = _.sortBy(historyField, 'version').pop() || {
                    version: 0,
                    value: null
                };

                let dateRemainedEmpty = val === null && lastUpdated.value === null;
                let dateDidntChange = moment(val).isSame(lastUpdated.value, 'day');
                if(dateRemainedEmpty || dateDidntChange) {
                    return;
                }
                historyField.push({
                    version: lastUpdated.version + 1,
                    created_at: new Date(),
                    value: val
                });
            });

    });
};
