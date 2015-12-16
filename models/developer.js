'use strict';

const request = require('request');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeveloperSchema = new Schema({
    name: String,
    address: String,
    timezone: String
});

Object.assign(DeveloperSchema.methods, {
    fetchGeocode(address = '') {
        return new Promise((resolve, reject) => {
            request.get({
                url: 'https://maps.googleapis.com/maps/api/geocode/json',
                qs: {
                    address: address.split(' ').join('+')
                },
                json: true
            }, (err, res, body) => {
                if (err) reject(err);
                try {
                    resolve({
                        lat: body.results[0].geometry.location.lat,
                        lng: body.results[0].geometry.location.lng
                    });
                } catch (e) {
                    reject(e);
                }
            });
        });
    },

    fetchTimezone(geocode = {}) {
        return new Promise((resolve, reject) => {
            request.get({
                url: 'https://maps.googleapis.com/maps/api/timezone/json',
                qs: {
                    location: `${geocode.lat},${geocode.lng}`,
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
        this.fetchGeocode(this.address)
            .then((geocode) => this.fetchTimezone(geocode))
            .then((timezone) => {
                this.timezone = timezone;
                next();
            })
            .catch(() => {
                this.timezone = 'America/Los_Angeles';
                next();
            });
    } else {
        next();
    }
});

module.exports = mongoose.model('Developer', DeveloperSchema);
