/***************** DEPENDENCIES ******************/
require("dotenv").config() // make env variables available
const express = require("express")
const middleware = require('./utils/middleware')
const ProjectRouter = require('./controllers/project')
const UserRouter = require('./controllers/user')
const CommentRouter = require('./controllers/comment.js')
const User = require("./models/user")
// SEE MORE DEPENDENCIES IN ./utils/middleware.js
// user and resource routes linked in ./utils/middleware.js

/***************** Middleware + Express Application Object ******************/
const app = require("liquid-express-views")(express())
middleware(app)

/***************** Routes ******************/
app.use('/auth', UserRouter)
app.use('/projects', ProjectRouter)
app.use('/comments', CommentRouter)

app.get('/', (req, res) => {
    const { username, userId, loggedIn, tz } = req.session
	console.log('req.session: ', req.session)
	res.render('index.liquid', { loggedIn, username, userId, tz })
})

app.get('/error', (req, res) => {
	const error = req.query.error || 'This Page Does Not Exist'
    const { username, loggedIn, userId, tz } = req.session
	res.render('error.liquid', { error, username, loggedIn, userId, tz })
})

// if page is not found, send to error page
app.all('*', (req, res) => {
	res.redirect('/error')
})



/***************** Server Listener ******************/
app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`)
})