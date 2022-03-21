/***************** DEPENDENCIES ******************/
const express = require('express')
const Project = require('../models/project')

// Create router
const router = express.Router()

/***************** Routes ******************/

/************** New and Create routes (Create new task) *****************/
// NEW route -> GET route that renders our page with the form
router.get('/projects/new', (req, res) => {
	const { username, userId, loggedIn } = req.session
	res.render('project/new', { username, loggedIn })
})

// CREATE -> POST route that actually calls the db and makes a new document
router.post('/', (req, res) => {
	req.body.owner = req.session.userId
	Project.create(req.body)
		.then( project => {
			console.log('this was returned from create', project)
			res.redirect('/projects/mine')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})
/******************************************************/