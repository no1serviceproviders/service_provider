const express = require("express")
const router = express.Router()

const {
  login,
  register,
  logout,
  dashboard,
  createOrder,
  verifyPayment,
  verify,
  profile
} = require("../controllers/authController")

const { verifyToken } = require("../middleware/middleWare")

router.post("/user/register", register)
router.post("/user/login", login)
router.get("/user/verify", verify)
router.get("/user/profile",verifyToken,profile)
router.get("/dashboard", verifyToken, dashboard)
router.post('/payment/create-order',createOrder)
router.post('/payment/verify',verifyPayment)
router.get("/user/logout", logout)

module.exports = router
