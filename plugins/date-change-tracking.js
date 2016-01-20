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
                let historyField = this[historyLocation];
                let lastUpdated = _.sortBy(historyField, 'version').pop();
                if(!lastUpdated) {
                    return null;
                }
                return lastUpdated.value;
            })
            .set(function(val) {
                if(!val && fieldObj.required) {
                    return this.invalidate(fieldObj.field, fieldObj.required);
                }
                let historyField = this[historyLocation];
                let lastUpdated = _.sortBy(historyField, 'version').pop() || {
                    version: 0,
                    value: null
                };
                let valueRemainedEmpty = val === null && lastUpdated.value === null;
                let valueDidntChange = moment(val).isSame(lastUpdated.value, 'day');
                if(valueRemainedEmpty || valueDidntChange) {
                    return;
                }
                let newVersionNumber = lastUpdated.version + 1;
                historyField.push({
                    version: newVersionNumber,
                    created_at: new Date(),
                    value: val
                });
            });

    });
};
