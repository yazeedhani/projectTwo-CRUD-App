// import dependencies
const mongoose = require('./connection')

// we also need to import our commentSchema
const commentSchema = require('./comment.js')

// import user model for populate
const User = require('./user')

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
    owner: {
        type: Schema.Types.ObjectID,
		ref: 'User',
    },
    comment: [commentSchema]
}, {timestamps: true})

// Make our Task model that will use the Schema
const Task = model('Task', taskSchema)

/***************** Export our Model ******************/
module.exports = Task