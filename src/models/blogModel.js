const mongoose = require("mongoose")
const objectId = mongoose.Schema.Types.ObjectId
const moment = require('moment');
const blogSchema = new mongoose.Schema(
{
    "title": {
        type: String,
        required: true,
        trim: true
    },
    "body": {
        type: String,
        required: true,
        trim: true
    },
    "authorId": {
        type: objectId,
        ref: "author"
    },
    "tags": [String],
    "category": {
        type: String,
        required: true
    },
    "subCategory": [String],
    "isPublished": {
        type: Boolean,
        default: false
    },
    "publishedAt": String,
    "deletedAt": String,
    "isDeleted": {
        type: Boolean,
        default: false,
    },
},{ timestamps: true });

module.exports = mongoose.model("blog", blogSchema);
