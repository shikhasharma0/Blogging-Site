const mongoose = require("mongoose")
const objectId = mongoose.Schema.Types.ObjectId
const moment = require('moment');
const blogSchema = new mongoose.Schema({

    

//{ title: {mandatory}, body: {mandatory}, authorId: {mandatory, refs to author model}, tags: {array of string},
// category: {string, mandatory, examples: [technology, entertainment, life style, food, fashion]}, subcategory: 
//{array of string, examples[technology-[web development, mobile development, AI, ML etc]] }, createdAt, 
//updatedAt, deletedAt: {when the document is deleted}, 
//isDeleted: {boolean, default: false}, publishedAt: {when the blog is published}, isPublished: {boolean, default: false}}

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
    "publishedAt": { type : String, default : moment().format('DD-MM-YYYY') },
    "deletedAt": String,
    "isDeleted": {
        type: Boolean,
        default: false,
    },
},{ timestamps: true })

module.exports = mongoose.model("blog", blogSchema)
