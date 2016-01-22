'use strict';
const Developer = require('../models/developer');
const Opportunity = require('../models/opportunity');
const moment = require('moment');

module.exports = {
    getGraph(request, reply) {
        getAllData((error, result) => {
            if(error) {
                return reply({error}).code(400);
            }

            let months = getMonths();

            let available = months.map((month) => {
                let monthToCompare = moment(month);
                let availableDevelopers = result.developers.filter((developer) => {
                    let availableDate = developer.getDateRecordFromHistory('availableDate', month);
                    if(!availableDate) {
                        return false;
                    }
                    availableDate = availableDate.value;
                    return !availableDate || monthToCompare.isAfter(availableDate, 'month');
                });
                return availableDevelopers.length;
            });

            let booked = months.map((month) => {
                let monthToCompare = moment(month);
                let bookedDevelopers = result.developers.filter((developer) => {
                    let availableDate = developer.getDateRecordFromHistory('availableDate', month);
                    if(!availableDate) {
                        return false;
                    }
                    availableDate = availableDate.value;
                    return availableDate && monthToCompare.isSameOrBefore(availableDate, 'month');
                });
                return bookedDevelopers.length;
            });

            let needed = months.map((month) => {
                let monthToCompare = moment(month);
                let availableOpportunities = result.opportunities.filter((opportunity) => {
                    let dateFrom = opportunity.getDateRecordFromHistory('dateFrom', month);
                    let dateTo = opportunity.getDateRecordFromHistory('dateTo', month);
                    if(!dateFrom || !dateTo) {
                        return false;
                    }
                    dateFrom = dateFrom.value;
                    dateTo = dateTo.value;
                    return monthToCompare.isSameOrAfter(dateFrom, 'month') && monthToCompare.isSameOrBefore(dateTo, 'month');
                });
                return availableOpportunities.length;
            });

            let displayedMonths = months.map((month) => {
                return moment(month).format('MMM YY');
            });

            return reply({
                months: displayedMonths,
                available,
                booked,
                needed
            });
        });

    }
};

let getMonths = function() {
    let today = new Date();
    let result = [];

    //needed for some date quirks
    today.setDate(1)

    for(let i=3; i >=1; i--) {
        let date = prevMonth(today, i);
        result.push(date);
    }

    result.push(today);

    for(var i = 1; i <= 8; i++) {
        let date = nextMonth(today, i);
        result.push(date);
    }
    return result;
};

let prevMonth = function(date, months) {
    return new Date(date.getFullYear(), date.getMonth() - months, 1);
};

let nextMonth = function(date, months) {
    return new Date(date.getFullYear(), date.getMonth() + months, 1);
};

let getAllData = function(cb) {
    Developer.find({}, function(devError, developers) {
        if(devError) {
            return cb(devError);
        }
        Opportunity.find({}, function(oppError, opportunities) {
            if(oppError) {
                return cb(oppError);
            }
            return cb(false, { developers, opportunities});
        });
    });
};
