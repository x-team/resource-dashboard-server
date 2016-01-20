'use strict';

const request = require('request');
const mongoose = require('mongoose');
const DateChangeTrackingPlugin = require('../plugins/date-change-tracking');
const Schema = mongoose.Schema;

const DeveloperSchema = new Schema({
    name: String,
    firstName: String,
    lastName: String,
    createdAt: Date,
    updatedAt: Date,
    profileUrl: String,
    imageUrl: String,
    address: String,
    location: String,
    timezone: String,
    rate: Number,
    skills: Array
}, {
    toObject: {
        virtuals: true
    }
});

DeveloperSchema.plugin(DateChangeTrackingPlugin, {
    fields: [{field: 'availableDate'}]
});

Object.assign(DeveloperSchema.methods, {
    fetchLocation(address) {
        return new Promise((resolve, reject) => {
            request.get({
                url: 'https://maps.googleapis.com/maps/api/geocode/json',
                qs: {
                    address: (address || '').split(' ').join('+')
                },
                json: true
            }, (err, res, body) => {
                if (err) reject(err);
                try {
                    resolve(`${body.results[0].geometry.location.lat},${body.results[0].geometry.location.lng}`);
                } catch (e) {
                    reject(e);
                }
            });
        });
    },

    fetchTimezone(location) {
        return new Promise((resolve, reject) => {
            request.get({
                url: 'https://maps.googleapis.com/maps/api/timezone/json',
                qs: {
                    location: location,
                    timestamp: ~~(Date.now() / 1000)
                },
                json: true
            }, (err, res, body) => {
                if (err) reject(err);
                resolve(body.timeZoneId);
            });
        });
    }
});

DeveloperSchema.pre('save', function(next) {
    if (!this.timezone) {
        this.fetchLocation(this.address)
            .then((location) => {
                this.location = location;
                return this.fetchTimezone(location);
            })
            .then((timezone) => {
                this.timezone = timezone;
                next();
            })
            .catch(() => {
                next();
            });
    } else {
        next();
    }
});

module.exports = mongoose.model('Developer', DeveloperSchema);
