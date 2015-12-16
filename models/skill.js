'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SkillSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    tags: Array
});

module.exports = mongoose.model('Skill', SkillSchema);
module.exports.Schema = SkillSchema;
