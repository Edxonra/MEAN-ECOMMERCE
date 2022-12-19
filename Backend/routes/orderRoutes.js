const express = require("express");
const router = express.Router();
const {protect,admin} = require('../middleware/logMiddleware.js')

const {createOrder,readOrders,readMyOrders,readOrder,updateToPaidOrder,updateToDeliveredOrder} 
  = require('../controllers/orderController.js')

router.route('/').post(protect,createOrder).get(protect,admin,readOrders)
router.route('/myorders').get(protect,readMyOrders)
router.route('/:id').get(protect,readOrder)
router.route('/:id/pay').put(protect,updateToPaidOrder)
router.route('/:id/deliver').put(protect,admin,updateToDeliveredOrder)

module.exports = router