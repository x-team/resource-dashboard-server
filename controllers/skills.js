'use strict';

const Skill = require('../models/skill');

module.exports = {
  index(request, reply) {
      return reply(Skill.find());
  },
  show(request, reply) {},
  create(request, reply) {
      let name = request.payload.name;
      let tags = request.payload.tags;

      Skill.create({
          name: name,
          tags: typeof tags === 'string' ? tags.split(',') : []
      }, (err, skill) => {
          if (err) {
              return reply(new Error(err));
          }
          return reply(skill);
      });
  },
  update(request, reply) {},
  destroy(request, reply) {}
};
