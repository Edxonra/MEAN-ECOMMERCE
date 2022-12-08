const mongoose = require('mongoose')

const reviewSchema = mongoose.Schema({
  rating:{
      type:Number,
      required:true
  },
  comment:{
      type:String,
      required:true
  },
  user:{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:'userModel'
  }
},{
  timestamps:true
})

const productSchema = mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref:'userModel'
  },
  name:{
    type:String,
    required:true
  },
  image:{
    type:String,
    required:true
  },
  brand:{
      type:String,
      required:true
  },
  category:{
      type:String,
      required:true
  },
  description:{
      type:String,
      required:true
  },
  reviews:[reviewSchema],
  price:{
    type:Number,
    required:true,
    default:0
  },
  countInStock:{
      type:Number,
      required:true,
      default:0
  }
},{
  timestamps:true
})

const productModel = mongoose.model('productModel',productSchema)

module.exports = productModel