const express = require('express'); 
const router = express.Router(); 
const mongoose = require('mongoose')
const User = mongoose.model("User")
const Post = mongoose.model("Post")
const jwt = require('jsonwebtoken')
require('dotenv').config()
const nodemailer = require('bcrypt')

// router.post('/addpost',(req,res) => {
//     const {email,image,posttext} = req.body 
//     User.findOne({email: email})
//     .then((savedUser) => {
//         if(!savedUser){
//             return req.status(422).json({error: 'Invalid credentials'})
//         }
//         savedUser.posts.push({image,posttext, likes: [], comments: []})
//         savedUser.save()
//         .then(user => {
//             res.json({message: 'Post added successfully'})
//         })
//         .catch(err => {
//             res.json({error: 'error adding post'})
//         })
//     })
//     .catch(err => {
//         console.log(err)
//     })
// })
router.post("/addpost", async (req, res) => {
    const {  posttext, email,image1, image2, image3,image4,replyingTo } = req.body;
  
    if (!posttext || !email) {
        return res.status(422).json({ error: 'please add all the fields' })
    }
    else {
        const post = new Post({
            email,
            posttext,
            image1, 
            image2,
            image3,
            image4,
            replyingTo,
        })
        try {
            await post.save();
            return res.status(200).json({ message: "Post added successfully" })
        } catch (err) {
            console.log(err);
            return res.status(422).json({ error: 'error adding post',err })
        }
    }
})
module.exports = router