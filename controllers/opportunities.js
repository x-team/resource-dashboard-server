'use strict';

const Opportunity = require('../models/opportunity');

module.exports = {
    index(request, reply) {
        return reply(Opportunity.find());
    },

    show(request, reply) {
        let id = encodeURIComponent(request.params.id);

        Opportunity.findById(id, (err, opportunity) => {
            if (err) {
                return reply(new Error(err));
            }
            return reply(opportunity);
        });
    },

    create(request, reply) {
        Opportunity.create({
            name: request.payload.name,
            dateFrom: request.payload.dateFrom,
            dateTo: request.payload.dateTo,
            skills: request.payload.skills
        }, (err, opportunity) => {
            if (err) {
                return reply(new Error(err));
            }
            return reply(opportunity);
        });
    },

    update(request, reply) {
        let id = encodeURIComponent(request.params.id);

        Opportunity.findById(id, (err, opportunity) => {
            if (err) {
                return reply(new Error(err));
            }

            Object.assign(opportunity, {
                name: request.payload.name,
                dateFrom: request.payload.dateFrom,
                dateTo: request.payload.dateTo,
                skills: request.payload.skills
            });

            opportunity.save((err, opportunity) => {
                if (err) {
                    return reply(new Error(err));
                }
                return reply(opportunity);
            });
        });
    },

    destroy(request, reply) {
        let id = encodeURIComponent(request.params.id);

        Opportunity.findByIdAndRemove(id, (err, opportunity) => {
            if (err) {
                return reply(new Error(err));
            }
            return replay();
        });
    }
};
