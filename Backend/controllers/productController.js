const productModel = require('../models/productModel.js')
const userModel = require('../models/userModel.js')

//@desc Create a product
//@route POST /products
//@access Private
const createProduct = async(req,res)=>{

  const newProduct = await productModel.create({
    user:req.user.id,
    name:'Product name',
    image:'/images/sample.jpg',
    brand:'Product brand',
    category:'Product category',
    description:'Product description',
    price:0,
    countInStock:0
  })

  if (newProduct) {
    res.status(201).json(newProduct)
  } else {
    res.status(400).send('Invalid product data')
  }
}

//@desc Read all products
//@route GET /products
//@access Public
const readProducts = async(req,res)=>{
  const pageSize = 1
  const page = Number(req.query.page) || 1
  const keyword = req.query.keyword ? {
    name:{
      $regex:req.query.keyword,
      $options:'i'
    }
  }:{}

  const count = await productModel.countDocuments({...keyword})
  const products = await productModel.find({...keyword}).sort({updateAt:-1}).limit(pageSize).skip(pageSize*(page-1))
  res.status(200).json({products,page,pages:Math.ceil(count/pageSize)})
}

// @desc    Create product review
// @route   POST /products/:id/reviews
// @access  Private
const createReview = async(req,res)=>{
  const {rating,comment} = req.body

  const product = await productModel.findById(req.params.id)

  if(product){
    const alreadyReviewed = product.reviews.find(
      r=>r.user.toString() === req.user.id.toString()
    )
    if(!alreadyReviewed){
      const review = {
        rating: Number(rating),
        comment,
        user:req.user.id
      }
      product.reviews.push(review)
      await product.save()
      res.status(201).send('Review added successfully')
    }
    else{
      res.status(400).send('Product already reviewed')
    }
  }
  else{
    res.status(404).send('Product not found')
  }
}

// @desc    Read product
// @route   GET /products/:id
// @access  Public
const readProduct = async(req,res)=>{
  const product = await productModel.findById(req.params.id)
  
  if(product){
    res.status(200).json(product)
  }
  else{
    res.status(404).send('Product not found')
  }
}

// @desc    Delete a product
// @route   DELETE /products/:id
// @access  Private
const deleteProduct = async(req,res)=>{
  const product = await productModel.findById(req.params.id)
  
  if(product){
    const user = await userModel.findById(product.user)
    if(user && (req.user.isAdmin || user.id==req.user.id)){
      await product.remove()
      res.status(200).send('Product deleted')
    }
    else{
      res.status(401).send('Not authorized to delete')
    }
  }
  else{
    res.status(404).send('Product not found')
  }
}

// @desc    Update a product
// @route   PUT /products/:id
// @access  Private
const updateProduct = async()=>{
  const {name,image,brand,category,description,price,countInStock} = req.body
  const product = await productModel.findById(req.params.id)

  if (product) {
    product.name = name || product.name,
    product.image = image || product.image,
    product.brand = brand || product.brand,
    product.category = category || product.category,
    product.description = description || product.description,
    product.price = price || product.price,
    product.countInStock = countInStock || product.countInStock
  } else {
    res.status(404).send('Product not found')
  }
}

module.exports = {createProduct,readProducts,createReview,readProduct,deleteProduct,updateProduct}