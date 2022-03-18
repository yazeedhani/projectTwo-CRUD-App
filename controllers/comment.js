/***************** DEPENDENCIES ******************/
const express = require('express')
const mongoose = require('mongoose')
// We need our Task model because comments are ONLY a schema
// So we'll run querires on Tasks, and add in comments
const Task = require('../models/task.js')
const { route } = require('./user.js')


/***************** Create Router ******************/
const router = express.Router()

/*****************  Routes ******************/
// Only need two routes for comments right now
// POST -> to create a comment
router.post('/:id/:taskId', (req, res) => {
    const projectId = req.params.id
    const taskId = req.params.taskId
    // we'll adjust req.body to include an author
    // The author's id will be the logged-in user's id
    req.body.author = req.session.userId
    console.log('Updated comment body', req.body)
    // We'll find the task with the taskId
    Task.findById(taskId)
        .then( task => {
            // Then we'll send req.body to the comments array
            task.comments.push(req.body)
            // save the task
            return task.save()
        })
        .then( task => {
            // redirect
            res.redirect(`/projects/${projectId}/${task.id}/view`)
        })
        .catch( error => {
            // or show an error if we have one
            console.log(error)
            res.json({error})
        })
})

// DELETE -> to delete a comment
// We'll use three params to make our life easier
// first, the id of the project, since we need to find it
// then, the id of the task
// lastly, the id of the comment
router.delete('/delete/:id/:taskId/:commId', (req, res) => {
    // first we want to parse out our IDs
    const projectId = req.params.id
    const taskId = req.params.taskId
    const commId = req.params.commId
    // then we'll find the fruit
    Task.findById(taskId)
        .then( task => {
            // .id() is a subdocument method used to get the id of a subdocument
            const theComment = task.comments.id(commId)
            // Only delete the comment if the user who is logged in is the commet's author
            if( theComment.author == req.session.userId )
            {
                // then we'll delete the comment
                theComment.remove()
                // return to save the task
                return task.save()
            }
            else
            {
                return
            }
        })
        .then( task => {
            // redirect to the task show page
            res.redirect(`/projects/${projectId}/${taskId}/view`)
        })
        .catch(error => {
            // catch any errors
            console.log(error)
            res.json(error)
        })
})

/***************** Export Router ******************/
module.exports = router