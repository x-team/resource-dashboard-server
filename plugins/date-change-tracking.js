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
    let historyLocation = `${options.field}History`
    schema.add({[historyLocation]: [ChangeTrackDateSchema]});
    schema.virtual(options.field)
    .get(function() {
        let lastUpdated = _.sortBy(this.availableDateHistory, 'version').pop();
        if(!lastUpdated) {
            return null;
        }
        return lastUpdated.value;
    })
    .set(function(val) {
        let lastUpdated = _.sortBy(this.availableDateHistory, 'version').pop() || {
            version: 0,
            value: null
        };
        let valueRemainedEmpty = val === null && lastUpdated.value === null;
        let valueDidntChange = moment(val).isSame(lastUpdated.value, 'day');
        if(valueRemainedEmpty || valueDidntChange) {
            return;
        }
        let newVersionNumber = lastUpdated.version + 1;
        this.availableDateHistory.push({
            version: newVersionNumber,
            created_at: new Date(),
            value: val
        });
    });
};
