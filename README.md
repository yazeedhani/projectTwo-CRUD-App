<<<<<<< HEAD
[![General Assembly Logo](https://camo.githubusercontent.com/1a91b05b8f4d44b5bbfb83abac2b0996d8e26c92/687474703a2f2f692e696d6775722e636f6d2f6b6538555354712e706e67)](https://generalassemb.ly/education/web-development-immersive)

# mongoose-express-liquid-boilerplate

A template for starting full stack projects with `express`. Includes
authentication, example resource and common middlewares.

## Installation

1. **Download** this template as a .zip file. **DO NOT FORK AND CLONE**
2. Move the .zip file to your `sei/projects/` directory and Unzip it (creating a
   folder) -- **NOTE:** if the folder was already unzipped, use the `mv` command
   line to move it to the `sei/projects/` directory.
3. Rename the directory from mongoose-express-liquid-boilerplate -> your-app-name.
4. Find and Replace any mention of `mongoose-express-liquid-boilerplate` especially the one in `package.json`
5. Empty [`README.md`](README.md) and fill with your own content.
6. Move into the new project and `git init` if not already a repository.
7. Run `touch .env .gitignore` in the main project directory(same level as `server.js`)
8. Add `node_modules` and `.env` to your `.gitignore`
9. Replace all example models, controllers, and views with your app's resources. Auth is provided for you already.
10. Install dependencies with `npm install`.
11. Ensure that you have `nodemon` installed by running `npm install -g nodemon`.
12. In your `.env` add variables for `PORT` & `DATABASE_URL` & `SECRET`. This app uses mongoDb and Session authentication, so your `DATABASE_URL` will need to be your local mongo(see the full CRUD app's .env)
13. Ensure the API is functioning properly by running `npm start`.
14. Once everything is working, make an initial commit.

## Structure

Dependencies are stored in [`package.json`](package.json).

The most important file for understanding the structure of the template is
`server.js`. This is where the actual Express `app` object is created, where
the routes are registered, and more. To register a routefile,
follow the pattern established here with `exampleRoutes` and `userRoutes`. If
you want to add any middlewares to your app, add it to the file `utils/middleware.js` in the main export function, which is called in `server.js`.

The main directory contains models, views, and controller files. Models are simply Mongoose
models. To create your own, follow the patterns established in
`models/example.js`. Similarly, the controllers and views listed under the examples directories are a great starting point for your own resources.

The `models/connection.js` file holds all mongoose connection setup steps and can be required and destructured from just like this (Schema and model given as examples):
```js
const { Schema, model } = require('./connection.js')
```


You probably will only need to interact with files in `/models`, `/controllers`, `/views` and `server.js`.

## Tasks

This template uses `npm` as a task runner. 
These are the commands available:

| Command                | Effect                                                                                                      |
|------------------------|-------------------------------------------------------------------------------------------------------------|
| `npm start`       | Starts a development server with `nodemon` that automatically refreshes when you change something.                                                                                         |

## Documenting

Use this as the basis for your own documentation. Add a new third-level heading for your custom entities, and follow the pattern provided for the built-in user authentication documentation.


### Authentication

| Verb   | URI Pattern            | Controller#Action |
|--------|------------------------|-------------------|
| POST   | `/auth/signup`             | `users#signup`    |
| POST   | `/auth/login`             | `users#login`    |
| DELETE | `/auth/logout/`        | `users#logout`   |

### Error Handling

Errors are handled with a default view, and should be called as seen in this example:
```js
router.delete('/:id', (req, res) => {
	const exampleId = req.params.id
	Example.findByIdAndRemove(exampleId)
		.then(example => {
			res.redirect('/examples')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})
```



## [License](LICENSE)

1. All content is licensed under a CC­BY­NC­SA 4.0 license.
1. All software code is licensed under GNU GPLv3. For commercial use or
    alternative licensing, please contact legal@ga.co.
=======
# Project Management Application

## Description
This application allows users to collaborate on a project my creating project dashboards and will allow a user to create, edit, delete, and comment on project tasks.

## User Story
1. A user can sign in or sign up.
2. When the user logs into their account, their homepage will be a list of their project dashboards.
3. A user can click on a project dashboard to view it.
4. Inside a project dashboard are 5 categories viewed as columns: Backlog, Need Help, In Progress, In Review, and Ready.
5. The user can create a task and select which category to place it in.
6. A user is able to only delete their own tasks and project dashboards.
7. Users can comment on each others tasks when viewing a single task.
8. Once finished, the user may sign out.

## Wireframes
![SignIn](signin.png)

## ERD
1[ERD]()

## Technologies Used
- NodeJS
- LiquidJS
- MongoDB
- Mongoose
- CSS
- ExpressJS

## MVP
- Get user to sign up and log in.
- Get user to create a project dashboard and create news tasks for a category.
- Get user to delete project dashboards and tasks
- Get user to edit their own tasks
- Get user to comment on tasks.


## Stretch Plan
- Create drag and drop for tasks.
>>>>>>> 837616e413b5eac9bde0ca27dc0694fa326331b9
