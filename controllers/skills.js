'use strict';

const Skill = require('../models/skill');

module.exports = {
  index(request, reply) {
      return reply(Skill.find());
  },
  show(request, reply) {},
  create(request, reply) {
      let name = request.payload.name;
      let tags = typeof request.payload.tags === 'string' ? request.payload.tags.split(',') : [];

      Skill.create({
          name: name,
          tags: tags
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
