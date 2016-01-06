'use strict';

const jsonApi = require('../helpers/jsonApi.js');
const Opportunity = require('../models/opportunity');

module.exports = {
    index(request, reply) {
        Opportunity.find({}, (err, opportunities) => {
            if(err) {
                return reply(new Error(err));
            }

            opportunities = opportunities.map((opportunity) => {
                return jsonApi.mongoosetoJsonApiObject(opportunity, 'opportunity')
            });

            reply({data: opportunities});
        });
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
        let data = request.payload.data.attributes;
        Opportunity.create({
            name: data.name,
            dateFrom: data.dateFrom,
            dateTo: data.dateTo,
            skills: data.skills
        }, (err, opportunity) => {
            if (err) {
                return reply(new Error(err));
            }
            let result = jsonApi.mongoosetoJsonApiObject(opportunity, 'opportunity')
            return reply({data: result});
        });
    },

    update(request, reply) {
        let id = encodeURIComponent(request.params.id);
        let data = request.payload.data.attributes;

        Opportunity.findById(id, (err, opportunity) => {
            if (err) {
                return reply(new Error(err));
            }
            Object.assign(opportunity, {
                name: data.name,
                dateFrom: data['date-from'],
                dateTo: data['date-to'],
                skills: data.skills
            });

            opportunity.save((err, opportunity) => {
                if (err) {
                    return reply(new Error(err));
                }
                let result = jsonApi.mongoosetoJsonApiObject(opportunity, 'opportunity');
                return reply({data: result});
            });
        });
    },

    destroy(request, reply) {
        let id = encodeURIComponent(request.params.id);

        Opportunity.findByIdAndRemove(id, (err, opportunity) => {
            if (err) {
                return reply(new Error(err));
            }
            return reply().code(204)
        });
    }
};
