'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SkillSchema = require('./skill').Schema;

const OpportunitySchema = new Schema({
    dateFrom: Date,
    dateTo: Date,
    name: String,
    skills: [SkillSchema]
});

module.exports = mongoose.model('Opportunity', OpportunitySchema);
