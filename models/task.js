// import dependencies
const mongoose = require('./connection')

// we also need to import our commentSchema
const commentSchema = require('./comment.js')

// import user model for populate
const User = require('./user')
const Project = require('./project')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const taskSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: 
    {
        type: String
    },
    category: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectID,
		ref: 'User',
    },
    project: {
			type: Schema.Types.ObjectID,
			ref: 'Project'
    },
    comments: [commentSchema]
}, {timestamps: true})

// Make our Task model that will use the Schema
const Task = model('Task', taskSchema)

/***************** Export our Model ******************/
module.exports = Task