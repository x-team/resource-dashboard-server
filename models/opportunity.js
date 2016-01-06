'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OpportunitySchema = new Schema({
    dateFrom: Date,
    dateTo: Date,
    name: String,
    skills: Array
});

module.exports = mongoose.model('Opportunity', OpportunitySchema);
