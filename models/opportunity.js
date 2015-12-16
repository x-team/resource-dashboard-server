'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SkillSchema = require('./skill').Schema;

const OpportunitySchema = new Schema({
    name: {
      type: String,
      required: true
    },
    dateFrom: Date,
    dateTo: Date,
    tags: [SkillSchema]
});

module.exports = mongoose.model('Opportunity', OpportunitySchema);
