const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const postSchema = new mongoose.Schema({
    email: {
        type: String, 
        required: true
    }, 
    posttext: {
        type: String, 
        required: true, 
    }, 
    image1: {
        type: String, 
        default: ''
    }, 
    image2: {
        type: String, 
        default: ''
    }, 
    image3: {
        type: String, 
        default: ''
    },
    image4: {
        type: String, 
        default: ''
    },
    likes: {
        type: Array,
        default: []
    },
    replyingOn: {
        type: String,
        default: ''
    },
    replyingTo: {
        type: String,
        default: ''
    },
    replyingEmail: {
        type: String,
        default: ''
    },

})
mongoose.model("Post",postSchema)