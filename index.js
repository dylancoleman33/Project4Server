const
  express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  cors = require('cors')
  bodyParser = require('body-parser'),
  jwt = require('jsonwebtoken'),
  dotenv = require('dotenv').load({silent: true}),
  logger = require('morgan'),
  mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/bookclub',
  port = process.env.PORT || 3001,
  User = require('./models/User.js'),
  Book = require('./models/Book.js'),
  Comment = require('./models/Comment.js'),
  request = require('request')

mongoose.connect(mongoUrl, (err) => {
  console.log(err || "Connected to MongoDB.")
})

app.use(cors())
app.use(logger('dev'))
app.use(bodyParser.json())

// root route
app.get('/', (req, res) => {
  res.json({message: "this is the api root page"})
})

// get all userSchema
app.get('/users', (req, res) => {
  User.find({}, (err, allUsers) => {
    if(err) return console.log(err)
    res.send(allUsers)
  })
})

app.get('/books', (req, res) => {
  Book.find({}, (err, allBooks) => {
    if(err) return console.log(err)
    res.send(allBooks)
  })
})

// create a user
app.post('/users', (req, res) => {
  User.create(req.body, function(err, user){
    if(err) return console.log(err)
    res.json({success: true, message: "User created.", user})
  })
})

// create a book
app.post('/books', (req, res) => {
  Book.create(req.body, function(err, book) {
    if(err) return console.log(err)
    res.json({success: true, message: 'book published.', book})
  })
})

// show
app.get('/users/:id', (req, res) => {
  User.findById(req.params.id, function(err, user){
    if(err) return console.log(err)
    res.json(user)
  })
})

// update
app.patch('/users/:id', (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function(err, updatedUser){
    if(err) return console.log(err)
    res.json({message: "User updated", user: updatedUser})
  })
})

// delete
app.delete('/users/:id', function(req, res){
  User.findByIdAndRemove(req.params.id, function(err, deletedUser){
    if(err) return console.log(err)
    res.json({message: "User deleted", deletedUser})
  })
})

// log in a user
app.post('/authenticate', (req, res) => {
  User.findOne({email: req.body.email}, '+password', (err, user) => {
    if(!user || (user && !user.validPassword(req.body.password))) {
      return res.json({success: false, message: "Incorrect email or password."})
    }
    const userData = user.toObject()
    delete userData.password
    const token = jwt.sign(userData, process.env.SECRET)
    res.json({success: true, message: "Logged in successfully.", token})
  })
})

app.listen(port, (err) => {
  console.log(err || `Server running on ${port}.`)
})
