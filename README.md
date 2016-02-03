# Resource-dashboard-server

This README outlines the details of collaborating on this Node application.
A short introduction of this app could easily go here.

This project uses [JSON API](http://jsonapi.org) as a transport standard, so make sure that all requests are handled in an appropriate manner.

## Prerequisites

You will need the following things properly installed on your computer.

* [Node.js](http://nodejs.org/) (with NPM)
* [MongoDB](https://www.mongodb.org/)

## Installation

* `git clone <repository-url>` this repository
* change into the new directory
* `npm install`


* create `.env` and add the following
```
TOKEN_SECRET=random_secret
```

## Development

* `mongod` # Run MongoDB
* `node index.js` # Run static server or
* `node run dev` # Run watch server
* Visit your app at [http://localhost:8000](http://localhost:8000).

### Deploying

- Install [Heroku Toolbelt](https://toolbelt.heroku.com/) and log in to your account.
- Turn on Mongolab Add-on in Heroku Dashboard for your app

Follow steps below to deploy:
```
$ heroku git:remote -a <heroku-app-name>
$ heroku config:set TOKEN_SECRET=<random-token-string>
$ git push heroku master
$ heroku ps:scale web=1
$ heroku open
```

### Adding initial user

First make sure that you are running MongoDB and its daemon is attached (`$ mongod`).

```
$ mongo
$ use resource-dashboard-dev
$ db.users.insert({ "name": "John Doe", "email": "john.doe@example.com" })
```

### Running Tools

* `npm run test` # Run tests
* `npm run coverage` # Run code coverage
* `npm run lint` # Run code linter

### Workable Scheduler


#### Env Variables
* generate a token from `workable`
* Add the following env variables

```
WORKABLE_TOKEN=TOKEN
WORKABLE_JOB_SHORTCODE=JOBSHORTCODE
WORKABLE_ACCOUNT_SUBDOMAIN=SUBDOMAIN
```

*Get Workable Token?*
Go to `Account Dropdown` -> `Integeration` -> `Generate Token`

*Get Workable Job Shortcode that all candidates are related to?*
Go to Job Details -> There is a `job shortlink` text, the shortcode is the ID in that text
Ex:`https://xteam.workable.com/j/3D150E9D22`, `shortcode` equals `3D150E9D22`

*Get Workable account subdomain?*
if url is `https://xteam.workable.com` then `subdomain` is `xteam`
