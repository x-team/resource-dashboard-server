'use strict';

const Skill = require('../models/skill');

module.exports = {
    index(request, reply) {
        return reply(Skill.find());
    },

    show(request, reply) {
        let id = encodeURIComponent(request.params.id);

        Skill.findById(id, (err, skill) => {
            if (err) {
                return reply(new Error(err));
            }
            return reply(skill);
        });
    },

    create(request, reply) {
        Skill.create({
            name: request.payload.name,
            tags: (request.payload.tags || '').split(',')
        }, (err, skill) => {
            if (err) {
                return reply(new Error(err));
            }
            return reply(skill);
        });
    },

    update(request, reply) {
        let id = encodeURIComponent(request.params.id);

        Skill.findById(id, (err, skill) => {
            if (err) {
                return reply(new Error(err));
            }

            Object.assign(skill, {
                name: request.payload.name,
                tags: (request.payload.tags || '').split(',')
            });

            skill.save((err, skill) => {
                if (err) {
                    return reply(new Error(err));
                }
                return reply(skill);
            });
        });
    },

    destroy(request, reply) {
        let id = encodeURIComponent(request.params.id);

        Skill.findByIdAndRemove(id, (err, skill) => {
            if (err) {
                return reply(new Error(err));
            }
            return replay();
        });
    }
};
