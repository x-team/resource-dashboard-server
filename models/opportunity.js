'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');
const moment = require('moment');
const DateChangeTrackingPlugin = require('../plugins/date-change-tracking');

const OpportunitySchema = new Schema({
    name: {
        type: String,
        required: 'Name is required'
    },


    skills: Array
}, {
    toObject: {
        virtuals: true
    }
});

//add createdAt, updatedAt
OpportunitySchema.plugin(timestamps);

OpportunitySchema.plugin(DateChangeTrackingPlugin, {
    fields: [
        {field: 'dateFrom', required: 'Date From is required', validate: [earlierThanDateTo, 'Date to must be greater than Date from']},
        {field: 'dateTo', required: 'Date To is required'}
    ]
});

function earlierThanDateTo(value) {
    return moment(value).isBefore(this.dateTo);
}

module.exports = mongoose.model('Opportunity', OpportunitySchema);
