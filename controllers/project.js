/***************** DEPENDENCIES ******************/
const express = require('express')
const { route } = require('express/lib/application')
const { redirect, render } = require('express/lib/response')
const Project = require('../models/project')
const Task = require('../models/task')
const { populate } = require('../models/user')
const User = require('../models/user')
const fetch = require('node-fetch')

/***************** Router ******************/
const router = express.Router()

/***************** Router Middleware ******************/
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
// INDEX that shows only the user's projects
router.get('/mine', (req, res) => {
    // destructure user info from req.session
    const { username, userId, loggedIn} = req.session
	// Display the projects you created and the projects you are a group member of
	Project.find({ $or: [{ owner: userId }, {group: { $in: [username] } }] })
		// gives you back thew whole object associated with the ID queried above
		.populate('owner')
		.then( projects => {
			res.render('project/index', { projects, username, loggedIn, userId })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

/************** New and Create routes (Create new project dashboard) *****************/
// NEW route -> GET route that renders our page with the new project dashboard form
router.get('/new', (req, res) => {
	// need a list of all users to pass to the form below to show in the view
	const { username, userId, loggedIn } = req.session
	res.render('project/new-project', { username, loggedIn })
})

// CREATE -> POST route that actually calls the db and makes a new document (new project dashboard)
router.post('/', (req, res) => {
	// this is where you push the users to the group array in Project
	console.log(req.body)
	req.body.owner = req.session.userId
	// The group memebers will be entered in the form as a comma-separated list
	// Need to split that list into an array and update it to req.body.group
	let groupMembers = req.body.group.split(',')
	// remove any empty strings from groupMembers
	for(let i = 0; i < groupMembers.length; i++)
	{
		if(groupMembers[i] === '')
		{
			groupMembers.splice(i, 1)
		}
	}
	req.body.group = groupMembers
	console.log(req.body)
	Project.create(req.body)
		.then( project => {
			// This automatically add the owner to the groups list ********************************** Work on this later, after the API
			// Remove the emtpy string from the group array if no group members are added.
			project.group.push(req.session.username)
			project.save()
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
	res.render('task/new-task', { username, loggedIn, projectId})
})

// CREATE -> POST route that actually calls the db and makes a new task 
router.post('/:id/new', (req, res) => {
	// get project ID
	const projectId = req.params.id
	// Add the project and category fields to req.body so it can match the Task schema.
	// req.body is the data for the task model.
	req.body.project = projectId
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
			res.redirect(`/projects/${projectId}`)
	})
})
/******************************************************/

/************** Edit and Update routes (update project) *****************/
// EDIT route -> GET that takes us to the edit form view to just change the project name
router.get('/:id/edit', (req, res) => {
	// we need to get the project id
	const projectId = req.params.id
	Project.findById(projectId)
		.then( project => {
			const {username, loggedIn, userId} = req.session
			res.render('project/edit', { project, username, loggedIn, userId })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// UPDATE route --> PUT that implements the change to the document in the DB
router.put('/:id', (req, res) => {
	// Get the project ID
	const projectId = req.params.id
	const projectName = req.body.name
	const projectTimezone = req.body.timezone
	const projectGroup = req.body.group.split(',')
	console.log('this is the project id: ', projectId)
	// Tell Mongoose to update the project
	Project.findByIdAndUpdate(projectId, {name: projectName, group: projectGroup, timezone: projectTimezone}, { new: true })
		.then( project => {
			res.redirect(`/projects/${projectId}`)
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})
/******************************************************/

/************** Edit and Update routes (update task) *****************/
// EDIT route -> GET that takes us to the edit form view to edit the selected task
router.get('/:id/:taskId/edit', (req, res) => {
	const projectId = req.params.id
	const taskId = req.params.taskId

	Task.findById(taskId)
		.populate('project')
		.populate('owner')
		.then( task => {
				const {username, loggedIn, userId} = req.session
				res.render('task/edit-task', {task, username, loggedIn, userId})
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// UPDATE route --> PUT that implements the change to the document in the DB
router.put('/:id/:taskId', (req, res) => {
	// Get project ID
	const projectId = req.params.id
	// Get task ID
	const taskId = req.params.taskId
	// Get the updated info from the submitted edit task form
	const taskName = req.body.name
	const taskCategory = req.body.category
	const taskDescription = req.body.description
	Task.findByIdAndUpdate(taskId, {name: taskName, category: taskCategory, description: taskDescription}, { new: true })
		.populate('project')
		.then( task => {
			res.redirect(`/projects/${projectId}`)
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

/******************************************************/

// SHOW route --> show an individual task in a project dashboard.
router.get('/:id/:taskId/view', (req, res) => {
	const projectId = req.params.id
	const taskId = req.params.taskId
	const {username, loggedIn, userId} = req.session
	Task.findById(taskId)
		.populate('project')
		.populate('owner')
		.populate('comments.author')
		.then( task => {
			Project.findById(projectId)
				.populate('owner')
				.then( project => {
					res.render('task/show-task', {project, task, username, loggedIn, userId})
				})
		})
})


// SHOW route --> show an individual project dashbaord and its tasks.
router.get('/:id', (req, res) => {
	// Get the current project ID
	const projectId = req.params.id
	const {username, loggedIn, userId} = req.session
	// Find the 1 project by ID in params
	const projectQuery = Project.findById(projectId)
		.populate('owner')
		.then( project => {
		// Display task owner on each task in project dashboard
			return project
		})
	//	Find all the tasks that share the same project ID	
	const taskQuery = Task.find({project: projectId})
		.populate('owner')
		.then( tasks => {
			return tasks
		})
	
	// Catch all the promises from above (projectQuery, taskQuery)
	Promise.all([projectQuery, taskQuery])
		.then( response => {
			const project = response[0]
			const tasks = response[1]

			fetch(`https://www.timeapi.io/api/Time/current/zone?timeZone=${project.timezone}`)
				// Get the response from the API and convert it to JSON
				.then( responseData => {
					return responseData.json()
				})
				// Render project dashboard in show.liquid
				.then( timezoneData => {
					let todaysDate = timezoneData.date
					let time = timezoneData.time
					let dayOfWeek = timezoneData.dayOfWeek
					res.render('project/show', { project, tasks, username, loggedIn, userId, dayOfWeek, todaysDate, time })
				})
				// Or display any errors
				.catch( error => {
					res.json({error})
				})
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// DELETE project task --> delete a task from the tasks and projects collections
router.delete('/:id/:taskId', (req, res) => {
	// Get the task id and project
	const taskId = req.params.taskId
	const projectId = req.params.id
	// Deletes the task from tasks collection
	Task.findByIdAndRemove(taskId)
		.then( task => {
			// console.log('this is the response from FBID ', task)
			// Removes the task from the tasks array in Project
			Project.findById(projectId)
				.then( project => {
					project.tasks.splice(project.tasks.indexOf(taskId), 1)
					project.save()
				})
				.catch(error => {
					res.redirect(`/error?error=${error}`)
				})
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
	Task.deleteMany({project: projectId})
		.then(task => {
			console.log('this is the response from FBID ', task)
			// res.redirect('/projects/mine')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
	// Delete the project
	Project.findByIdAndRemove(projectId)
		.then(project => {
			res.redirect('/projects/mine')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

/******************************************************/

/***************** Export our Router ******************/
module.exports = router