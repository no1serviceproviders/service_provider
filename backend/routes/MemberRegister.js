const express = require("express")
const router = express.Router()

const {
  login,
  register,
  logout,
  dashboard,
  createOrder,
  verifyPayment,
  verifyUser
} = require("../controllers/authController")

const { verifyToken } = require("../middleware/middleWare")

router.post("/user/login", login)
router.post("/user/register", register)
router.get("/user/logout", logout)
router.get("/verify", verifyToken, verifyUser)
router.get("/dashboard", verifyToken, dashboard)
router.post('/payment/create-order',createOrder)
router.post('/payment/verify',verifyPayment)

module.exports = router
