const mongoose = require('mongoose')
const userModel = require('./models/userModel.js')
const productModel = require('./models/productModel.js')
const orderModel = require('./models/orderModel.js')

const dotenv = require('dotenv')
const config = require('./config/db.js')

const users = require('./data/users.js')
const products = require('./data/products.js')


dotenv.config()
config.connectDB()

const seed = async()=>{
  try{
    await userModel.deleteMany()
    await productModel.deleteMany()
    await orderModel.deleteMany()

    const createdUsers = await userModel.insertMany(users)
    const owner = createdUsers[1]._id

    const sampleProducts = products.map(product=>{
      return { ...product,user:owner}
    })
    
    await productModel.insertMany(sampleProducts)
  } catch(error){
    console.log(error)
    process.exit(1)
  }
}

module.exports = seed