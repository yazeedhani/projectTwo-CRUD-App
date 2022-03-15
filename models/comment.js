// import dependencies
const mongoose = require('./connection')

// This will be a subdocument for the Task Model
const commentSchema = new mongoose.Schema({
    note: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true}
)

module.exports = commentSchema