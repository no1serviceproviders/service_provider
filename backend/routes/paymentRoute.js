const express = require('express')
const router = express.Router()

const {createOrder,verifyPayment}= require('../controllers/paymentController')

router.post('/createorder',createOrder)
router.post('/verify',verifyPayment)

module.exports = router;