const express = require("express")
const router = express.Router()

const {
  login,
  register,
  logout,
  dashboard,
  createOrder,
  verifyPayment
} = require("../controllers/authController")

const { verifyToken } = require("../middleware/middleWare")

router.post("/user/login", login)
router.post("/user/register", register)
router.post("/user/logout", logout)
router.get("/dashboard", verifyToken, dashboard)
router.post('/payment/create-order',createOrder)
router.post('/payment/verify',verifyPayment)

module.exports = router