const userModel = require('../models/userModel.js')
const generateToken = require('../utils/generateToken.js')

//@desc   Create a user
//@route  POST /users
//@access Public
const createUser = async(req,res)=>{
  const {name, email, password} = req.body
  if(name&&email&&password){
    const exists = await userModel.findOne({email})
    if (!exists) {
      await userModel.create({
        name, email, password
      })
      res.status(201).send('User created')
    } else {
      res.status(400).send('Email is already in use')
    }
  }
  else{
    res.status(400).send('Invalid user data')
  }
}

//@desc   Log user
//@route  POST /users/login
//@access public
const logUser = async(req,res)=>{
  const {email,password } = req.body
  if(email&&password){
    const user = await userModel.findOne({email})
    if(user){
      if(await user.matchPassword(password)){
        res.status(200).send(generateToken(user.id))
      }
      else{
        res.status(401).send('Wrong password')
      }
    }
    else{
      res.status(404).send('Email do not exists')
    }
  }
  else{
    res.status(400).send('Invalid user data')
  }
}

//@desc   Read all users
//@route  GET /users
//@access Admin
const readUsers = async(req,res)=>{
  const allUsers = await userModel.find({})
  res.status(200).json(allUsers)
}

//@desc   Read profile
//@route  GET /users/profile
//@access Private
const readProfile = async(req,res)=>{
  const {id} = req.user
  const user = await userModel.findById(id)
  res.status(200).json({
    name:user.name,
    email:user.email
  })
}

//@desc   Update profile
//@route  PUT /users/profile
//@access Private
const updateProfile = async(req,res)=>{
  const {name,password} = req.body
  if(name&&password){
    const {id} = req.user
    const user = await userModel.findById(id)
    user.name = name || user.name
    user.password = password || user.password
    await user.save()
    res.status(200).send('Profile updated')
  }
  else{
    res.status(400).send('Invalid user data')
  }
}

// @desc    Update user
// @route   PUT /users/:id
// @access  Admin
const updateUser = async(req,res)=>{
  const {isAdmin} = req.body
  if (isAdmin!=null) {
    const {id} = req.params
    const user = await userModel.findById(id)
    if (user) {
      user.isAdmin = isAdmin
      await user.save()
      res.status(200).send('User updated')
    } else {
      res.status(404).send('User not found')
    }
  } else {
    res.status(400).send('Invalid user data')
  }
}

module.exports = { createUser,readUsers,logUser,readProfile,updateProfile,updateUser }