const express = require("express");
const router = express.Router();
const {protect,admin} = require('../middleware/logMiddleware.js')

const { createUser,readUsers,logUser,readProfile,updateProfile,updateUser} 
= require('../controllers/userController.js')

router.route('/').post(createUser).get(protect,admin,readUsers)
router.route('/login').post(logUser)
router.route('/profile').get(protect,readProfile).put(protect,updateProfile)
router.route('/:id').put(protect,admin,updateUser)

module.exports = router