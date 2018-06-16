# WargamersAPI

The API for the WargamersApp. Created using Node.js, Express and PostgreSQL.

To start modifying it, you should first be familiar with the structure of the directory:

* **bin**

This folder is used to contain any binaries, scripts or utilities used to maintain the server. Here, you can populate your own local instance of PostgreSQL using the script inside.

A repeat of the instructions on how to use the script:

1. Open cmd prompt
2. psql -U USERNAME
2a. Enter Password
3. Create database DATABASENAME
4. Quit
5. psql -U USERNAME DATABASENAME < Script.pgsql
5a. enter password

Example: psql -U postgres mydb < Script.pgsql

* **src**

This folder is used to contain the source code. Inside of it, you'll find:

* *app.js*
* *db.js*

*app.js* is the main entry point for the server. In here, it binds to the main router, and starts the server.<br>
*db.js* is where the main instance of the database is created. In order to use it, simply `require` it inside of the corresponding file you'd like to use it in.

* *package.json*

A file that holds various metadata like project version, license information and configuration data. Allows *npm* to identify the project and handle its dependencies. You can modify stuff like the main entry point or the authors of the app here.

* **node_modules**

This folder is where all the modules imported by the `requires` keyword live. Similar to how you import libraries, modules allow you to add extra functionality to your project without directly having the code inside of your files.

* **routes**

This folder is used to contain all of the routes. Inside of it, you'll find:

* *index.js*
* *games.js*

*index.js* is the main router that binds to all of the other routers. Currently, only *games.js* is defined, but simply follow the code inside of it to create your own routes. Be sure to bind it to the router inside of index.js or those routes will not be reachable.

## How to work on it
Look at *games.js* for an example on how to create your own routes.

1. **Set your local environment variable** 

The connection string for `pg-promise` is specified in the following two lines in *db.js*:

`const cn = connection_string`

The API will first try to initialize the `connection_string` as `require('./connection_info')`. This is for sake of ease. It is highly recommended that you create a `connection_info.js` file inside of the `src` folder to match the pathing of `db.js` where the contents are like so:

`var connection_info = "postgres://user:password@server:port/database"';
module.exports = connection_info;`

This `connection_info.js` file is included in the `.gitignore` and should never be committed as it contains local connection information that will only work for you.

When deployed to Heroku, the `connection_string` will then take on the constant `process.env.DATABASE_URL` which is an environment variable that will be automatically set by Heroku. You can alternatively set this on your own local machine if you like.

2. **Create your own routes.**

Look at *games.js* for an example on how to create your own routes. All you have to do is:

* Instantiate a router.

You can do this by writing `var example = require('express').Router();`.

* Return the instance of the database.

You can do this by writing `var db = require('../db');`.

* Use Express to link an HTTP verb to a route.

Read the docs here to learn how to do so: https://expressjs.com/en/guide/routing.html

Note that when creating a new router, your paths are relative to the path that your router is assigned to. For example, if I call `routes.use('/games', games);`, that attaches my games router to the `/games` path, meaning that if I write a GET request for my games router like so: `routes.get('/', (req, res) => {})`, I will be servicing a request for `/games`, not `/`.

3. **Run the server.**

If you are running it locally, use `npm start` in the root folder. Note this is because `npm start` is defined due to `package.json`, so it will only know how to interpret it given the appropriate `package.json` file. Try not to move anything around too much as well, as the main entry point is specifically linked to `src/app.js`.

Note that as it is configured to use `nodemon`, you do not have to run `npm start` every time you make a change. It will automatically reload changes for you.

If you want to push it to Heroku and test it there, you will have to add  and commit your changes, then push to the Heroku remote repository using `git subtree push --prefix API heroku master`, from the root folder of this repository (i.e. not inside this folder.) We want to push the whole API folder to the Heroku remote repository. The reason why we have to do this is because Heroku looks for package.json in the given root folder. As package.json only exists in this folder, we want to push only this folder.

Alternatively, this could be done by creating a separate repository for the API or even placing all of the files at the root of this app.

Once you've pushed, use `heroku open` to visit the app.









