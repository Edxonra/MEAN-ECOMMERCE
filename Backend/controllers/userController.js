const userModel = require('../models/userModel.js')
const generateToken = require('../utils/generateToken.js')

//@desc Create a user
//@route POST /users
//@access Public
const createUser = async(req,res)=>{
  const {name, email, password} = req.body

  const exists = await userModel.findOne({email})

  if(exists){
    res.status(400).send('Email is already in use')
  }
  else{
    const newUser = await userModel.create({
      name, email, password
    })
  
    if(newUser){
      res.status(201).json({
        id:newUser.id,
        name:newUser.name,
        email:newUser.email,
        isAdmin:newUser.isAdmin,
        token:generateToken(newUser.id)
      })
    }
    else{
      res.status(400).send('Invalid user data')
    }
  }
}

//@desc Read all users
//@route GET /users
//@access Admin
const readUsers = async(req,res)=>{
  const allUsers = await userModel.find({})
  res.status(200).json(allUsers)
}

//@desc Log user
//@route POST /users/login
//@access public
const logUser = async(req,res)=>{
  const {email,password } = req.body
  
  const user = await userModel.findOne({email})

  if(user){
    if(await user.matchPassword(password)){
      res.status(200).json({
        id:user.id,
        name:user.name,
        email:user.email,
        isAdmin:user.isAdmin,
        token:generateToken(user.id)
      })
    }
    else{
      res.status(401).send('Wrong password')
    }
  }
  else{
    res.status(404).send('Email do not exists')
  }
}

//@desc Read profile
//@route GET /users/profile
//@access Private
const readProfile = async(req,res)=>{
  const user = await userModel.findById(req.user.id)

  if(user){
    res.status(200).json({
      id:user.id,
      name:user.name,
      email:user.email,
      isAdmin:user.isAdmin
    })
  }
  else{
    res.status(404).send('User not found')
  }
}

//@desc Update profile
//@route PUT /users/profile
//@access Private
const updateProfile = async(req,res)=>{
  const user = await userModel.findById(req.user.id)

  if (user) {
    user.name = req.body.name || user.name
    if(req.body.password){
        user.password = req.body.password
    }
    await user.save()
    res.status(200).json({
      id:user.id,
      name:user.name,
      email:user.email,
      isAdmin:user.isAdmin
    })
  } else {
    res.status(404).send('User not found')
  }
}

// @desc    Update user
// @route   PUT /users/:id
// @access  Admin
const updateUser = async(req,res)=>{
  const user = await userModel.findById(req.params.id)

  if (user) {
    if(req.body.isAdmin!=null){
      user.isAdmin = req.body.isAdmin
      res.status(200).send('User updated')
    }
    else{
      res.status(200).send('User not updated')
    }
  } else {
    res.status(404).send('User not found')
  }
}

module.exports = { createUser,readUsers,logUser,readProfile,updateProfile,updateUser }