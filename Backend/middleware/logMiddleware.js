const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel.js')

const protect = async(req,res,next)=>{
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    try {
      const token = req.headers.authorization.split(' ')[1] 
      const decoded = jwt.verify(token,process.env.JWT_SECRET)
      req.user = await userModel.findById(decoded.id).select('-password')
      if(!req.user) throw error
      next()
    } catch (error) {
      res.status(401).send('Token not valid')
    }
  }
  else{
    res.status(401).send('No token on request')
  }
}

const admin = (req,res,next)=>{
  if(req.user && req.user.isAdmin){
    next()
  }
  else{
    res.status(401).send('Not authorized as admin')
  }
}

module.exports = {protect,admin}