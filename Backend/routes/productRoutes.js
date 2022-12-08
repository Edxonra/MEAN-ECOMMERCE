const express = require("express");
const router = express.Router();
const {protect,admin} = require('../middleware/logMiddleware.js')

const {createProduct, readProducts,createReview,readProduct,deleteProduct,updateProduct} = require('../controllers/productController.js')

router.route('/').post(protect,createProduct).get(readProducts)
router.route('/:id/reviews').post(protect,createReview)
router.route('/:id').get(readProduct).delete(protect,deleteProduct).put(protect,updateProduct)

module.exports = router