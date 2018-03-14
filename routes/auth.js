require('dotenv').config()
var mongoose = require('mongoose')
var express = require('express')
var router = express.Router();
var User = require('../models/user')
var bcrypt = require('bcrypt')

var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken')

// router.get('/login', (req, res) =>{

// })

router.post('/login', (req, res, next) => {
    let hashedPass = ''
    let passwordMatch = false

    User.findOne({email: req.body.email}, function(err, user){
        console.log(user)
        hashedPass = user.password 
        passwordMatch = bcrypt.compareSync(req.body.password, hashedPass)
        if(passwordMatch){
            var token = jwt.sign(user.toObject(), process.env.JWT_SECRET, {
                expiresIn: 60 * 60 * 24
            })
            res.json({user, token})
        }else{
            console.log("Passwords do not match")
            res.status(401).json({
                error:true,
                message: "Email/Password is incorrect"
            })
        }
    })
})

router.post('/signup', (req, res, next) => {
    User.findOne({ email: req.body.email}).then((err, user) =>{
        if(user){
            res.redirect('/auth/signup')
        }else{
            User.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            }).then( (err, user) => {
                if(err){
                    res.send(err)
                }else{
                    var token = jwt.sign(user, process.env.JWT_SECRET, {
                        expiresIn: 60 * 60 * 24
                    })
                    res.json({user, token})
                }
            })
        }
    })
})

router.post('/me/from/token', (req, res) => {
    var token = req.body.token
    if(!token){
        res.status(401).json({message: "Must pass the token"})
    }else{
        jwt.verify(token, process.JWT_SECRET, function(err, user){
            if(err){
                res.status(401).send(err)
            }else{
                User.findById({
                    '_id': user._id
                }),function(err,user){
                    if(err){
                        res.status(401).send(err)
                    }else{
                        res.json({user, token})
                    }
                }
            }
        })
    }
})

module.exports = router;