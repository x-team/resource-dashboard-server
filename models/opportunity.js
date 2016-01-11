'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');

const OpportunitySchema = new Schema({
    name: {
        type: String,
        required: 'Name is required'
    },
    dateFrom: {
        type: Date,
        validate: [earlierThanDateTo, 'Date to must be greater than Date from']
    },
    dateTo: Date,
    skills: Array
});

//add createdAt, updatedAt
OpportunitySchema.plugin(timestamps);

function earlierThanDateTo(value) {
    if(value && this.dateTo && value > this.dateTo) {
        return false;
    }
    return true;
}

module.exports = mongoose.model('Opportunity', OpportunitySchema);
