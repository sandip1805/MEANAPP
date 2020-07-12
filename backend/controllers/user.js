const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

/* exports.signupUser = async (req, res, next)=>{
    try {
      const hash = await bcrypt.hash(req.body.password, 10)
      user = new User({
        email:req.body.email,
        password:hash
      })
      const result = await user.save()
      res.json({
        message:'User created successfully!',
        result
      })
    } catch(e) {
        res.status(500).json({
            message:"Invalid authentication credentials!"
        })
    }

  }

exports.loginUser = async (req, res, next)=>{
  try {
    const user = await User.findOne({ email: req.body.email })


    if(!user) {
     return res.status(401).json({message:'Authentication fail!'})
    }

    const result = await bcrypt.compare(req.body.password, user.password)
    if(!result) {
     return res.status(401).json({message:'Authentication fail!'})
    }

    const token = jwt.sign({email: user.email, userId: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'})
    res.status(200).json({token, expiresIn:3600, userId: user._id})
  } catch(e) {
      //res.status(400).json(e)
      res.status(500).json({
        message:"Invalid authentication credentials!"
    })
  }

} */


const signupUser = async (req, res, next)=>{
  try {
    const hash = await bcrypt.hash(req.body.password, 10)
    user = new User({
      email:req.body.email,
      password:hash
    })
    const result = await user.save()
    res.json({
      message:'User created successfully!',
      result
    })
  } catch(e) {
      res.status(500).json({
          message:"Invalid authentication credentials!"
      })
  }

}

const loginUser = async (req, res, next)=>{
  try {
    const user = await User.findOne({ email: req.body.email })


    if(!user) {
     return res.status(401).json({message:'Authentication fail!'})
    }

    const result = await bcrypt.compare(req.body.password, user.password)
    if(!result) {
     return res.status(401).json({message:'Authentication fail!'})
    }

    const token = jwt.sign({email: user.email, userId: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'})
    res.status(200).json({token, expiresIn:3600, userId: user._id})
  } catch(e) {
      //res.status(400).json(e)
      res.status(500).json({
        message:"Invalid authentication credentials!"
    })
  }

}

module.exports = {
  signupUser,
  loginUser
}
