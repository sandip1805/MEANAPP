const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const postRoutes = require('./routes/posts')
const userRoutes = require('./routes/users')
const app = express()

mongoose.connect(process.env.MONGODB_CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
  console.log('Databse connected successfully!')
})
.catch(()=>{
  console.log('Databse connection failed!')
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded( { extended: false } ))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/', express.static(path.join(__dirname, 'angular_dist')))
app.use((req, res, next)=>{
  res.setHeader("Access-Control-Allow-Origin","*")
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    )
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  )
  next()
})

app.use('/api/posts', postRoutes)
app.use('/api/users', userRoutes)

/* app.use((req, res, next)=>{
  res.sendFile(path.join(__dirname, "angular_dist"))
}) */

app.get('*', function (req, res) {
  //res.sendFile(__dirname + '/angular_dist/index.html');
  res.sendFile(path.join(__dirname, "angular_dist", 'index.html'));
})

module.exports = app
