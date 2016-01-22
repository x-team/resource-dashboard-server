'use strict';

require('dotenv').config({silent: true});

const schedule = require('node-schedule');
const request = require('request');
const mongoose = require('mongoose');
const moment = require('moment');
const _ = require('lodash');
const config = require('../config');
const Developer = require('../models/developer');

mongoose.connect(config.database.uri);
mongoose.connection.on('error', console.error.bind(console, 'DB connection error:'));

console.log('Scheduler Started & will run every hour');

var scheduler = schedule.scheduleJob('0 0 * * * *', ()=> {
    getWorkableData().then((workableDevelopers)=> {
        Developer.find({}, (error, developers)=> {
            checkWhatNeedsToBeDone(developers, workableDevelopers).then((todo)=> {
                console.log('Data To Process: ',todo);
                deleteDevelopers(todo.developersToDelete);
                createDevelopers(todo.developersToAdd);
                editDevelopers(todo.developersToEdit, developers);
            });
        });
    },(err)=> {
        console.log(err);
    });
});

var deleteDevelopers = (developers)=> {
    let ids = _.map(developers, '_id');
    if(!ids.length) {
        return;
    }
    Developer.remove({_id: {$in: ids}}, (err)=> {
        if(err) {
            console.error('ERROR while deleting existing developers ', err);
        }
        else {
            console.log('Successfully Deleted Developers');
        }
    });
};

var editDevelopers = (updatedDevelopersWorkable, allLocalDevelopers)=> {
    if(!updatedDevelopersWorkable.length) {
        return;
    }

    //async seq for loop
    let prevPromise = Promise.resolve();
    updatedDevelopersWorkable.forEach((workableDeveloper)=> {
        let developerToBeUpdated = _.find(allLocalDevelopers, {workableId: workableDeveloper.id})
        if(!developerToBeUpdated) {
            return console.error('ERROR developer to be updated is not found');
        }
        prevPromise = prevPromise.then(()=> {
            editDeveloper(developerToBeUpdated, workableDeveloper);
        });
    });
    prevPromise.then(()=> {
        console.log('Successfully Updated developers')
    });
};

var editDeveloper = (developerToBeUpdated, workableDeveloper)=> {
    return new Promise((resolve) => {
        developerToBeUpdated.name = workableDeveloper.name;
        developerToBeUpdated.firstName = workableDeveloper.firstname;
        developerToBeUpdated.lastName = workableDeveloper.lastname;
        developerToBeUpdated.imageUrl = workableDeveloper.image_url;
        developerToBeUpdated.profileUrl = workableDeveloper.profile_url;
        developerToBeUpdated.skills = workableDeveloper.tags;
        developerToBeUpdated.address = workableDeveloper.address;
        developerToBeUpdated.createdAt = workableDeveloper.created_at;
        developerToBeUpdated.updatedAt = workableDeveloper.updated_at;

        developerToBeUpdated.save((err)=> {
            if(err) {
                console.error('ERROR developer couldnt get updated');
            }
            //we still want to resolve even if err for the loop to continue
            resolve();
        });
    });
};


var createDevelopers = (developers)=> {
    if(!developers.length) {
        return;
    }

    let developersToInsert = _.map(developers, (workableDeveloper)=> {
        return {
            name: workableDeveloper.name,
            firstName: workableDeveloper.firstname,
            lastName: workableDeveloper.lastname,
            imageUrl: workableDeveloper.image_url,
            profileUrl: workableDeveloper.profile_url,
            skills: workableDeveloper.tags,
            address: workableDeveloper.address,
            createdAt: workableDeveloper.created_at,
            updatedAt: workableDeveloper.updated_at,
            workableId: workableDeveloper.id
        };
    });

    Developer.create(developersToInsert, (error)=> {
        if(error) {
            console.error('ERROR while inserting new developers ', error)
        }
        else {
            console.log('Successfully Inserted new developers');
        }

    });

};

var checkWhatNeedsToBeDone = (localDevelopers, workableDevelopers)=> {

    let developersToAdd = workableDevelopers.filter((workableDev)=> {
        let found = _.find(localDevelopers, {workableId: workableDev.id});
        return !found;
    });

    let developersToEdit = workableDevelopers.filter((workableDev)=> {
        let found = _.find(localDevelopers, {workableId: workableDev.id});
        if(!found) {
            return false;
        }
        return moment(workableDev.updated_at).isAfter(found.updatedAt);
    });

    let developersToDelete = localDevelopers.filter((localDev)=> {
        let found = _.find(workableDevelopers, {id: localDev.workableId});
        return !found;
    });

    developersToAdd = getDetailedWorkableData(developersToAdd);
    developersToEdit = getDetailedWorkableData(developersToEdit);
    return Promise.all([developersToAdd, developersToEdit, developersToDelete]).then((result) => {
        return {
            developersToAdd: result[0],
            developersToEdit: result[1],
            developersToDelete: result[2]
        };
    });

};

var getDetailedWorkableData = (workableDevelopers)=> {
    let result = [];
    workableDevelopers.forEach((workableDeveloper)=> {
        result.push(loadWorkableRecord(workableDeveloper.id));
    });
    return Promise.all(result);
};

var loadWorkableRecord = (id)=> {
    let subdomain = process.env.WORKABLE_ACCOUNT_SUBDOMAIN;
    let job = process.env.WORKABLE_JOB_SHORTCODE;
    let token = process.env.WORKABLE_TOKEN;

    return new Promise((resolve, reject) => {
        request.get({
            url: `https://www.workable.com/spi/v3/accounts/${subdomain}/jobs/${job}/candidates/${id}`,
            json: true,
            auth: {
                bearer: token
            }
        }, (err, res, body) => {
            if (err) reject(err);
            resolve(body.candidate);
        });
    });

};

var getWorkableData = ()=> {
    let subdomain = process.env.WORKABLE_ACCOUNT_SUBDOMAIN;
    let job = process.env.WORKABLE_JOB_SHORTCODE;
    let token = process.env.WORKABLE_TOKEN;

    return new Promise((resolve, reject) => {
        request.get({
            url: `https://www.workable.com/spi/v3/accounts/${subdomain}/jobs/${job}/candidates`,
            json: true,
            auth: {
                bearer: token
            }
        }, (err, res, body) => {
            if (err) reject(err);
            //TODO Need to vertify the hired & approved text
            let result = _.filter(body.candidates, x => x.stage === 'Hired' || x.stage === 'Approved');
            resolve(result);
        });
    });
};
