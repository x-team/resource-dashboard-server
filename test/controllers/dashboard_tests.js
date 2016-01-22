'use strict';

const test = require('tape');
const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');
const mockgoose = require('mockgoose');
mockgoose(mongoose);

const server = require('../../index');
const Developer = require('../../models/developer');
const Opportunity = require('../../models/opportunity');

test('created a developer that will be free this month will mark the 4th month as booked', (t) => {
    var options = {
        method: "GET",
        url: "/api/dashboard/graph",
        headers: { authorization: getAuthHeader()}
    };
    createDevelopers([new Date()], ()=> {
        server.inject(options, function(response) {
            let result = response.result;
            t.equal(result.booked[3], 1);
            teardown(t);
        });
    });
});

test('creating a developer with available equal last month will mark the 3rd month as booked, 4th month as available', (t) => {
    var options = {
        method: "GET",
        url: "/api/dashboard/graph",
        headers: { authorization: getAuthHeader()}
    };
    let lastMonth = new Date();
    lastMonth.setDate(0);
    createDevelopers([lastMonth], ()=> {
        server.inject(options, function(response) {
            let result = response.result;
            t.equal(result.booked[2], 1, '3rd month is booked');
            t.equal(result.available[3], 1, '4th month is available');
            teardown(t);
        });
    });
});

test('creating a developer with available equal last month will mark the 3rd month as booked, 4th month as available', (t) => {
    var options = {
        method: "GET",
        url: "/api/dashboard/graph",
        headers: { authorization: getAuthHeader()}
    };
    let lastMonth = new Date();
    lastMonth.setDate(0);
    createDevelopers([lastMonth], ()=> {
        server.inject(options, function(response) {
            let result = response.result;
            t.equal(result.booked[2], 1, '3rd month is booked');
            t.equal(result.available[3], 1, '4th month is available');
            teardown(t);
        });
    });
});

test('creating a developer with available equal last month then setting it to this month, will mark both last month and this month as booked', (t) => {
    var options = {
        method: "GET",
        url: "/api/dashboard/graph",
        headers: { authorization: getAuthHeader()}
    };
    let lastMonth = new Date();
    lastMonth.setDate(0);
    createDevelopers([lastMonth], (err, developers)=> {
        server.inject(options, function(response) {
            let result = response.result;
            t.equal(result.booked[2], 1, 'When setting available to last month 3rd month is booked');

            let developer = developers[0];
            developer.availableDate = new Date();
            developer.save(()=> {
                t.equal(result.booked[2], 1, 'When setting available to this month still 3rd month is booked');
                t.equal(result.booked[2], 1, 'When setting available to this month 4td month is booked');
                teardown(t);
            });
        });
    });
});

test('creating a developer with available last month will mark all months after the 3rd as available', (t) => {
    var options = {
        method: "GET",
        url: "/api/dashboard/graph",
        headers: { authorization: getAuthHeader()}
    };
    let lastMonth = new Date();
    lastMonth.setDate(0);
    createDevelopers([lastMonth], ()=> {
        server.inject(options, function(response) {
            let result = response.result;
            result.available.splice(0, 3);
            t.equal(result.available.every(x => x === 1), true, 'All months after the 3rd are available');
            teardown(t);
        });
    });
});

test('creating an opportunity with datefrom & dateto equal today will mark 4th months as needed', (t) => {
    var options = {
        method: "GET",
        url: "/api/dashboard/graph",
        headers: { authorization: getAuthHeader()}
    };
    let dateTo = new Date();
    dateTo.setSeconds(dateTo.getSeconds() + 10);
    Opportunity.create({dateFrom: new Date(), dateTo: dateTo, name: 'som'}, ()=> {
        server.inject(options, function(response) {
            let result = response.result;
            t.equal(result.needed[3], 1);
            teardown(t);
        });
    });
});

test('creating an opportunity with datefrom equal today & dateto after two months will mark 4th, 5th, 6th months as needed', (t) => {
    var options = {
        method: "GET",
        url: "/api/dashboard/graph",
        headers: { authorization: getAuthHeader()}
    };
    let dateTo = new Date();
    dateTo.setMonth(dateTo.getMonth() + 2);
    Opportunity.create({dateFrom: new Date(), dateTo: dateTo, name: 'som'}, ()=> {
        server.inject(options, function(response) {
            let result = response.result;
            t.equal(result.needed[3], 1, '4th is needed');
            t.equal(result.needed[4], 1, '5th is needed');
            t.equal(result.needed[5], 1, '6th is needed');
            teardown(t);
            //TODO refactor
            mongoose.connection.close();
        });
    });
});


let teardown = (t) => {
    server.stop(function() {
        mockgoose.reset(function() {
            t.end();
        });
    });
};

let getAuthHeader = function() {
    let token = jwt.sign({}, process.env.TOKEN_SECRET, { expiresIn: 1000});
    return `Bearer ${token}`;
}

let createDevelopers = function(dates, cb) {
    let developers = dates.map((date)=>{
        return { availableDateHistory: {value: date, created_at: date, version: 1}}
    });

    Developer.create(developers, cb);
};

let updateAvailable = function(developer, date, cb) {
    Developer.findById(developer._id, (err, dev)=> {
        dev.availableDate = date;
        dev.save(cb);
    });

};
