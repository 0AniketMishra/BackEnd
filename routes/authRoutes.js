const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User')
const Post = mongoose.model('Post')
const jwt = require('jsonwebtoken')
require('dotenv').config();
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt');

// router.get('/home',(req,res) => {
//     res.send("Ohhh it WORKED  ")
// })

async function mailer(recieveremail, code) {
    // console.log("Mailer function called");

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        requireTLS: true,
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASS,
        },
    });


    let info = await transporter.sendMail({
        from: "GeekChat",
        to: `${recieveremail}`,
        subject: "Email Verification",
        text: `Your Verification Code is ${code}`,
        html: `<b>Your Verification Code is ${code}</b>`,
    })

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

router.post('/verify', (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(422).json({ error: "Please add all the fields" });
    }
    else {
        User.findOne({ email: email })
            .then(async (savedUser) => {
                // console.log(savedUser)
                // return res.status(200).json({message: 'Email Sent'})
                if (savedUser) {
                    return res.status(422).json({ error: 'Invalid Credentials' })
                }
                try {
                    let VerificationCode = Math.floor(100000 + Math.random() * 900000)
                    await mailer(email, VerificationCode)
                    return res.status(200).json({ message: "Email Sent", VerificationCode, email })
                } catch (err) {
                    console.log("asdf")
                }
            })
    }
})

router.post("/signup", async (req, res) => {
    const { username, password, email } = req.body;
    const lowerUsername = '@' + username.replace(/\s+/g, '').toLowerCase()
    
 
        const user = new User({
            username,
            email,
            lowerUsername, 
            password
        })
        try {
            await user.save();
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
            return res.status(200).json({ message: "User Registered Successfully!", token })
        } catch (err) {
            console.log(err);
            return res.status(422).json({ error: 'Error Registering User!' })
        }
    
})
router.post('/signin', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).json({ error: "Please add all the fields" });
    }
    else {
        User.findOne({ email: email })
            .then(savedUser => {
                if (!savedUser) {
                    return res.status(422).json({ error: "Invalid Credentials" });
                }
                else {
             
                    bcrypt.compare(password, savedUser.password)
                        .then(
                            doMatch => {
                                if (doMatch) {
                                    const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET);

                                    const { _id, username, email } = savedUser;

                                    res.json({ message: "Successfully Signed In", token, user: { _id, username, email } });
                                }
                                else {
                                    return res.status(422).json({ error: "Invalid Credentials" });
                                }
                            }
                        )
                    // res.status(200).json({ message: "User Logged In Successfully", savedUser });
                }
            })
            .catch(err => {
                console.log(err);
            })
    }
})
router.post('/userdata', (req, res) => {
    const { email } = req.body;
    User.findOne({ email: email })
        .then(savedUser => {
                res.status(200).json({ message: 'User Found', savedUser })
        })
})

router.post('/finduser', (req, res) => {
    const { keyword } = req.body;
    User.find({ username: { $regex: keyword, $options: 'i' } })
        .then(user => {
        
                return res.status(200).send({
                    message: "User Found",
                    user: user
                })
    

        })
})
router.post('/allposts', (req, res) => {
    Post.find({})
        .then(post => {
                 res.status(200).send({
                    message: "Posts Found",
                    post: post 
                })
            

        })
})

router.post('/checkfollow', (req, res) => {
    const { followfrom, followto } = req.body
    if (!followfrom || !followto) {
        return res.status(422).json({ error: "Invalid Credentials" })
    }
    User.findOne({ email: followfrom })
        .then(mainuser => {
            if (!mainuser) {
                return res.status(422).json({ error: "Invalid Credentials" })
            } else {
                let data = mainuser.following.includes(followto)
                if (data == true) {
                    res.status(200).send({
                        message: "User in following list"
                    })
                } else {
                    res.status(200).send({
                        message: "User not in following list"
                    })
                }
            }
        })
})

router.post('/followuser', (req, res) => {
    const { followfrom, followto } = req.body;

    if (!followfrom || !followto) {
        return res.status(422).json({ error: "Invalid Credentials" })
    }

    User.findOne({ email: followfrom })
        .then(mainuser => {
           mainuser.following.push(followto)
        })
    User.findOne({ email: followto })
        .then(otheruser => {
                otheruser.followers.push(followfrom)
                otheruser.save()
                res.status(200).send({
                    message: 'User Followed'
                })
        })
})



router.post('/unfollowuser', (req, res) => {
    const { unfollowfrom, unfollowto } = req.body;

    if (!unfollowfrom || !unfollowto) {
        return res.status(422).json({ error: "Invalid Credentials" })
    }

    User.findOne({ email: unfollowfrom })
        .then(mainuser => {
                mainuser.following.pull(unfollowto)
        })
    User.findOne({ email: unfollowto })
        .then(otheruser => {
           
                otheruser.followers.pull(unfollowfrom)
                otheruser.save()
                res.status(200).send({
                    message: 'User Unfollowed'
                })
            
        })
})


module.exports = router; 
