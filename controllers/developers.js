'use strict';
const jsonApi = require('../helpers/jsonApi.js');
const Developer = require('../models/developer');

module.exports = {
    index(request, reply) {
        Developer.find({}, (err, developers) => {
            developers = developers.map((developer) => {
                return jsonApi.mongoosetoJsonApiObject(developer, 'developer');
            });
            reply({data: developers});
        });
    },

    show(request, reply) {
        let id = encodeURIComponent(request.params.id);

        Developer.findById(id, (err, developer) => {
            if (err) {
                return reply(new Error(err));
            }
            return reply(developer);
        });
    },

    create(request, reply) {
        Developer.create({
            availableDate: request.payload.availableDate,
            name: request.payload.name,
            firstName: request.payload.firstName,
            lastName: request.payload.lastName,
            createdAt: request.payload.createdAt,
            updatedAt: request.payload.updatedAt,
            profileUrl: request.payload.profileUrl,
            imageUrl: request.payload.imageUrl,
            address: request.payload.address,
            location: request.payload.location,
            timezone: request.payload.timezone,
            rate: request.payload.rate,
            skills: request.payload.skills
        }, (err, developer) => {
            if (err) {
                return reply(new Error(err));
            }
            return reply(developer);
        });
    },

    update(request, reply) {
        let id = encodeURIComponent(request.params.id);
        let data = request.payload.data.attributes;

        Developer.findById(id, (err, developer) => {
            if (err) {
                return reply(err).code(400);
            }

            Object.assign(developer, {
                availableDate: data['available-date'],
                rate: data.rate
            });

            developer.save((saveError, developer) => {
                if (saveError) {
                    return reply({errors: saveError.errors}).code(400);
                }

                let result = jsonApi.mongoosetoJsonApiObject(developer, 'developer');
                return reply({data: result});

            });
        });
    },

    destroy(request, reply) {
        let id = encodeURIComponent(request.params.id);

        Developer.findByIdAndRemove(id, (err, developer) => {
            if (err) {
                return reply(new Error(err));
            }
            return replay();
        });
    }
};
