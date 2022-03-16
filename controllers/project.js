// Import Dependencies
const express = require('express')
const { redirect } = require('express/lib/response')
const Project = require('../models/project')
const Task = require('../models/task')
const { populate } = require('../models/user')
const User = require('../models/user')

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
		// gives you back thew whole object associated with the ID queried above
		.populate('owner')
		.then( projects => {
			console.log(projects)
			res.render('project/index', { projects, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

/************** New and Create routes (Create new project dashboard) *****************/
// NEW route -> GET route that renders our page with the new project dashboard form
router.get('/new', (req, res) => {
	// need a list of all users to pass to the form below to show in the view
	// let usersList = []
	// User.find({}, "username")
	// 	.then( users => {
	// 		console.log(users)
	// 		usersList = users
	// 		console.log(usersList)
	// 	})
	// 	.catch( error => {
	// 		console.log(error)
	// 	})
	const { username, userId, loggedIn } = req.session
	res.render('project/new-project', { username, loggedIn })
})

// CREATE -> POST route that actually calls the db and makes a new document (new project dashboard)
router.post('/', (req, res) => {
	// this is where you push the users to the group array in Project
	req.body.owner = req.session.userId
	console.log(req.body)
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

/************** New and Create routes (Create new task) *****************/
// NEW route -> GET route that renders our page with the new task form
router.get('/:id/new', (req, res) => {
	const { username, userId, loggedIn } = req.session
	const projectId = req.params.id
	// res.send('New task')
	res.render('project/new-task', { username, loggedIn, projectId})
})

// CREATE -> POST route that actually calls the db and makes a new task 
router.post('/:id/new', (req, res) => {
	// get project ID
	const projectId = req.params.id
	// Add the project and category fields to req.body so it can match the Task schema.
	// req.body is the data for the task model.
	req.body.project = projectId
	// req.body.category = 'backlog'
	req.body.owner = req.session.userId
	// Create a new task in the tasks collection using the form data
	Task.create(req.body)
		.then( task => {
			// Find the project using the project ID where the task is being created
			Project.findById(projectId)
			// Add this task to the tasks array in the project module to keep count of its tasks
			.then( project => {
				project.tasks.push(task._id)
				project.save()
			})
			console.log(task)
			res.redirect(`/projects/${projectId}`)
	})
})
/******************************************************/

/************** Edit and Update routes (update project) *****************/
// EDIT route -> GET that takes us to the edit form view
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

// UPDATE route
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
/******************************************************/

// SHOW route --> show an individual project dashbaord.
router.get('/:id', (req, res) => {
	const projectId = req.params.id
	// Find project by ID
	const {username, loggedIn, userId} = req.session
	// Find 1 project by ID in params
	const projectQuery = Project.findById(projectId)
		.populate('owner')
		// .populate('tasks')
		.then( project => {
			// Display task owner on each task in project dashboard
			
				console.log(project.tasks)
				console.log(project)
				return project
			})
	//	Find all the tasks that share the same project ID	
	const taskQuery = Task.find({project: projectId})
		.populate('owner')
		.then( tasks => {
			console.log('these are the tasks for this project: ', tasks)
			return tasks
		})

	Promise.all([projectQuery, taskQuery])
		.then( response => {
			// res.json(response)
			const project = response[0]
			const tasks = response[1]
			res.render('project/show', { project, tasks, username, loggedIn, userId })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// DELETE project task --> delete a task
router.delete('/:id/:taskId', (req, res) => {
	// Get the task id
	const taskId = req.params.taskId
	Task.findByIdAndRemove(taskId)
		.then( task => {
			console.log('this is the response from FBID ', task)
			res.redirect(`/projects/${task.project}`)
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})
// DELETE project route --> delete a project and its tasks
router.delete('/:id', (req, res) => {
	// Get the project id
	const projectId = req.params.id
	// Delete project's tasks
	// Project.findByIdAndUpdate(projectId, {tasks: []}, {new: true})
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
