// Import Dependencies
const express = require('express')
const Project = require('../models/project')

// Create router
const router = express.Router()

// Router Middleware
// Authorization middleware
// If you have some resources that should be accessible to everyone regardless of loggedIn status, this middleware can be moved, commented out, or deleted. 
router.use((req, res, next) => {
	// checking the loggedIn boolean of our session
	if (req.session.loggedIn) {
		// if they're logged in, go to the next thing(thats the controller)
		next()
	} else {
		// if they're not logged in, send them to the login page
		res.redirect('/auth/login')
	}
})

/***************** Routes ******************/

// index ALL
// router.get('/', (req, res) => {
// 	Project.find({})
// 		.then(examples => {
// 			const username = req.session.username
// 			const loggedIn = req.session.loggedIn
			
// 			res.render('examples/index', { examples, username, loggedIn })
// 		})
// 		.catch(error => {
// 			res.redirect(`/error?error=${error}`)
// 		})
// })

// INDEX that shows only the user's projects
router.get('/mine', (req, res) => {
    // destructure user info from req.session
    const { username, userId, loggedIn } = req.session
	Project.find({ owner: userId })
		.then( projects => {
			res.render('project/index', { projects, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

/************** New and Create routes (Create new project) *****************/
// NEW route -> GET route that renders our page with the form
router.get('/new', (req, res) => {
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

// edit route -> GET that takes us to the edit form view
router.get('/:id/edit', (req, res) => {
	// we need to get the id
	const projectId = req.params.id
	Project.findById(projectId)
		.then(project => {
			res.render('examples/edit', { project })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// update route
router.put('/:id', (req, res) => {
	const exampleId = req.params.id
	req.body.ready = req.body.ready === 'on' ? true : false

	Project.findByIdAndUpdate(exampleId, req.body, { new: true })
		.then(example => {
			res.redirect(`/examples/${example.id}`)
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// show route
router.get('/:id', (req, res) => {
	const projectId = req.params.id
	Project.findById(projectId)
		.then( project => {
            const {username, loggedIn, userId} = req.session
			res.render('project/show', { project, username, loggedIn, userId })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// DELETE route --> delete a project
router.delete('/:id', (req, res) => {
	// Get the project id
	const projectId = req.params.id
	// Delete the project
	Project.findByIdAndRemove(projectId)
		.then(project => {
			console.log('this is the response from FBID ', project)
			res.redirect('/projects/mine')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})
/******************************************************/

// Export the Router
module.exports = router
