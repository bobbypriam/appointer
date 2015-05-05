# Appointer

Appointer app official repository.

## Requirements

### Git

Appointer uses git for version control. You can find out how to install git by [visiting this link](http://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

### NodeJS

Appointer is using Express on top of NodeJS, so we need to install Node to run it. Appointer is using Node v0.10.38. For Windows, use the installer below:

1. http://nodejs.org/dist/v0.10.38/node-v0.10.38-x86.msi (32-bit)
2. http://nodejs.org/dist/v0.10.38/x64/node-v0.10.38-x86.msi (64-bit)

For other systems, [click here for how to install](https://nodejs.org/download/).

To check if Node is installed properly in your machine, type in your cmd/terminal/powershell:

    node -v
    npm -v

### MySQL

Appointer uses MySQL for the database, hence we must install it. On Windows, you can do this by [installing XAMPP](https://www.apachefriends.org/index.html) and activating the MySQL.

### Redis

Redis is used for the sessions. Unfortunately, Redis does not officially support Windows. For development, you can disable Redis and use the default MemoryStore by opening `server/configs/session.js` and comment out the following lines:

    // var RedisStore = require('connect-redis')(session);

and

    // store: new RedisStore({ host: 'localhost', port: 6379, db: 1 }),

## Setting up the environment

### Gulp

We use Gulp for our build automation. Install Gulp globally via npm using

    npm install -g gulp

### Clone this project

To clone this project using git, open your cmd/terminal and go to where you want to put the project, for example `C:\Projects` or `/home/you/projects`. Inside that directory, run

    git clone https://github.com/bobbypriambodo/appointer.git

This command should create a directory named `appointer`. After it's done, go into the directory using

    cd appointer

### Install project dependencies

Inside the project directory (in this case `appointer`), run

    npm install

This can take a few minutes.

## Running the project

To run this project, run

    npm start

The app is now listening in http://localhost:3000.

P.S. You need to change the baseurl first in `server/configs/baseurl.js` from

    res.locals.baseurl = '/appointer/';

into

    res.locals.baseurl = '/';

## Working with the project

Coming soon!
