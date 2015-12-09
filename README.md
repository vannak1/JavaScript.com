# JavaScript.com

With the help of community members contributing content to the site,
JavaScript.com aims to keep developers up to date on news, frameworks, and libraries.
In addition, we aim to be a gateway for those wanting to learn JavaScript.

# Roadmap
JavaScript.com was the product of a hack day and there's a lot of room for
improvement. Check out the current [roadmap](https://github.com/codeschool/JavaScript.com/milestones/v2).

### Contributions
We'd love for you to contribute! For the time being, we will be placing a strong
emphasis on getting the code base up to standards before adding new features.

### Deployments
We have two main branches, `master` and `production`. All PR's will be merged
into `master` which is then merged into `production. The `production` branch is
the code that is currenly deployed.

At the moment, `master` is ahead of `production` while we streamline our deploy
process. Please bear with us for the timing being!


# Getting Started
#### Installing NVM
Install NVM (`$ brew install nvm` and follow instructions)

```bash
nvm install 4.2.1
npm install -g gulp
npm install
```

#### Building Assets

To build assets locally, you'll need to install Bower dependencies and run these Gulp tasks:

```bash
$ bower install
$ gulp sass
$ gulp javascript
```
Remember to re-run these tasks after pulling or changing branches.

#### Setup Github Application
This app authenticates with GitHub, so you'll need to create a
[GitHub Application](https://github.com/settings/applications/new).

Set the **Homepage URL** to `http://localhost:3000` and

the **Authorization callback URL** to `http://localhost:3000/sessions/auth/github/callback/`


#### Environment Variables
We use [dotenv](https://github.com/motdotla/dotenv) to keep ourselves sane with
the various environment variables. 

Copy `example.env` to `.env` and then fill in the variables. The only ones
that are critical locally are Github variables for sign in. For everything else,
you can setup test accounts if you'd like.

#### Database Setup
Download and install [MongoDB](https://www.mongodb.org/downloads)

When you run `npm start`, mongod will be forked as a background process. No need
to create the database either. You're all set.

After you're done, make sure you run `npm stop` to shut down mongod.

## Running the application

Run the application with `$ npm start`.

## Development

If you add any runtime dependencies, you must run `npm shrinkwrap` and
commit changes to `npm-shrinkwrap.json`.


