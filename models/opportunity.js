'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const timestamps = require('mongoose-timestamp');

const OpportunitySchema = new Schema({
    dateFrom: Date,
    dateTo: Date,
    name: String,
    skills: Array
});

//add createdAt, updatedAt
OpportunitySchema.plugin(timestamps);

module.exports = mongoose.model('Opportunity', OpportunitySchema);
