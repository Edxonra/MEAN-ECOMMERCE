const orderModel = require('../models/orderModel.js')
const userModel = require('../models/userModel.js')

// @desc    Create an order
// @route   POST /orders
// @access  Private
const createOrder = async(req,res)=>{
  const {items,shippingAddress,paymentMethod,taxPrice,shippingPrice} = req.body
  if(items&&shippingAddress&&paymentMethod&&taxPrice&&shippingPrice){
    if(items.length!=0){
      const {id} = req.user
      await orderModel.create({
        user:id,
        items,shippingAddress,paymentMethod,taxPrice,shippingPrice
      })
      res.status(201).send('Order created')
    }
    else{
      res.status(400).send('Empty items')
    }
  }
  else{
    res.status(400).send('Invalid order data')
  }
}

// @desc    Read all orders
// @route   GET /orders
// @access  Admin
const readOrders = async(req,res)=>{
  const orders = await orderModel.find({})
  res.status(200).json(orders)
}

// @desc    Read my orders
// @route   GET /orders/myorders
// @access  Private
const readMyOrders = async(req,res)=>{
  const {id} = req.user
  const orders = await orderModel.find({user:id})
  res.status(200).json(orders)
}

// @desc    Read order
// @route   GET /orders/:id
// @access  Private/Admin
const readOrder = async(req,res)=>{
  const {id:idOrder} = req.params
  const order = await orderModel.findById(idOrder)
  if(order){
    const {id:idUser} = req.user
    const reqUSer = await userModel.findById(idUser)
    if(order.user==idUser || reqUSer.isAdmin){
      res.status(200).json(order)
    }
    else{
      res.status(401).send('Not authorized to read')
    }
  }
  else{
    res.status(404).send('Order not found')
  }
}

// @desc    Update order to paid
// @route   PUT /orders/:id/pay
// @access  Private
const updateToPaidOrder = async(req,res)=>{
  const {id:idOder} = req.params
  const order = await orderModel.findById(idOder)
  if (order) {
    const {id} = req.user
    if(order.user==id){
      const {id:idPayment,status,update_time,payer} = req.body
      order.isPaid = true
      order.paidAt = Date.now()
      order.paymentResult = {
        id:idPayment,
        status: status,
        update_time: update_time,
        email_address: payer.email_address
      }
      await order.save()
      res.status(200).send('Order updated')
    }
    else{
      res.status(401).send('Not authorized to update')
    }
    
  } else {
    res.status(404).send('Order not found')
  }
}

// @desc    Update order to delivered
// @route   PUT /orders/:id/deliver
// @access  Admin
const updateToDeliveredOrder = async(req,res)=>{
  const {id} = req.params
  const order = await orderModel.findById(id)
  if(order){
    if(!order.isDelivered){
      order.isDelivered = true
      order.deliveredAt = Date.now()
      await order.save()
      res.status(200).send('Order updated')
    }
    else{
      res.status(400).send('Order already delivered')
    }
    
  }
  else{
    res.status(404).send('Order not found')
  }
}

module.exports = {createOrder,readOrders,readMyOrders,readOrder,updateToPaidOrder,updateToDeliveredOrder}