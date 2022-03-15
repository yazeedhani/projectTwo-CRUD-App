// import dependencies
const mongoose = require('./connection')

// import user model for populate
const User = require('./user')
// import task model
const Task = require('./task')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const projectSchema = new Schema(
	{
		name: { type: String, required: true },
		// Tasks: { type: String },
		// group: 
		// 	[
		// 		{ 	type: Schema.Types.ObjectID,
		// 			ref: 'User'
		// 		}
		// 	],
		owner: {
			type: Schema.Types.ObjectID,
			ref: 'User'
		}
	}, { timestamps: true })

const Project = model('Project', projectSchema)

/***************** Export our Model ******************/
module.exports = Project
